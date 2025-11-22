/**
 * UnoAdapter - LibreOffice Calc Adapter Implementation
 *
 * Implements ISpreadsheetAdapter interface for LibreOffice Calc using UNO API.
 *
 * IMPORTANT: This file uses ES5 JavaScript syntax for compatibility with
 * LibreOffice's Rhino JavaScript engine. Do not use:
 * - Arrow functions (=>)
 * - const/let (use var)
 * - async/await
 * - Template literals
 * - Spread operator
 * - Destructuring
 */

/* global XSCRIPTCONTEXT */

/**
 * UnoAdapter Constructor
 * Creates a new adapter instance for LibreOffice Calc
 */
function UnoAdapter() {
    this.document = null;
    this.controller = null;
    this.sheets = null;
    this.registeredFunctions = {};
    this.eventListeners = {
        selectionChange: [],
        calculate: [],
        sheetChange: []
    };
    this.isInitialized = false;

    // Initialize the adapter
    this._initialize();
}

/**
 * Initialize the adapter by getting document and controller references
 * @private
 */
UnoAdapter.prototype._initialize = function() {
    try {
        if (typeof XSCRIPTCONTEXT !== 'undefined') {
            this.document = XSCRIPTCONTEXT.getDocument();
            this.controller = this.document.getCurrentController();
            this.sheets = this.document.getSheets();
            this.isInitialized = true;
        }
    } catch (e) {
        console.error('UnoAdapter initialization failed:', e);
        this.isInitialized = false;
    }
};

/**
 * Get the current platform
 * @returns {string} Platform identifier
 */
UnoAdapter.prototype.getPlatform = function() {
    return 'libreoffice';
};

/**
 * Check if the adapter is initialized and ready
 * @returns {Promise<boolean>} Promise resolving to readiness state
 */
UnoAdapter.prototype.isReady = function() {
    var self = this;
    return new Promise(function(resolve) {
        resolve(self.isInitialized && self.document !== null);
    });
};

/**
 * Parse A1 notation address to sheet name, column, and row
 * @private
 * @param {string} address Cell address in A1 notation (e.g., "B5" or "Sheet1!C10")
 * @returns {Object} Object with sheetName, column, and row properties
 */
UnoAdapter.prototype._parseAddress = function(address) {
    var sheetName = null;
    var cellRef = address;

    // Check for sheet name prefix (e.g., "Sheet1!A1")
    if (address.indexOf('!') !== -1) {
        var parts = address.split('!');
        sheetName = parts[0];
        cellRef = parts[1];
    }

    // Parse column letters and row number
    var match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
        throw new Error('Invalid cell address: ' + address);
    }

    var columnLetters = match[1];
    var rowNumber = parseInt(match[2], 10);

    // Convert column letters to zero-based column index
    var column = 0;
    for (var i = 0; i < columnLetters.length; i++) {
        column = column * 26 + (columnLetters.charCodeAt(i) - 65 + 1);
    }
    column = column - 1; // Make zero-based

    return {
        sheetName: sheetName,
        column: column,
        row: rowNumber - 1 // Make zero-based
    };
};

/**
 * Convert column index to letter(s)
 * @private
 * @param {number} column Zero-based column index
 * @returns {string} Column letter(s)
 */
UnoAdapter.prototype._columnToLetter = function(column) {
    var letter = '';
    var temp = column;

    while (temp >= 0) {
        letter = String.fromCharCode((temp % 26) + 65) + letter;
        temp = Math.floor(temp / 26) - 1;
    }

    return letter;
};

/**
 * Get a sheet by name or return active sheet
 * @private
 * @param {string|null} sheetName Sheet name or null for active sheet
 * @returns {Object} UNO sheet object
 */
UnoAdapter.prototype._getSheet = function(sheetName) {
    if (sheetName) {
        if (this.sheets.hasByName(sheetName)) {
            return this.sheets.getByName(sheetName);
        } else {
            throw new Error('Sheet not found: ' + sheetName);
        }
    } else {
        return this.controller.getActiveSheet();
    }
};

