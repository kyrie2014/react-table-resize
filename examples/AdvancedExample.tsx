import React, { useState } from 'react';
import { Table, Switch, Radio, Space } from 'antd';
import { useTableResize, ResizeColumnType, CellResizeHandleStyle } from 'react-table-resize';
import 'react-table-resize/dist/style.css';

interface DataType {
  key: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  notes: string;
}

const AdvancedExample: React.FC = () => {
  const [handleStyle, setHandleStyle] = useState<CellResizeHandleStyle>('default');
  const [showTooltip, setShowTooltip] = useState(true);
  const [enableAutoSize, setEnableAutoSize] = useState(true);
  const [persistWidths, setPersistWidths] = useState(true);

  const dataSource: DataType[] = Array.from({ length: 10 }, (_, i) => ({
    key: `${i}`,
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
    status: i % 2 === 0 ? 'Active' : 'Inactive',
    notes: `This is a note for user ${i + 1}. It can be quite long and requires resizing.`,
  }));

  const baseColumns: ResizeColumnType<DataType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      defaultWidth: 80,
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      defaultWidth: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      defaultWidth: 200,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      defaultWidth: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      defaultWidth: 100,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      defaultWidth: 300,
      cellResize: {
        enabled: true,
        defaultHeight: 60,
        minHeight: 40,
        maxHeight: 200,
        maxWidth: 600,
      },
    },
  ];

  const {
    columns: resizableColumns,
    components,
    resetColumnWidths,
    autoSizeColumn,
    tableClassName,
  } = useTableResize<DataType>(baseColumns, {
    minWidth: 60,
    minHeight: 40,
    maxHeight: 300,
    threshold: 2,
    persistColumnWidth: persistWidths,
    storageKey: 'advanced-example-table-widths',
    showWidthTooltip: showTooltip,
    enableDoubleClickAutoSize: enableAutoSize,
    cellResizeHandleStyle: handleStyle,
  });

  return (
    <div style={{ padding: '24px' }}>
      <h1>React Table Resize - Advanced Example</h1>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Configuration Panel */}
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
          <h3>Configuration Options:</h3>
          
          <Space direction="vertical" size="middle">
            <div>
              <span style={{ marginRight: '16px' }}>Handle Style:</span>
              <Radio.Group
                value={handleStyle}
                onChange={e => setHandleStyle(e.target.value)}
              >
                <Radio.Button value="default">Default</Radio.Button>
                <Radio.Button value="minimal">Minimal</Radio.Button>
                <Radio.Button value="classic">Classic</Radio.Button>
                <Radio.Button value="modern">Modern</Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <span style={{ marginRight: '16px' }}>Show Width Tooltip:</span>
              <Switch checked={showTooltip} onChange={setShowTooltip} />
            </div>

            <div>
              <span style={{ marginRight: '16px' }}>Enable Double-Click Auto-Size:</span>
              <Switch checked={enableAutoSize} onChange={setEnableAutoSize} />
            </div>

            <div>
              <span style={{ marginRight: '16px' }}>Persist Column Widths:</span>
              <Switch checked={persistWidths} onChange={setPersistWidths} />
            </div>
          </Space>
        </div>

        {/* Action Buttons */}
        <Space>
          <button onClick={resetColumnWidths}>Reset All Widths</button>
          <button onClick={() => autoSizeColumn('name')}>Auto-size Name Column</button>
          <button onClick={() => autoSizeColumn('email')}>Auto-size Email Column</button>
        </Space>

        {/* Table */}
        <Table
          columns={resizableColumns}
          components={components}
          dataSource={dataSource}
          className={tableClassName}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />

        {/* Instructions */}
        <div>
          <h3>Advanced Features:</h3>
          <ul>
            <li>🎨 Multiple handle styles (try changing them above)</li>
            <li>📏 Width tooltips while resizing</li>
            <li>🔄 Double-click headers to auto-fit content</li>
            <li>💾 Persistent column widths in localStorage</li>
            <li>🔧 Dynamic configuration changes</li>
            <li>📊 Fixed columns support</li>
            <li>📱 Responsive table with horizontal scroll</li>
            <li>📝 Resizable cell content in Notes column</li>
          </ul>
        </div>
      </Space>
    </div>
  );
};

export default AdvancedExample;

