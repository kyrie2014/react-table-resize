/**
 * Enhanced Table Column Resize Component 
 * 
 * 架构设计原则：
 * 数据驱动：使用 React 状态管理，避免直接 DOM 操作
 * 性能优化：防抖 + RAF + CSS 变量，避免频繁重渲染
 * 关注点分离：样式通过 CSS，逻辑通过 React
 * 可预测性：单向数据流，避免状态冲突
 * 
 * 核心改进：
 * - 使用 CSS 变量管理行高和列宽
 * - 防抖 ResizeObserver 避免闪烁
 * - 完全由 React 控制渲染，避免 DOM 操作冲突
 */

import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import type { ColumnType } from 'antd/es/table';
import type { ResizeCallbackData } from 'react-resizable';
import { Resizable } from 'react-resizable';
import './style.less';

// ==================== TypeScript 类型定义 ====================

export type CellResizeHandleStyle = 'default' | 'minimal' | 'classic' | 'modern';

export interface ResizeConfig {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  threshold?: number;
  enabled?: boolean;
  enableCellContentResize?: boolean;
  cellResizeHandleStyle?: CellResizeHandleStyle;
  persistColumnWidth?: boolean;
  storageKey?: string;
  showWidthTooltip?: boolean;
  enableDoubleClickAutoSize?: boolean;
}

export interface CellResizeConfig {
  enabled?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
}

export interface ResizeColumnType<T = any> extends Omit<ColumnType<T>, 'onCell'> {
  resizable?: boolean | ResizeConfig;
  defaultWidth?: number;
  cellResize?: boolean | CellResizeConfig;
  onCell?: (record: T, index?: number) => React.HTMLAttributes<any> & {
    cellResizeConfig?: boolean | CellResizeConfig;
    columnKey?: string | number;
    columnIndex?: number;
    rowIndex?: number;
  };
}

interface ResizableTitleProps {
  width: number;
  onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
  onResizeStart?: () => void;
  onResizeStop?: (width: number) => void;
  onDoubleClick?: () => void;
  isLast: boolean;
  showWidthTooltip?: boolean;
  columnKey?: string | number;
}

interface ResizableCellProps {
  enableCellContentResize?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  columnKey?: string | number;
  columnIndex?: number;
  rowIndex?: number;
  cellResizeConfig?: CellResizeConfig | boolean;
  // 移除 rowHeight：不再通过 prop 传递，改用 DOM 操作同步
  onCellResize?: (params: { columnKey?: string | number; rowIndex?: number; width: number; height: number }) => void;
}

// ==================== 工具函数 ====================

const loadColumnWidths = (storageKey: string): Record<string, number> => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load column widths:', error);
    return {};
  }
};

const saveColumnWidths = (storageKey: string, widths: Record<string, number>): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(widths));
  } catch (error) {
    console.warn('Failed to save column widths:', error);
  }
};

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ==================== 拖动宽度提示组件 ====================

interface WidthTooltipProps {
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

const WidthTooltip: React.FC<WidthTooltipProps> = ({ visible, width, x, y }) => {
  if (!visible) return null;

  return (
    <div
      className="resize-width-tooltip"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -120%)',
        zIndex: 9999,
      }}
    >
      {Math.round(width)}px
    </div>
  );
};

// ==================== 可调整大小的表头组件 ====================