/**
 * Get cell object from sheet
 * @private
 * @param {Object} sheet UNO sheet object
 * @param {number} column Zero-based column index
 * @param {number} row Zero-based row index
 * @returns {Object} UNO cell object
 */
UnoAdapter.prototype._getCell = function(sheet, column, row) {
    return sheet.getCellByPosition(column, row);
};

/**
 * Convert UNO cell value to JavaScript value
 * @private
 * @param {Object} cell UNO cell object
 * @returns {*} JavaScript value
 */
UnoAdapter.prototype._getCellValueFromUnoCell = function(cell) {
    var cellType = cell.getType();
    var CellContentType = this.document.createInstance('com.sun.star.table.CellContentType');

    // CellContentType enum values
    var EMPTY = 0;
    var VALUE = 1;
    var TEXT = 2;
    var FORMULA = 3;

    if (cellType === EMPTY) {
        return null;
    } else if (cellType === VALUE) {
        return cell.getValue();
    } else if (cellType === TEXT) {
        return cell.getFormula(); // getFormula() returns text for text cells
    } else if (cellType === FORMULA) {
        // For formulas, return the calculated value
        var value = cell.getValue();
        if (value !== 0) {
            return value;
        }
        return cell.getFormula();
    }

    return null;
};

/**
 * Set cell value in UNO cell
 * @private
 * @param {Object} cell UNO cell object
 * @param {*} value Value to set
 */
UnoAdapter.prototype._setCellValueToUnoCell = function(cell, value) {
    if (value === null || value === undefined) {
        cell.setFormula('');
    } else if (typeof value === 'number') {
        cell.setValue(value);
    } else if (typeof value === 'boolean') {
        cell.setValue(value ? 1 : 0);
    } else if (typeof value === 'string') {
        // Check if it's a formula
        if (value.charAt(0) === '=') {
            cell.setFormula(value);
        } else {
            cell.setFormula(value);
        }
    } else if (value instanceof Date) {
        // Convert Date to serial number (days since 1899-12-30)
        var epoch = new Date(1899, 11, 30);
        var days = (value - epoch) / (24 * 60 * 60 * 1000);
        cell.setValue(days);

        // Set number format to date
        var numberFormats = this.document.getNumberFormats();
        var locale = new Packages.com.sun.star.lang.Locale();
        locale.Language = 'en';
        locale.Country = 'US';
        var dateFormat = numberFormats.queryKey('MM/DD/YYYY', locale, true);
        if (dateFormat === -1) {
            dateFormat = numberFormats.addNew('MM/DD/YYYY', locale);
        }
        cell.setPropertyValue('NumberFormat', dateFormat);
    } else {
        cell.setFormula(String(value));
    }
};

/**
 * Get value from a single cell
 * @param {string} address Cell address in A1 notation
 * @returns {Promise<*>} Promise resolving to cell value
 */
UnoAdapter.prototype.getCellValue = function(address) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var parsed = self._parseAddress(address);
            var sheet = self._getSheet(parsed.sheetName);
            var cell = self._getCell(sheet, parsed.column, parsed.row);
            var value = self._getCellValueFromUnoCell(cell);
            resolve(value);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Set value in a single cell
 * @param {string} address Cell address in A1 notation
 * @param {*} value Value to set
 * @returns {Promise<void>} Promise resolving when complete
 */
UnoAdapter.prototype.setCellValue = function(address, value) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var parsed = self._parseAddress(address);
            var sheet = self._getSheet(parsed.sheetName);
            var cell = self._getCell(sheet, parsed.column, parsed.row);
            self._setCellValueToUnoCell(cell, value);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Get values from a range
 * @param {string} startAddress Start cell address
 * @param {string} endAddress End cell address
 * @returns {Promise<Array<Array>>} Promise resolving to 2D array of values
 */
