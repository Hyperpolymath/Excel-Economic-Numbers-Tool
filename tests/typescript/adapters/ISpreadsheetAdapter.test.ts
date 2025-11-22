import { detectPlatform, Platform } from '../../../src/typescript/adapters/ISpreadsheetAdapter';

describe('ISpreadsheetAdapter', () => {
  describe('detectPlatform', () => {
    it('should detect unknown platform in test environment', () => {
      const platform = detectPlatform();
      expect(platform).toBe(Platform.Unknown);
    });

    it('should detect Excel when Office is available', () => {
      (global as any).window = { Office: {} };
      const platform = detectPlatform();
      expect(platform).toBe(Platform.Excel);
      delete (global as any).window;
    });

    it('should detect LibreOffice when XSCRIPTCONTEXT is available', () => {
      (global as any).window = { XSCRIPTCONTEXT: {} };
      const platform = detectPlatform();
      expect(platform).toBe(Platform.LibreOffice);
      delete (global as any).window;
    });
  });
});