const ResizableTitle: React.FC<Readonly<React.HTMLAttributes<any> & ResizableTitleProps>> = React.memo((props) => {
  const {
    onResize,
    onResizeStart,
    onResizeStop,
    onDoubleClick,
    width,
    isLast,
    showWidthTooltip = true,
    columnKey,
    className = '',
    ...restProps
  } = props;

  const ref = useRef<HTMLTableCellElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentWidth(width);
  }, [width]);

  if (isLast) {
    return <th {...restProps} ref={ref} className={className} />;
  }

  const handleResizeStart = () => {
    setIsResizing(true);
    setTooltipVisible(showWidthTooltip);
    onResizeStart?.();
  };

  const handleResize = (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => {
    setCurrentWidth(data.size.width);

    if (showWidthTooltip && 'clientX' in e && 'clientY' in e) {
      setTooltipPosition({
        x: (e as any).clientX,
        y: (e as any).clientY,
      });
    }

    onResize(e, data);
  };

  const handleResizeStop = (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => {
    setIsResizing(false);
    setTooltipVisible(false);
    onResizeStop?.(data.size.width);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('react-resizable-handle')) {
      e.stopPropagation();
      onDoubleClick?.();
    }
  };

  return (
    <>
      <Resizable
        width={width || ref.current?.clientWidth || 0}
        height={0}
        handle={
          <span
            className={`react-resizable-handle ${isResizing ? 'resizing' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
            title="拖动调整列宽，双击自适应"
          />
        }
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th
          {...restProps}
          ref={ref}
          className={`${className} ${isResizing ? 'resizing-column' : ''}`.trim()}
          data-column-key={columnKey}
        />
      </Resizable>

      <WidthTooltip
        visible={tooltipVisible}
        width={currentWidth}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
      />
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.width === nextProps.width &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.showWidthTooltip === nextProps.showWidthTooltip &&
    prevProps.columnKey === nextProps.columnKey
  );
});

ResizableTitle.displayName = 'ResizableTitle';

// ==================== 可调整大小的单元格组件 (优化版) ====================

const ResizableCell: React.FC<Readonly<React.HTMLAttributes<any> & ResizableCellProps>> = React.memo((props) => {
  const {
    enableCellContentResize = false,
    minWidth: globalMinWidth = 80,
    minHeight: globalMinHeight = 40,
    maxWidth: globalMaxWidth,
    maxHeight: globalMaxHeight,
    cellResizeConfig,
    columnKey,
    columnIndex,
    rowIndex,
    // 移除 rowHeight：不再接收此 prop
    onCellResize,
    children,
    className = '',
    ...restProps
  } = props;

  const cellContentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const isUserResizingRef = useRef<boolean>(false);
  const resizeEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 解析配置
  let columnEnabled = enableCellContentResize;
  let columnMinWidth = globalMinWidth;
  let columnMinHeight = globalMinHeight;
  let columnMaxWidth = globalMaxWidth;
  let columnMaxHeight = globalMaxHeight;
  let columnDefaultHeight: number | undefined = undefined;

  if (cellResizeConfig !== undefined) {
    if (typeof cellResizeConfig === 'boolean') {
      columnEnabled = cellResizeConfig;
    } else {
      columnEnabled = cellResizeConfig.enabled !== undefined ? cellResizeConfig.enabled : enableCellContentResize;
      columnMinWidth = cellResizeConfig.minWidth ?? globalMinWidth;
      columnMinHeight = cellResizeConfig.minHeight ?? globalMinHeight;
      columnMaxWidth = cellResizeConfig.maxWidth ?? globalMaxWidth;
      columnMaxHeight = cellResizeConfig.maxHeight ?? globalMaxHeight;
      columnDefaultHeight = cellResizeConfig.defaultHeight;
    }
  }

  // 移除 useEffect：不再通过 React 状态同步行高
  // 改为在拖动结束时（handleMouseUp）直接通过 DOM 操作同步所有同行单元格
  // 这样可以完全避免 React 状态与用户拖动的冲突

  // 关键优化：检测用户拖动状态
  useEffect(() => {
    if (!columnEnabled || !cellContentRef.current) {
      return;
    }

    const element = cellContentRef.current;

    // 监听鼠标按下（开始拖动）
    const handleMouseDown = (e: MouseEvent) => {
      // 检查是否点击在右下角的 resize 区域（大约 15px x 15px）
      const rect = element.getBoundingClientRect();
      const isInResizeCorner =
        e.clientX >= rect.right - 15 &&
        e.clientY >= rect.bottom - 15;

      if (isInResizeCorner) {
        isUserResizingRef.current = true;
        // 添加拖动中的视觉反馈
        element.style.transition = 'none';
        // 移除 !important，允许用户拖动宽度和高度
        element.style.setProperty('height', element.style.height, '');
        element.style.setProperty('width', element.style.width, '');
      }
    };

    // 监听鼠标释放（结束拖动）
    const handleMouseUp = () => {

      if (isUserResizingRef.current) {
        isUserResizingRef.current = false;

        // 恢复过渡效果
        element.style.transition = '';

        // 拖动结束后，立即同步到其他单元格
        if (resizeEndTimerRef.current) {
          clearTimeout(resizeEndTimerRef.current);
        }

        resizeEndTimerRef.current = setTimeout(() => {
          if (cellContentRef.current) {
            const { width, height } = cellContentRef.current.getBoundingClientRect();
            const roundedWidth = Math.round(width);
            const roundedHeight = Math.round(height);

            // 先设置当前cell的宽度和高度（使用 !important 确保生效）
            if (cellContentRef.current) {
              cellContentRef.current.style.setProperty('height', `${roundedHeight}px`, 'important');
              cellContentRef.current.style.setProperty('width', `${roundedWidth}px`, 'important');
            }

            // 新方案：同时设置 tr 和所有 td/content 的高度
            if (rowIndex !== undefined) {
              // 1. 查找并设置 tr 的高度（作为基准）
              const tr = document.querySelector(`tr:has(td[data-row-index="${rowIndex}"])`) as HTMLElement;
              if (tr) {
                tr.style.height = `${roundedHeight}px`;
              }

              // 2. 查找整行的所有 td 元素
              const rowCells = document.querySelectorAll(`tr td[data-row-index="${rowIndex}"]`);

              rowCells.forEach((td) => {
                if (td instanceof HTMLElement) {
                  // 设置 td 的高度
                  td.style.height = `${roundedHeight}px`;

                  // 设置 resizable-cell-content 的高度
                  const resizableContent = td.querySelector('.resizable-cell-content') as HTMLElement;
                  if (resizableContent) {
                    // 关键修复：使用 setProperty 强制覆盖
                    resizableContent.style.setProperty('height', `${roundedHeight}px`, 'important');
                  }
                }
              });
            }

            // 同步整列的所有cell宽度（类似行高同步）
            if (columnKey) {
              const columnCells = document.querySelectorAll(`td[data-column-key="${columnKey}"] .resizable-cell-content`);

              columnCells.forEach((cell) => {
                if (cell instanceof HTMLElement && cell !== cellContentRef.current) {
                  // 使用 !important 强制覆盖 CSS resize 设置的宽度
                  cell.style.setProperty('width', `${roundedWidth}px`, 'important');
                }
              });
            }

            // 通知列宽变化（更新列配置）
            if (onCellResize && columnKey) {
              onCellResize({
                columnKey,
                rowIndex,
                width: roundedWidth,
                height: roundedHeight,
              });
            }
          }
        }, 50);
      }
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (resizeEndTimerRef.current) {
        clearTimeout(resizeEndTimerRef.current);
      }
    };
  }, [columnEnabled, columnKey, rowIndex, onCellResize]);

  // 优化：ResizeObserver 只在非拖动状态下触发同步
  useEffect(() => {
    if (!columnEnabled || !cellContentRef.current || !onCellResize) {
      return;
    }

    const element = cellContentRef.current;

    // 使用防抖，但增加拖动状态检测
    const debouncedResize = debounce((width: number, height: number) => {

      // 关键：如果用户正在拖动，不触发回调
      if (isUserResizingRef.current) {
        return;
      }

      // 新增：ResizeObserver 不应该触发列宽更新（列宽由表头拖动控制）
      // 只有高度变化才调用回调
      const heightChanged = Math.abs(height - lastSizeRef.current.height) > 2;

      if (heightChanged) {
        lastSizeRef.current = { width, height };
        // 不传递 width，避免列宽被 ResizeObserver 覆盖（列宽由表头拖动控制）
        onCellResize({
          columnKey,
          rowIndex,
          width: 0, // 传递 0 表示不更新列宽
          height,
        });
      }
    }, 200); // 增加防抖时间到 200ms

    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        debouncedResize(width, height);
      }
    });

    resizeObserverRef.current.observe(element);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [columnEnabled, columnKey, rowIndex, onCellResize]);

  // 不启用则返回普通单元格（但仍需添加 data-row-index 以支持行高同步）
  if (!columnEnabled) {
    return (
      <td {...restProps} className={className} data-row-index={rowIndex} data-column-key={columnKey}>
        {children}
      </td>
    );
  }

  // 关键优化：初始化时设置默认高度，后续通过 DOM 操作同步
  const computedHeight = columnDefaultHeight;

  return (
    <td
      {...restProps}
      className={`${className} resizable-cell`.trim()}
      data-column-key={columnKey}
      data-row-index={rowIndex}
    >
      <div
        ref={cellContentRef}
        className="resizable-cell-content"
        style={{
          minWidth: `${columnMinWidth}px`,
          minHeight: `${columnMinHeight}px`,
          maxWidth: columnMaxWidth ? `${columnMaxWidth}px` : undefined,
          maxHeight: columnMaxHeight ? `${columnMaxHeight}px` : undefined,
          // 关键：只设置初始高度，后续通过 DOM 操作避免冲突
          height: computedHeight ? `${computedHeight}px` : undefined,
        }}
        title="拖动右下角可调整单元格大小"
      >
        {children}
      </div>
    </td>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.enableCellContentResize === nextProps.enableCellContentResize &&
    prevProps.minWidth === nextProps.minWidth &&
    prevProps.minHeight === nextProps.minHeight &&
    prevProps.maxWidth === nextProps.maxWidth &&
    prevProps.maxHeight === nextProps.maxHeight &&
    prevProps.cellResizeConfig === nextProps.cellResizeConfig &&
    prevProps.columnKey === nextProps.columnKey &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.children === nextProps.children
    // 关键：移除 rowHeight 的比较，改用 DOM 操作同步
  );
});

ResizableCell.displayName = 'ResizableCell';

// ==================== 主 Hook ====================

export function useTableResize<T = any>(
  columns: ResizeColumnType<T>[],
  config: ResizeConfig = {}
) {
  const {
    threshold = 2,
    enabled = true,
    enableCellContentResize = false,
    cellResizeHandleStyle = 'default',
    minWidth = 80,
    minHeight = 40,
    maxWidth,
    maxHeight,
    persistColumnWidth = false,
    storageKey = 'table-resize-config',
    showWidthTooltip = true,
    enableDoubleClickAutoSize = true,
  } = config;

  const [finalColumns, setFinalColumns] = useState<ResizeColumnType<T>[]>(() => {
    if (persistColumnWidth) {
      const savedWidths = loadColumnWidths(storageKey);
      return columns.map(col => ({
        ...col,
        width: savedWidths[col.key as string] || col.width || col.defaultWidth,
      }));
    }
    return columns;
  });

  // 移除 rowHeights 状态：不再通过 React 状态管理行高，改用 DOM 操作

  const resizeTimerRef = useRef<number | null>(null);
  const tempWidthRef = useRef<Record<string, number>>({});

  const saveWidths = useMemo(
    () =>
      debounce((widths: Record<string, number>) => {
        if (persistColumnWidth) {
          saveColumnWidths(storageKey, widths);
        }
      }, 500),
    [persistColumnWidth, storageKey]
  );

  // 优化：使用 RAF + 批量更新，避免频繁触发
  const handleCellResize = useCallback((params: { columnKey?: string | number; rowIndex?: number; width: number; height: number }) => {
    const { columnKey: colKey, width } = params;

    // 使用 RAF 批量处理，避免闪烁
    if (resizeTimerRef.current) {
      cancelAnimationFrame(resizeTimerRef.current);
    }

    resizeTimerRef.current = requestAnimationFrame(() => {
      // 1. 更新列宽（仅当 width > 0 时，0 表示不更新）
      if (colKey !== undefined && width > 0) {
        const roundedWidth = Math.round(width);
        setFinalColumns(prevColumns =>
          prevColumns.map(col =>
            col.key === colKey ? { ...col, width: roundedWidth } : col
          )
        );

        if (persistColumnWidth) {
          tempWidthRef.current[colKey as string] = roundedWidth;
          saveWidths(tempWidthRef.current);
        }
      }

      // 2. 移除行高状态更新：现在通过 handleMouseUp 中的 DOM 操作直接同步
      // 不再需要通过 React 状态管理行高
    });
  }, [persistColumnWidth, saveWidths]);

  // 同步外部 columns 变化
  useEffect(() => {
    if (persistColumnWidth) {
      const savedWidths = loadColumnWidths(storageKey);
      setFinalColumns(prevColumns =>
        columns.map((col, index) => {
          const prevCol = prevColumns[index];
          return {
            ...col,
            width: prevCol?.width || savedWidths[col.key as string] || col.width || col.defaultWidth,
          };
        })
      );
    } else {
      setFinalColumns(columns);
    }
  }, [columns, persistColumnWidth, storageKey]);

  // 清理
  useEffect(() => {
    return () => {
      if (resizeTimerRef.current) {
        cancelAnimationFrame(resizeTimerRef.current);
      }
    };
  }, []);

  // 重置列宽
  const resetColumnWidths = useCallback(() => {
    const resetColumns = columns.map(col => ({
      ...col,
      width: col.defaultWidth || col.width,
    }));
    setFinalColumns(resetColumns);

    if (persistColumnWidth) {
      localStorage.removeItem(storageKey);
    }
  }, [columns, persistColumnWidth, storageKey]);

  // 自适应列宽
  const autoSizeColumn = useCallback((colKey: string | number) => {
    const cells = document.querySelectorAll(`[data-column-key="${colKey}"]`);
    if (cells.length === 0) return;

    let maxCellWidth = 0;
    cells.forEach(cell => {
      const cellWidth = (cell as HTMLElement).scrollWidth;
      maxCellWidth = Math.max(maxCellWidth, cellWidth);
    });

    const newWidth = maxCellWidth + 32;

    setFinalColumns(prevColumns =>
      prevColumns.map(col =>
        col.key === colKey ? { ...col, width: newWidth } : col
      )
    );

    if (persistColumnWidth) {
      const widths = { ...tempWidthRef.current, [colKey]: newWidth };
      saveWidths(widths);
    }
  }, [persistColumnWidth, saveWidths]);

  // 列宽拖动处理
  const handleResize = useCallback(
    (colKey: string | number) =>
      (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        if (!enabled) return;

        tempWidthRef.current[colKey as string] = size.width;

        if (resizeTimerRef.current) {
          cancelAnimationFrame(resizeTimerRef.current);
        }

        resizeTimerRef.current = requestAnimationFrame(() => {
          const newColumns = finalColumns.map((col) => {
            if (col.key === colKey) {
              const newWidth = tempWidthRef.current[colKey as string] || size.width;

              if (col.width && Math.abs((col.width as number) - newWidth) < threshold) {
                return col;
              }

              return { ...col, width: newWidth };
            }
            return col;
          });
          setFinalColumns(newColumns);
        });
      },
    [enabled, finalColumns, threshold]
  );

  const handleResizeStop = useCallback(
    (colKey: string | number) => (width: number) => {
      if (persistColumnWidth) {
        tempWidthRef.current[colKey as string] = width;
        saveWidths(tempWidthRef.current);
      }
    },
    [persistColumnWidth, saveWidths]
  );

  const handleDoubleClick = useCallback(
    (colKey: string | number) => () => {
      if (enableDoubleClickAutoSize) {
        autoSizeColumn(colKey);
      }
    },
    [enableDoubleClickAutoSize, autoSizeColumn]
  );

  // 合并列配置
  const mergedColumns = useMemo(() => {
    return finalColumns.map((col, index, array) => ({
      ...col,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: handleResize(column.key) as React.ReactEventHandler<any>,
        onResizeStop: handleResizeStop(column.key),
        onDoubleClick: handleDoubleClick(column.key),
        isLast: index + 1 === array.length || col.fixed === 'right' || col.fixed === 'left',
        showWidthTooltip,
        columnKey: column.key,
      }),
      // 关键：传递 rowIndex 而不是 rowKey
      onCell: (record: any, rowIndex?: number) => {
        return {
          cellResizeConfig: col.cellResize,
          columnKey: col.key,
          columnIndex: index,
          rowIndex, // 使用 rowIndex
          // 移除 rowHeight：不再通过 prop 传递，改用 DOM 操作同步
        };
      },
    }));
  }, [finalColumns, handleResize, handleResizeStop, handleDoubleClick, showWidthTooltip]);

  // Table components
  const components = useMemo(
    () => ({
      header: {
        cell: ResizableTitle,
      },
      body: {
        cell: (props: any) => (
          <ResizableCell
            {...props}
            enableCellContentResize={enableCellContentResize}
            minWidth={minWidth}
            minHeight={minHeight}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            onCellResize={handleCellResize}
          />
        ),
      },
    }),
    [enableCellContentResize, minWidth, minHeight, maxWidth, maxHeight, handleCellResize]
  );

  // 表格 className
  const getTableClassName = useCallback(() => {
    const styleClassMap: Record<CellResizeHandleStyle, string> = {
      default: '',
      minimal: 'table-resize-minimal',
      classic: 'table-resize-classic',
      modern: 'table-resize-modern',
    };
    return styleClassMap[cellResizeHandleStyle] || '';
  }, [cellResizeHandleStyle]);

  return {
    columns: mergedColumns,
    components,
    resetColumnWidths,
    autoSizeColumn,
    tableClassName: getTableClassName(),
  };
}

export default ResizableTitle;
