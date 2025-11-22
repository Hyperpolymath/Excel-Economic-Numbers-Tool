/**
 * OfficeJsAdapter - Microsoft Excel Office.js Implementation
 *
 * Implements ISpreadsheetAdapter interface using Microsoft Office.js API
 * for Excel add-ins and web-based Excel interactions.
 */

import {
    ISpreadsheetAdapter,
    Platform,
    CellAddress,
    RangeAddress,
    CellValue,
    CellMatrix,
    CustomFunctionMetadata,
    DialogOptions,
    TaskPaneOptions
} from './ISpreadsheetAdapter';

/**
 * OfficeJsAdapter class implements spreadsheet operations using Office.js API
 */
export class OfficeJsAdapter implements ISpreadsheetAdapter {
    private customFunctions: Map<string, (...args: any[]) => any>;
    private selectionChangeHandlers: Set<(address: CellAddress) => void>;
    private calculateHandlers: Set<() => void>;
    private sheetChangeHandlers: Set<(sheetName: string) => void>;
    private initialized: boolean;
    private initPromise: Promise<void> | null;

    constructor() {
        this.customFunctions = new Map();
        this.selectionChangeHandlers = new Set();
        this.calculateHandlers = new Set();
        this.sheetChangeHandlers = new Set();
        this.initialized = false;
        this.initPromise = null;
        this.initialize();
    }

    /**
     * Initialize the Office.js environment
     * @private
     */
    private async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        if (!this.initPromise) {
            this.initPromise = new Promise<void>((resolve, reject) => {
                if (typeof Office === 'undefined') {
                    reject(new Error('Office.js is not loaded'));
                    return;
                }

                Office.onReady(() => {
                    this.initialized = true;
                    resolve();
                });
            });
        }

