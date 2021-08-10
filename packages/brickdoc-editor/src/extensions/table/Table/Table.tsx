import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTable } from 'react-table'
import update from 'immutability-helper'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'

const Cell = () => <div>i'm custom cell</div>

export const Table: React.FC<NodeViewProps> = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName'
          },
          {
            Header: 'Last Name',
            accessor: 'lastName'
          }
        ]
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age'
          },
          {
            Header: 'Visits',
            accessor: 'visits'
          },
          {
            Header: 'Status',
            accessor: 'status',
            Cell
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress'
          }
        ]
      }
    ],
    []
  )

  const [data, setData] = React.useState([
    {
      id: 0,
      firstName: 'A',
      lastName: 'A'
    },
    {
      id: 1,
      firstName: 'B',
      lastName: 'B'
    }
  ])
  return (
    <NodeViewWrapper>
      <button onClick={() => setData(prevData => [...prevData, { id: prevData.length, firstName: 'C', lastName: 'C' }])}>Add row</button>
      <TableBlock columns={columns} data={data} setData={setData} />
    </NodeViewWrapper>
  )
}

function TableBlock({ columns, data, setData }: any) {
  const getRowId = React.useCallback(row => {
    return row.id
  }, [])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    data,
    columns,
    getRowId
  })

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const dragRecord = data[dragIndex]
    setData(
      update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord]
        ]
      })
    )
  }

  // Render the UI for your table
  return (
    <DndProvider backend={HTML5Backend}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <th></th>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, index) =>
              // @ts-ignore
              prepareRow(row) || <Row index={index} row={row} moveRow={moveRow} {...row.getRowProps()} />
          )}
        </tbody>
      </table>
    </DndProvider>
  )
}

const DND_ITEM_TYPE = 'row'

const Row = ({ row, index, moveRow }: any) => {
  const dropRef = React.useRef<any>(null)
  const dragRef = React.useRef<any>(null)

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item: any, monitor) {
      if (!dropRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset: any = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    index,
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  } as any)

  const opacity = isDragging ? 0 : 1

  preview(drop(dropRef))
  drag(dragRef)

  return (
    <tr ref={dropRef} style={{ opacity }}>
      <td ref={dragRef}>move</td>
      {row.cells.map((cell: any) => {
        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
      })}
    </tr>
  )
}