UnoAdapter.prototype.getRange = function(startAddress, endAddress) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var startParsed = self._parseAddress(startAddress);
            var endParsed = self._parseAddress(endAddress);

            // Ensure both addresses reference the same sheet
            var sheetName = startParsed.sheetName || endParsed.sheetName;
            var sheet = self._getSheet(sheetName);

            var startCol = startParsed.column;
            var startRow = startParsed.row;
            var endCol = endParsed.column;
            var endRow = endParsed.row;

            var result = [];

            for (var row = startRow; row <= endRow; row++) {
                var rowData = [];
                for (var col = startCol; col <= endCol; col++) {
                    var cell = self._getCell(sheet, col, row);
                    var value = self._getCellValueFromUnoCell(cell);
                    rowData.push(value);
                }
                result.push(rowData);
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Set values in a range
 * @param {string} startAddress Start cell address
 * @param {Array<Array>} data 2D array of values
 * @returns {Promise<void>} Promise resolving when complete
 */
UnoAdapter.prototype.setRange = function(startAddress, data) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var startParsed = self._parseAddress(startAddress);
            var sheet = self._getSheet(startParsed.sheetName);

            var startCol = startParsed.column;
            var startRow = startParsed.row;

            for (var rowIdx = 0; rowIdx < data.length; rowIdx++) {
                var rowData = data[rowIdx];
                for (var colIdx = 0; colIdx < rowData.length; colIdx++) {
                    var cell = self._getCell(sheet, startCol + colIdx, startRow + rowIdx);
                    self._setCellValueToUnoCell(cell, rowData[colIdx]);
                }
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Clear values in a range
 * @param {string} startAddress Start cell address
 * @param {string} endAddress End cell address
 * @returns {Promise<void>} Promise resolving when complete
 */
UnoAdapter.prototype.clearRange = function(startAddress, endAddress) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var startParsed = self._parseAddress(startAddress);
            var endParsed = self._parseAddress(endAddress);

            var sheetName = startParsed.sheetName || endParsed.sheetName;
            var sheet = self._getSheet(sheetName);

            var startCol = startParsed.column;
            var startRow = startParsed.row;
            var endCol = endParsed.column;
            var endRow = endParsed.row;

            for (var row = startRow; row <= endRow; row++) {
                for (var col = startCol; col <= endCol; col++) {
                    var cell = self._getCell(sheet, col, row);
                    cell.setFormula('');
                }
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Register a custom function
 * @param {Object} metadata Function metadata
 * @param {Function} implementation Function implementation
 */
UnoAdapter.prototype.registerFunction = function(metadata, implementation) {
    this.registeredFunctions[metadata.name.toUpperCase()] = {
        metadata: metadata,
        implementation: implementation
    };
};

/**
 * Call a custom function programmatically
 * @param {string} name Function name
 * @param {...*} args Arguments
 * @returns {Promise<*>} Promise resolving to function result
 */
UnoAdapter.prototype.callFunction = function(name) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    return new Promise(function(resolve, reject) {
        try {
            var funcName = name.toUpperCase();
            if (!self.registeredFunctions[funcName]) {
                reject(new Error('Function not registered: ' + name));
                return;
            }

            var func = self.registeredFunctions[funcName];
            var result = func.implementation.apply(null, args);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Listen to selection change events
 * @param {Function} handler Event handler function
 * @returns {Function} Unsubscribe function
 */
UnoAdapter.prototype.onSelectionChange = function(handler) {
    var self = this;

    // Create a UNO listener object
    var listener = {
        selectionChanged: function(event) {
            try {
                var selection = self.controller.getSelection();
                if (selection) {
                    var address = selection.getAbsoluteName();
                    handler(address);
                }
            } catch (e) {
                console.error('Selection change handler error:', e);
            }
        }
    };

    // Add listener to controller
    this.controller.addSelectionChangeListener(listener);
    this.eventListeners.selectionChange.push(listener);

    // Return unsubscribe function
    return function() {
        try {
            self.controller.removeSelectionChangeListener(listener);
            var index = self.eventListeners.selectionChange.indexOf(listener);
            if (index > -1) {
                self.eventListeners.selectionChange.splice(index, 1);
            }
        } catch (e) {
            console.error('Error removing selection change listener:', e);
        }
    };
};

/**
 * Listen to calculation complete events
 * @param {Function} handler Event handler function
 * @returns {Function} Unsubscribe function
 */
UnoAdapter.prototype.onCalculate = function(handler) {
    var self = this;

    // Create a modified listener for cell range changes
    var listener = {
        modified: function(event) {
            try {
                handler();
            } catch (e) {
                console.error('Calculate handler error:', e);
            }
        }
    };

    // Add listener to document
    this.document.addModifyListener(listener);
    this.eventListeners.calculate.push(listener);

    // Return unsubscribe function
    return function() {
        try {
            self.document.removeModifyListener(listener);
            var index = self.eventListeners.calculate.indexOf(listener);
            if (index > -1) {
                self.eventListeners.calculate.splice(index, 1);
            }
        } catch (e) {
            console.error('Error removing calculate listener:', e);
        }
    };
};

/**
 * Listen to sheet change events
 * @param {Function} handler Event handler function
 * @returns {Function} Unsubscribe function
 */
UnoAdapter.prototype.onSheetChange = function(handler) {
    var self = this;

    // Create a listener for active sheet changes
    var listener = {
        activeSpreadsheetChanged: function(event) {
            try {
                var activeSheet = self.controller.getActiveSheet();
                var sheetName = activeSheet.getName();
                handler(sheetName);
            } catch (e) {
                console.error('Sheet change handler error:', e);
            }
        }
    };

    // Add listener to controller
    if (this.controller.addActivationEventListener) {
        this.controller.addActivationEventListener(listener);
        this.eventListeners.sheetChange.push(listener);
    }

    // Return unsubscribe function
    return function() {
        try {
            if (self.controller.removeActivationEventListener) {
                self.controller.removeActivationEventListener(listener);
            }
            var index = self.eventListeners.sheetChange.indexOf(listener);
            if (index > -1) {
                self.eventListeners.sheetChange.splice(index, 1);
            }
        } catch (e) {
            console.error('Error removing sheet change listener:', e);
        }
    };
};

/**
 * Show a dialog
 * @param {string} content HTML content or component name
 * @param {Object} options Dialog options
 * @returns {Promise<void>} Promise resolving when dialog is shown
 */
UnoAdapter.prototype.showDialog = function(content, options) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            // Get dialog provider
            var dialogProvider = XSCRIPTCONTEXT.getComponentContext()
                .getServiceManager()
                .createInstanceWithContext(
                    'com.sun.star.awt.DialogProvider',
                    XSCRIPTCONTEXT.getComponentContext()
                );

            // Create dialog model
            var dialogModel = XSCRIPTCONTEXT.getComponentContext()
                .getServiceManager()
                .createInstanceWithContext(
                    'com.sun.star.awt.UnoControlDialogModel',
                    XSCRIPTCONTEXT.getComponentContext()
                );

            // Set dialog properties
            dialogModel.setPropertyValue('Title', options.title || 'Dialog');
            dialogModel.setPropertyValue('Width', options.width || 300);
            dialogModel.setPropertyValue('Height', options.height || 200);

            // Create and show dialog
            var dialog = dialogProvider.createDialog('');
            dialog.setModel(dialogModel);
            dialog.execute();

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Show a task pane (not supported in LibreOffice)
 * @param {string} component Component name or URL
 * @param {Object} options Task pane options
 * @returns {Promise<void>} Promise resolving immediately
 */
UnoAdapter.prototype.showTaskPane = function(component, options) {
    return new Promise(function(resolve) {
        console.warn('Task panes are not supported in LibreOffice');
        resolve();
    });
};

/**
 * Show a notification/message
 * @param {string} message Message text
 * @param {string} type Message type ('info', 'warning', 'error')
 * @returns {Promise<void>} Promise resolving when notification is shown
 */
UnoAdapter.prototype.showNotification = function(message, type) {
    return new Promise(function(resolve, reject) {
        try {
            // Use infobox for notifications
            var toolkit = XSCRIPTCONTEXT.getComponentContext()
                .getServiceManager()
                .createInstanceWithContext(
                    'com.sun.star.awt.Toolkit',
                    XSCRIPTCONTEXT.getComponentContext()
                );

            var messageBox = toolkit.createMessageBox(
                null,
                0, // Rectangle
                type === 'error' ? 'errorbox' : type === 'warning' ? 'warningbox' : 'infobox',
                1, // Buttons
                type.toUpperCase(),
                message
            );

            messageBox.execute();
            resolve();
        } catch (e) {
            // Fallback to console if message box fails
            console.log('[' + type.toUpperCase() + '] ' + message);
            resolve();
        }
    });
};

/**
 * Get list of sheet names
 * @returns {Promise<Array<string>>} Promise resolving to array of sheet names
 */
UnoAdapter.prototype.getSheetNames = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var sheetNames = [];
            var elementNames = self.sheets.getElementNames();

            for (var i = 0; i < elementNames.length; i++) {
                sheetNames.push(elementNames[i]);
            }

            resolve(sheetNames);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Get active sheet name
 * @returns {Promise<string>} Promise resolving to active sheet name
 */
UnoAdapter.prototype.getActiveSheetName = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var activeSheet = self.controller.getActiveSheet();
            var sheetName = activeSheet.getName();
            resolve(sheetName);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Create a new sheet
 * @param {string} name Sheet name
 * @returns {Promise<void>} Promise resolving when sheet is created
 */
UnoAdapter.prototype.createSheet = function(name) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var count = self.sheets.getCount();
            self.sheets.insertNewByName(name, count);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Delete a sheet
 * @param {string} name Sheet name
 * @returns {Promise<void>} Promise resolving when sheet is deleted
 */
UnoAdapter.prototype.deleteSheet = function(name) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            if (self.sheets.hasByName(name)) {
                self.sheets.removeByName(name);
                resolve();
            } else {
                reject(new Error('Sheet not found: ' + name));
            }
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Get selected range address
 * @returns {Promise<string>} Promise resolving to range address in A1 notation
 */
UnoAdapter.prototype.getSelectedRange = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            var selection = self.controller.getSelection();
            if (selection) {
                var rangeAddress = selection.getAbsoluteName();
                resolve(rangeAddress);
            } else {
                reject(new Error('No selection found'));
            }
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Set selected range
 * @param {string} address Range address in A1 notation
 * @returns {Promise<void>} Promise resolving when selection is set
 */
UnoAdapter.prototype.setSelectedRange = function(address) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            // Parse the address to determine if it includes a range
            var sheetName = null;
            var rangeRef = address;

            if (address.indexOf('!') !== -1) {
                var parts = address.split('!');
                sheetName = parts[0];
                rangeRef = parts[1];
            }

            var sheet = self._getSheet(sheetName);

            // Parse range (e.g., "A1:B10")
            var rangeParts = rangeRef.split(':');
            var startParsed = self._parseAddress(rangeParts[0]);
            var endParsed = rangeParts.length > 1 ?
                self._parseAddress(rangeParts[1]) :
                startParsed;

            // Get cell range
            var cellRange = sheet.getCellRangeByPosition(
                startParsed.column,
                startParsed.row,
                endParsed.column,
                endParsed.row
            );

            // Select the range
            self.controller.select(cellRange);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Execute a batch of operations efficiently
 * @param {Function} operations Function containing operations to execute
 * @returns {Promise<*>} Promise resolving to result of operations
 */
UnoAdapter.prototype.batch = function(operations) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            // Lock controllers to prevent screen updates
            self.document.lockControllers();

            // Execute operations
            var result = operations();

            // If result is a promise, wait for it
            if (result && typeof result.then === 'function') {
                result.then(function(value) {
                    self.document.unlockControllers();
                    resolve(value);
                }).catch(function(error) {
                    self.document.unlockControllers();
                    reject(error);
                });
            } else {
                self.document.unlockControllers();
                resolve(result);
            }
        } catch (e) {
            self.document.unlockControllers();
            reject(e);
        }
    });
};

/**
 * Refresh/recalculate all formulas
 * @returns {Promise<void>} Promise resolving when recalculation is complete
 */
UnoAdapter.prototype.recalculate = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            self.document.calculateAll();
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

// Export the UnoAdapter
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnoAdapter: UnoAdapter };
}