        return this.initPromise;
    }

    /**
     * Get the current platform (always returns Excel for this adapter)
     * @returns Platform.Excel
     */
    getPlatform(): Platform {
        return Platform.Excel;
    }

    /**
     * Check if the adapter is initialized and ready to use
     * @returns Promise resolving to true if ready
     */
    async isReady(): Promise<boolean> {
        try {
            await this.initialize();
            return this.initialized;
        } catch (error) {
            return false;
        }
    }

    // ===== Cell Operations =====

    /**
     * Get value from a single cell
     * @param address Cell address in A1 notation (e.g., "B5" or "Sheet1!C10")
     * @returns Promise resolving to the cell value
     * @throws Error if cell cannot be accessed
     */
    async getCellValue(address: CellAddress): Promise<CellValue> {
        await this.initialize();

        try {
            return await Excel.run(async (context) => {
                const { sheetName, cellAddress } = this.parseAddress(address);
                let worksheet: Excel.Worksheet;

                if (sheetName) {
                    worksheet = context.workbook.worksheets.getItem(sheetName);
                } else {
                    worksheet = context.workbook.worksheets.getActiveWorksheet();
                }

                const range = worksheet.getRange(cellAddress);
                range.load('values');

                await context.sync();

                if (range.values && range.values.length > 0 && range.values[0].length > 0) {
                    return this.normalizeValue(range.values[0][0]);
                }

                return null;
            });
        } catch (error) {
            throw new Error(`Failed to get cell value at ${address}: ${(error as Error).message}`);
        }
    }

    /**
     * Set value in a single cell
     * @param address Cell address in A1 notation
     * @param value Value to set
     * @throws Error if cell cannot be set
     */
    async setCellValue(address: CellAddress, value: CellValue): Promise<void> {
        await this.initialize();

        try {
            await Excel.run(async (context) => {
                const { sheetName, cellAddress } = this.parseAddress(address);
                let worksheet: Excel.Worksheet;

                if (sheetName) {
                    worksheet = context.workbook.worksheets.getItem(sheetName);
                } else {
                    worksheet = context.workbook.worksheets.getActiveWorksheet();
                }

                const range = worksheet.getRange(cellAddress);
                range.values = [[value === null || value === undefined ? '' : value]];

                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to set cell value at ${address}: ${(error as Error).message}`);
        }
    }

    /**
     * Get values from a range
     * @param startAddress Start cell address (e.g., "A1")
     * @param endAddress End cell address (e.g., "C10")
     * @returns Promise resolving to 2D array of values
     * @throws Error if range cannot be accessed
     */
    async getRange(startAddress: CellAddress, endAddress: CellAddress): Promise<CellMatrix> {
        await this.initialize();

        try {
            return await Excel.run(async (context) => {
                const { sheetName: startSheet, cellAddress: start } = this.parseAddress(startAddress);
                const { cellAddress: end } = this.parseAddress(endAddress);
                const sheetName = startSheet;

                let worksheet: Excel.Worksheet;

                if (sheetName) {
                    worksheet = context.workbook.worksheets.getItem(sheetName);
                } else {
                    worksheet = context.workbook.worksheets.getActiveWorksheet();
                }

                const rangeAddress = `${start}:${end}`;
                const range = worksheet.getRange(rangeAddress);
                range.load('values');

                await context.sync();

                return this.normalizeMatrix(range.values as any[][]);
            });
        } catch (error) {
            throw new Error(`Failed to get range ${startAddress}:${endAddress}: ${(error as Error).message}`);
        }
    }

    /**
     * Set values in a range
     * @param startAddress Start cell address where data will be placed
     * @param data 2D array of values to set
     * @throws Error if range cannot be set
     */
    async setRange(startAddress: CellAddress, data: CellMatrix): Promise<void> {
        await this.initialize();

        if (!data || data.length === 0 || data[0].length === 0) {
            throw new Error('Data matrix cannot be empty');
        }

        try {
            await Excel.run(async (context) => {
                const { sheetName, cellAddress } = this.parseAddress(startAddress);
                let worksheet: Excel.Worksheet;

                if (sheetName) {
                    worksheet = context.workbook.worksheets.getItem(sheetName);
                } else {
                    worksheet = context.workbook.worksheets.getActiveWorksheet();
                }

                const rows = data.length;
                const cols = data[0].length;

                const endCell = this.calculateEndAddress(cellAddress, rows - 1, cols - 1);
                const rangeAddress = `${cellAddress}:${endCell}`;

                const range = worksheet.getRange(rangeAddress);
                range.values = data.map(row =>
                    row.map(cell => cell === null || cell === undefined ? '' : cell)
                );

                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to set range at ${startAddress}: ${(error as Error).message}`);
        }
    }

    /**
     * Clear values in a range
     * @param startAddress Start cell address
     * @param endAddress End cell address
     * @throws Error if range cannot be cleared
     */
    async clearRange(startAddress: CellAddress, endAddress: CellAddress): Promise<void> {
        await this.initialize();

        try {
            await Excel.run(async (context) => {
                const { sheetName: startSheet, cellAddress: start } = this.parseAddress(startAddress);
                const { cellAddress: end } = this.parseAddress(endAddress);
                const sheetName = startSheet;

                let worksheet: Excel.Worksheet;

                if (sheetName) {
                    worksheet = context.workbook.worksheets.getItem(sheetName);
                } else {
                    worksheet = context.workbook.worksheets.getActiveWorksheet();
                }

                const rangeAddress = `${start}:${end}`;
                const range = worksheet.getRange(rangeAddress);
                range.clear(Excel.ClearApplyTo.contents);

                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to clear range ${startAddress}:${endAddress}: ${(error as Error).message}`);
        }
    }

    // ===== Custom Functions =====

    /**
     * Register a custom function
     * Note: In Office.js, custom functions must be declared in manifest.xml
     * This method stores the function implementation for programmatic calling
     * @param metadata Function metadata
     * @param implementation Function implementation
     */
    registerFunction(
        metadata: CustomFunctionMetadata,
        implementation: (...args: any[]) => any
    ): void {
        if (!metadata.name) {
            throw new Error('Function name is required');
        }

        this.customFunctions.set(metadata.name.toUpperCase(), implementation);

        // Note: For Office.js, custom functions must also be registered in manifest.xml
        // and the functions.json file. This is just storing the implementation.
        console.log(`Custom function ${metadata.name} registered. Ensure it's also declared in manifest.xml`);
    }

    /**
     * Call a custom function programmatically
     * @param name Function name
     * @param args Function arguments
     * @returns Promise resolving to function result
     * @throws Error if function is not registered
     */
    async callFunction(name: string, ...args: any[]): Promise<any> {
        const funcName = name.toUpperCase();
        const func = this.customFunctions.get(funcName);

        if (!func) {
            throw new Error(`Function ${name} is not registered`);
        }

        try {
            const result = await func(...args);
            return result;
        } catch (error) {
            throw new Error(`Error calling function ${name}: ${(error as Error).message}`);
        }
    }

    // ===== Events =====

    /**
     * Listen to selection change events
     * @param handler Event handler that receives the new selection address
     * @returns Unsubscribe function
     */
    onSelectionChange(handler: (address: CellAddress) => void): () => void {
        this.selectionChangeHandlers.add(handler);

        // Register Office.js event handler (only once)
        if (this.selectionChangeHandlers.size === 1) {
            this.initialize().then(() => {
                Excel.run(async (context) => {
                    const worksheet = context.workbook.worksheets.getActiveWorksheet();
                    worksheet.onSelectionChanged.add(async (event) => {
                        const address = event.address;
                        this.selectionChangeHandlers.forEach(h => h(address));
                    });
                    await context.sync();
                }).catch(error => {
                    console.error('Failed to register selection change handler:', error);
                });
            });
        }

        // Return unsubscribe function
        return () => {
            this.selectionChangeHandlers.delete(handler);
        };
    }

    /**
     * Listen to calculation complete events
     * @param handler Event handler called when calculation completes
     * @returns Unsubscribe function
     */
    onCalculate(handler: () => void): () => void {
        this.calculateHandlers.add(handler);

        // Register Office.js event handler (only once)
        if (this.calculateHandlers.size === 1) {
            this.initialize().then(() => {
                Excel.run(async (context) => {
                    context.workbook.worksheets.onCalculated.add(async () => {
                        this.calculateHandlers.forEach(h => h());
                    });
                    await context.sync();
                }).catch(error => {
                    console.error('Failed to register calculation handler:', error);
                });
            });
        }

        // Return unsubscribe function
        return () => {
            this.calculateHandlers.delete(handler);
        };
    }

    /**
     * Listen to sheet change events (when active sheet changes)
     * @param handler Event handler that receives the new sheet name
     * @returns Unsubscribe function
     */
    onSheetChange(handler: (sheetName: string) => void): () => void {
        this.sheetChangeHandlers.add(handler);

        // Register Office.js event handler (only once)
        if (this.sheetChangeHandlers.size === 1) {
            this.initialize().then(() => {
                Excel.run(async (context) => {
                    context.workbook.worksheets.onActivated.add(async (event) => {
                        Excel.run(async (ctx) => {
                            const sheet = ctx.workbook.worksheets.getItem(event.worksheetId);
                            sheet.load('name');
                            await ctx.sync();
                            this.sheetChangeHandlers.forEach(h => h(sheet.name));
                        });
                    });
                    await context.sync();
                }).catch(error => {
                    console.error('Failed to register sheet change handler:', error);
                });
            });
        }

        // Return unsubscribe function
        return () => {
            this.sheetChangeHandlers.delete(handler);
        };
    }

    // ===== UI =====

    /**
     * Show a dialog
     * @param content HTML content URL or component name
     * @param options Dialog options (title, width, height)
     * @throws Error if dialog cannot be displayed
     */
    async showDialog(content: string, options: DialogOptions): Promise<void> {
        await this.initialize();

        return new Promise<void>((resolve, reject) => {
            try {
                const dialogUrl = this.resolveContentUrl(content);
                const width = options.width || 400;
                const height = options.height || 300;

                Office.context.ui.displayDialogAsync(
                    dialogUrl,
                    { height: (height / window.innerHeight) * 100, width: (width / window.innerWidth) * 100 },
                    (result) => {
                        if (result.status === Office.AsyncResultStatus.Failed) {
                            reject(new Error(`Failed to show dialog: ${result.error.message}`));
                        } else {
                            const dialog = result.value;

                            dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg: any) => {
                                dialog.close();
                                resolve();
                            });

                            dialog.addEventHandler(Office.EventType.DialogEventReceived, (arg: any) => {
                                if (arg.error === 12006) {
                                    // Dialog closed by user
                                    resolve();
                                }
                            });
                        }
                    }
                );
            } catch (error) {
                reject(new Error(`Failed to display dialog: ${(error as Error).message}`));
            }
        });
    }

    /**
     * Show a task pane
     * @param component Component name or URL
     * @param options Task pane options (title, url, width)
     * @throws Error if task pane cannot be displayed
     */
    async showTaskPane(component: string, options: TaskPaneOptions): Promise<void> {
        await this.initialize();

        return new Promise<void>((resolve, reject) => {
            try {
                const url = options.url || this.resolveContentUrl(component);
                const width = options.width || 300;

                // In Office.js, task panes are typically shown via displayDialogAsync
                // as true task panes are defined in manifest
                Office.context.ui.displayDialogAsync(
                    url,
                    {
                        height: 100,
                        width: (width / window.innerWidth) * 100,
                        displayInIframe: true
                    },
                    (result) => {
                        if (result.status === Office.AsyncResultStatus.Failed) {
                            reject(new Error(`Failed to show task pane: ${result.error.message}`));
                        } else {
                            resolve();
                        }
                    }
                );
            } catch (error) {
                reject(new Error(`Failed to display task pane: ${(error as Error).message}`));
            }
        });
    }

    /**
     * Show a notification/message
     * @param message Message text
     * @param type Message type (info, warning, error)
     */
    async showNotification(message: string, type: 'info' | 'warning' | 'error'): Promise<void> {
        await this.initialize();

        try {
            await Excel.run(async (context) => {
                // Use Office notification API
                if (Office.context.ui && (Office.context.ui as any).messageParent) {
                    // If in dialog, send to parent
                    (Office.context.ui as any).messageParent(JSON.stringify({ message, type }));
                } else if ((Office.context as any).displayMessageAsync) {
                    // Use display message if available
                    (Office.context as any).displayMessageAsync(message);
                } else {
                    // Fallback: insert a comment or use console
                    console.log(`[${type.toUpperCase()}] ${message}`);

                    // Alternative: Show in a cell comment
                    const worksheet = context.workbook.worksheets.getActiveWorksheet();
                    const range = worksheet.getRange('A1');
                    const comment = range.getComment();
                    comment.content = `[${type.toUpperCase()}] ${message}`;
                    await context.sync();
                }
            });
        } catch (error) {
            // Fallback to console if all else fails
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // ===== Sheets =====

    /**
     * Get list of all sheet names in the workbook
     * @returns Promise resolving to array of sheet names
     * @throws Error if sheets cannot be accessed
     */
    async getSheetNames(): Promise<string[]> {
        await this.initialize();

        try {
            return await Excel.run(async (context) => {
                const sheets = context.workbook.worksheets;
                sheets.load('items/name');
                await context.sync();

                return sheets.items.map(sheet => sheet.name);
            });
        } catch (error) {
            throw new Error(`Failed to get sheet names: ${(error as Error).message}`);
        }
    }

    /**
     * Get the name of the currently active sheet
     * @returns Promise resolving to active sheet name
     * @throws Error if active sheet cannot be accessed
     */
    async getActiveSheetName(): Promise<string> {
        await this.initialize();

        try {
            return await Excel.run(async (context) => {
                const activeSheet = context.workbook.worksheets.getActiveWorksheet();
                activeSheet.load('name');
                await context.sync();

                return activeSheet.name;
            });
        } catch (error) {
            throw new Error(`Failed to get active sheet name: ${(error as Error).message}`);
        }
    }

    /**
     * Create a new sheet with the specified name
     * @param name Name for the new sheet
     * @throws Error if sheet cannot be created
     */
    async createSheet(name: string): Promise<void> {
        await this.initialize();

        if (!name) {
            throw new Error('Sheet name is required');
        }

        try {
            await Excel.run(async (context) => {
                const sheets = context.workbook.worksheets;
                sheets.add(name);
                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to create sheet ${name}: ${(error as Error).message}`);
        }
    }

    /**
     * Delete a sheet by name
     * @param name Name of the sheet to delete
     * @throws Error if sheet cannot be deleted
     */
    async deleteSheet(name: string): Promise<void> {
        await this.initialize();

        if (!name) {
            throw new Error('Sheet name is required');
        }

        try {
            await Excel.run(async (context) => {
                const sheet = context.workbook.worksheets.getItem(name);
                sheet.delete();
                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to delete sheet ${name}: ${(error as Error).message}`);
        }
    }

    // ===== Utilities =====

    /**
     * Get the currently selected range address
     * @returns Promise resolving to range address in A1 notation
     * @throws Error if selection cannot be accessed
     */
    async getSelectedRange(): Promise<RangeAddress> {
        await this.initialize();

        try {
            return await Excel.run(async (context) => {
                const range = context.workbook.getSelectedRange();
                range.load('address');
                await context.sync();

                return range.address;
            });
        } catch (error) {
            throw new Error(`Failed to get selected range: ${(error as Error).message}`);
        }
    }

    /**
     * Set the selected range
     * @param address Range address to select
     * @throws Error if range cannot be selected
     */
    async setSelectedRange(address: RangeAddress): Promise<void> {
        await this.initialize();

        try {
            await Excel.run(async (context) => {
                const { sheetName, cellAddress } = this.parseAddress(address);
                let worksheet: Excel.Worksheet;

                if (sheetName) {
                    worksheet = context.workbook.worksheets.getItem(sheetName);
                    worksheet.activate();
                } else {
                    worksheet = context.workbook.worksheets.getActiveWorksheet();
                }

                const range = worksheet.getRange(cellAddress);
                range.select();

                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to set selected range to ${address}: ${(error as Error).message}`);
        }
    }

    /**
     * Execute a batch of operations efficiently
     * Uses Excel.run to batch multiple operations into a single sync
     * @param operations Function containing operations to batch
     * @returns Promise resolving to result of operations
     * @throws Error if batch operations fail
     */
    async batch<T>(operations: () => Promise<T>): Promise<T> {
        await this.initialize();

        try {
            return await Excel.run(async (context) => {
                const result = await operations();
                await context.sync();
                return result;
            });
        } catch (error) {
            throw new Error(`Batch operation failed: ${(error as Error).message}`);
        }
    }

    /**
     * Refresh/recalculate all formulas in the workbook
     * @throws Error if recalculation fails
     */
    async recalculate(): Promise<void> {
        await this.initialize();

        try {
            await Excel.run(async (context) => {
                context.workbook.application.calculate(Excel.CalculationType.full);
                await context.sync();
            });
        } catch (error) {
            throw new Error(`Failed to recalculate: ${(error as Error).message}`);
        }
    }

    // ===== Private Helper Methods =====

    /**
     * Parse cell address to extract sheet name and cell address
     * @param address Address string (e.g., "Sheet1!A1" or "B5")
     * @returns Object with sheetName and cellAddress
     * @private
     */
    private parseAddress(address: string): { sheetName: string | null; cellAddress: string } {
        const parts = address.split('!');

        if (parts.length === 2) {
            return {
                sheetName: parts[0].replace(/^'|'$/g, ''), // Remove quotes if present
                cellAddress: parts[1]
            };
        }

        return {
            sheetName: null,
            cellAddress: address
        };
    }

    /**
     * Calculate end cell address from start address and dimensions
     * @param startAddress Starting cell (e.g., "A1")
     * @param rowOffset Number of rows to offset (0-based)
     * @param colOffset Number of columns to offset (0-based)
     * @returns End cell address
     * @private
     */
    private calculateEndAddress(startAddress: string, rowOffset: number, colOffset: number): string {
        const match = startAddress.match(/^([A-Z]+)(\d+)$/);

        if (!match) {
            throw new Error(`Invalid cell address: ${startAddress}`);
        }

        const col = match[1];
        const row = parseInt(match[2], 10);

        const endCol = this.offsetColumn(col, colOffset);
        const endRow = row + rowOffset;

        return `${endCol}${endRow}`;
    }

    /**
     * Offset a column letter by a number of columns
     * @param col Column letter (e.g., "A", "Z", "AA")
     * @param offset Number of columns to offset
     * @returns New column letter
     * @private
     */
    private offsetColumn(col: string, offset: number): string {
        let colNum = 0;

        for (let i = 0; i < col.length; i++) {
            colNum = colNum * 26 + (col.charCodeAt(i) - 64);
        }

        colNum += offset;

        let result = '';
        while (colNum > 0) {
            const remainder = (colNum - 1) % 26;
            result = String.fromCharCode(65 + remainder) + result;
            colNum = Math.floor((colNum - 1) / 26);
        }

        return result || 'A';
    }

    /**
     * Normalize a single value from Excel
     * @param value Raw value from Excel
     * @returns Normalized CellValue
     * @private
     */
    private normalizeValue(value: any): CellValue {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value;
        }

        if (value instanceof Date) {
            return value;
        }

        // Try to parse as number
        const num = Number(value);
        if (!isNaN(num)) {
            return num;
        }

        // Default to string
        return String(value);
    }

    /**
     * Normalize a matrix of values from Excel
     * @param matrix Raw matrix from Excel
     * @returns Normalized CellMatrix
     * @private
     */
    private normalizeMatrix(matrix: any[][]): CellMatrix {
        return matrix.map(row => row.map(cell => this.normalizeValue(cell)));
    }

    /**
     * Resolve content URL for dialogs and task panes
     * @param content Content identifier or URL
     * @returns Full URL
     * @private
     */
    private resolveContentUrl(content: string): string {
        // If already a full URL, return as is
        if (content.startsWith('http://') || content.startsWith('https://')) {
            return content;
        }

        // If starts with /, assume relative to origin
        if (content.startsWith('/')) {
            return `${window.location.origin}${content}`;
        }

        // Otherwise, assume relative to current path
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        return `${window.location.origin}${basePath}/${content}`;
    }
}
