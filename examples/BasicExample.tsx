import React from 'react';
import { Table } from 'antd';
import { useTableResize, ResizeColumnType } from 'react-table-resize';
import 'react-table-resize/dist/style.css';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  description: string;
}

const BasicExample: React.FC = () => {
  // Sample data
  const dataSource: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      description: 'This is a sample description that can be quite long and may need resizing.',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      description: 'Another description with different content length.',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      description: 'Yet another description for demonstration purposes.',
    },
  ];

  // Define columns with resize configuration
  const baseColumns: ResizeColumnType<DataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      defaultWidth: 150,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      defaultWidth: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      defaultWidth: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      defaultWidth: 250,
      cellResize: {
        enabled: true,
        defaultHeight: 80,
        minHeight: 60,
        maxHeight: 350,
        maxWidth: 500,
      },
    },
  ];

  // Use the resize hook
  const {
    columns: resizableColumns,
    components,
    resetColumnWidths,
    tableClassName,
  } = useTableResize<DataType>(baseColumns, {
    minWidth: 80,
    minHeight: 60,
    threshold: 2,
    persistColumnWidth: true,
    storageKey: 'basic-example-table-widths',
    showWidthTooltip: true,
    enableDoubleClickAutoSize: true,
    cellResizeHandleStyle: 'default',
  });

  return (
    <div style={{ padding: '24px' }}>
      <h1>React Table Resize - Basic Example</h1>
      
      <div style={{ marginBottom: '16px' }}>
        <button onClick={resetColumnWidths}>Reset Column Widths</button>
      </div>

      <Table
        columns={resizableColumns}
        components={components}
        dataSource={dataSource}
        className={tableClassName}
        bordered
        pagination={false}
      />

      <div style={{ marginTop: '24px' }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>Drag column headers to resize columns</li>
          <li>Double-click column headers to auto-size</li>
          <li>Drag bottom-right corner of Description cells to resize</li>
          <li>Column widths persist across page reloads</li>
          <li>Reset button restores default widths</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicExample;

