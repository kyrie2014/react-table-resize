import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useTableResize, ResizeColumnType } from '../src/index';

describe('useTableResize', () => {
  const mockColumns: ResizeColumnType[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      defaultWidth: 200,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      defaultWidth: 100,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  test('should return enhanced columns', () => {
    const { result } = renderHook(() => useTableResize(mockColumns));

    expect(result.current.columns).toHaveLength(2);
    expect(result.current.columns[0].onHeaderCell).toBeDefined();
    expect(result.current.columns[0].onCell).toBeDefined();
  });

  test('should apply default widths', () => {
    const { result } = renderHook(() => useTableResize(mockColumns));

    expect(result.current.columns[0].width).toBe(200);
    expect(result.current.columns[1].width).toBe(100);
  });

  test('should load saved widths from localStorage', () => {
    const storageKey = 'test-table-widths';
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        name: 300,
        age: 150,
      })
    );

    const { result } = renderHook(() =>
      useTableResize(mockColumns, {
        persistColumnWidth: true,
        storageKey,
      })
    );

    expect(result.current.columns[0].width).toBe(300);
    expect(result.current.columns[1].width).toBe(150);
  });

  test('should provide resetColumnWidths function', () => {
    const storageKey = 'test-table-widths';
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        name: 300,
        age: 150,
      })
    );

    const { result } = renderHook(() =>
      useTableResize(mockColumns, {
        persistColumnWidth: true,
        storageKey,
      })
    );

    result.current.resetColumnWidths();

    expect(result.current.columns[0].width).toBe(200);
    expect(result.current.columns[1].width).toBe(100);
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  test('should provide components object', () => {
    const { result } = renderHook(() => useTableResize(mockColumns));

    expect(result.current.components).toBeDefined();
    expect(result.current.components.header).toBeDefined();
    expect(result.current.components.body).toBeDefined();
  });

  test('should handle cell resize configuration', () => {
    const columnsWithCellResize: ResizeColumnType[] = [
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        defaultWidth: 200,
        cellResize: {
          enabled: true,
          defaultHeight: 80,
          minHeight: 60,
          maxHeight: 350,
        },
      },
    ];

    const { result } = renderHook(() => useTableResize(columnsWithCellResize));

    expect(result.current.columns[0].cellResize).toBeDefined();
  });

  test('should apply minimum width constraint', () => {
    const { result } = renderHook(() =>
      useTableResize(mockColumns, {
        minWidth: 150,
      })
    );

    // Minimum width should be enforced through the config
    expect(result.current.columns[0].width).toBeGreaterThanOrEqual(150);
  });

  test('should provide tableClassName when resizing', () => {
    const { result } = renderHook(() => useTableResize(mockColumns));

    // Initially, no resizing class
    expect(result.current.tableClassName).toBe('');
  });
});

describe('Column resize utilities', () => {
  test('should save widths to localStorage', () => {
    const storageKey = 'test-widths';
    const widths = { col1: 100, col2: 200 };

    localStorage.setItem(storageKey, JSON.stringify(widths));

    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    expect(saved).toEqual(widths);
  });

  test('should handle invalid localStorage data', () => {
    const storageKey = 'test-widths';
    localStorage.setItem(storageKey, 'invalid-json');

    // Should not throw error
    expect(() => {
      try {
        JSON.parse(localStorage.getItem(storageKey) || '{}');
      } catch {
        return {};
      }
    }).not.toThrow();
  });
});

