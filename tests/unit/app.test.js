// Example unit test for app.js using Vitest
import { describe, it, expect } from 'vitest';

// Example: test a utility function (replace with real ones from app.js)
import { isPDFFile } from '../app';

describe('isPDFFile', () => {
  it('returns true for .pdf files', () => {
    expect(isPDFFile('file.pdf')).toBe(true);
    expect(isPDFFile('document.PDF')).toBe(true);
  });
  it('returns false for non-pdf files', () => {
    expect(isPDFFile('file.png')).toBe(false);
    expect(isPDFFile('file.docx')).toBe(false);
  });
});
