/**
 * ISpreadsheetAdapter - Cross-Platform Abstraction Interface
 *
 * Unified interface for both Microsoft Excel (Office.js) and LibreOffice Calc (UNO API).
 * Allows single codebase to work across both platforms.
 */

/**
 * Cell address in A1 notation (e.g., "B5", "Sheet1!C10")
 */
export type CellAddress = string;

/**
 * Range address in A1 notation (e.g., "A1:B10", "Sheet1!C5:E15")
 */
export type RangeAddress = string;

/**
 * Cell value types
 */
export type CellValue = string | number | boolean | Date | null | undefined;

/**
 * 2D array of cell values
 */
export type CellMatrix = CellValue[][];

/**
 * Custom function metadata for registration
 */
export interface CustomFunctionMetadata {
    name: string;
    description: string;
    parameters: Array<{
        name: string;
        description: string;
        type: 'string' | 'number' | 'boolean' | 'range';
    }>;
    returnType: 'string' | 'number' | 'boolean' | 'range';
}

/**
 * Dialog options
 */
export interface DialogOptions {
    title: string;
    width?: number;
    height?: number;
}

/**
 * Task pane options
 */
export interface TaskPaneOptions {
    title: string;
    url: string;
    width?: number;
}

/**
 * Platform detection result
 */
export enum Platform {
    Excel = 'excel',
    LibreOffice = 'libreoffice',
    Web = 'web',
    Unknown = 'unknown'
}

/**
 * Main adapter interface - implemented by platform-specific adapters
 */
export interface ISpreadsheetAdapter {
    /**
     * Get the current platform
     */
    getPlatform(): Platform;

    /**
     * Check if the adapter is initialized and ready
     */
    isReady(): Promise<boolean>;

    // ===== Cell Operations =====

    /**
     * Get value from a single cell
     * @param address Cell address in A1 notation
     */
    getCellValue(address: CellAddress): Promise<CellValue>;

    /**
     * Set value in a single cell
     * @param address Cell address in A1 notation
     * @param value Value to set
     */
    setCellValue(address: CellAddress, value: CellValue): Promise<void>;

    /**
     * Get values from a range
     * @param startAddress Start cell address
     * @param endAddress End cell address
     */
    getRange(startAddress: CellAddress, endAddress: CellAddress): Promise<CellMatrix>;

    /**
     * Set values in a range
     * @param startAddress Start cell address
     * @param data 2D array of values
     */
    setRange(startAddress: CellAddress, data: CellMatrix): Promise<void>;

    /**
     * Clear values in a range
     * @param startAddress Start cell address
     * @param endAddress End cell address
     */
    clearRange(startAddress: CellAddress, endAddress: CellAddress): Promise<void>;

    // ===== Custom Functions =====

    /**
     * Register a custom function
     * @param metadata Function metadata
     * @param implementation Function implementation
     */
    registerFunction(
        metadata: CustomFunctionMetadata,
        implementation: (...args: any[]) => any
    ): void;

    /**
     * Call a custom function programmatically
     * @param name Function name
     * @param args Arguments
     */
    callFunction(name: string, ...args: any[]): Promise<any>;

    // ===== Events =====

    /**
     * Listen to selection change events
     * @param handler Event handler
     * @returns Unsubscribe function
     */
    onSelectionChange(handler: (address: CellAddress) => void): () => void;

    /**
     * Listen to calculation complete events
     * @param handler Event handler
     * @returns Unsubscribe function
     */
    onCalculate(handler: () => void): () => void;

    /**
     * Listen to sheet change events
     * @param handler Event handler
     * @returns Unsubscribe function
     */
    onSheetChange(handler: (sheetName: string) => void): () => void;

    // ===== UI =====

    /**
     * Show a dialog
     * @param content HTML content or component name
     * @param options Dialog options
     */
    showDialog(content: string, options: DialogOptions): Promise<void>;

    /**
     * Show a task pane
     * @param component Component name or URL
     * @param options Task pane options
     */
    showTaskPane(component: string, options: TaskPaneOptions): Promise<void>;

    /**
     * Show a notification/message
     * @param message Message text
     * @param type Message type
     */
    showNotification(message: string, type: 'info' | 'warning' | 'error'): Promise<void>;

    // ===== Sheets =====

    /**
     * Get list of sheet names
     */
    getSheetNames(): Promise<string[]>;

    /**
     * Get active sheet name
     */
    getActiveSheetName(): Promise<string>;

    /**
     * Create a new sheet
     * @param name Sheet name
     */
    createSheet(name: string): Promise<void>;

    /**
     * Delete a sheet
     * @param name Sheet name
     */
    deleteSheet(name: string): Promise<void>;

    // ===== Utilities =====

    /**
     * Get selected range address
     */
    getSelectedRange(): Promise<RangeAddress>;

    /**
     * Set selected range
     * @param address Range address
     */
    setSelectedRange(address: RangeAddress): Promise<void>;

    /**
     * Execute a batch of operations efficiently
     * @param operations Function containing operations
     */
    batch<T>(operations: () => Promise<T>): Promise<T>;

    /**
     * Refresh/recalculate all formulas
     */
    recalculate(): Promise<void>;
}

/**
 * Factory function to create appropriate adapter for current platform
 */
export function createAdapter(): ISpreadsheetAdapter {
    // Detect platform
    if (typeof (window as any).Office !== 'undefined') {
        // Office.js detected - Excel
        const { OfficeJsAdapter } = require('./OfficeJsAdapter');
        return new OfficeJsAdapter();
    } else if (typeof (window as any).XSCRIPTCONTEXT !== 'undefined') {
        // UNO context detected - LibreOffice
        const { UnoAdapter } = require('./UnoAdapter');
        return new UnoAdapter();
    } else {
        throw new Error('Unknown platform - neither Office.js nor UNO detected');
    }
}

/**
 * Detect current platform without creating adapter
 */
export function detectPlatform(): Platform {
    if (typeof (window as any).Office !== 'undefined') {
        return Platform.Excel;
    } else if (typeof (window as any).XSCRIPTCONTEXT !== 'undefined') {
        return Platform.LibreOffice;
    } else if (typeof window !== 'undefined') {
        return Platform.Web;
    } else {
        return Platform.Unknown;
    }
}
