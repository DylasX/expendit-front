import { describe, it, expect } from 'vitest';
import { colors } from './color';

describe('color utility', () => {
  it('should export an array of colors', () => {
    expect(colors).toBeDefined();
    expect(Array.isArray(colors)).toBe(true);
  });

  it('should contain 10 colors', () => {
    expect(colors).toHaveLength(10);
  });

  it('should contain valid hex color codes', () => {
    colors.forEach((color) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('should contain expected color values', () => {
    expect(colors).toContain('#dc2626');
    expect(colors).toContain('#ea580c');
    expect(colors).toContain('#65a30d');
    expect(colors).toContain('#059669');
    expect(colors).toContain('#0891b2');
    expect(colors).toContain('#353839');
    expect(colors).toContain('#7c3aed');
    expect(colors).toContain('#c026d3');
    expect(colors).toContain('#e11d48');
    expect(colors).toContain('#ec4899');
  });

  it('should not contain duplicate colors', () => {
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });
});
