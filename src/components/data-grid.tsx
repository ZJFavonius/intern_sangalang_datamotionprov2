'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'

interface Column {
  id: string
  name: string
  type: string
  order: number
}

interface Row {
  id: string
  order: number
  data: Record<string, string | null>
}

export interface FilterRule {
  column: string
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'is_empty' | 'not_empty'
  value: string
}

interface DataGridProps {
  tableId: string
  columns: Column[]
  rows: Row[]
  searchQuery: string
  filters: FilterRule[]
  columnVisibility: VisibilityState
  onCellUpdate: (rowId: string, columnName: string, value: string) => void
  onAddRow: () => void
  onAddColumn: () => void
  onDeleteRow: (rowId: string) => void
}

export function DataGrid({
  tableId,
  columns,
  rows,
  searchQuery,
  filters,
  columnVisibility,
  onCellUpdate,
  onAddRow,
  onAddColumn,
  onDeleteRow,
}: DataGridProps) {
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    columnName: string
  } | null>(null)
  const [editValue, setEditValue] = useState('')

  const filteredRows = useMemo(() => {
    let result = rows

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((row) =>
        Object.values(row.data).some((val) =>
          String(val ?? '').toLowerCase().includes(q)
        )
      )
    }

    for (const f of filters) {
      if (!f.column) continue
      result = result.filter((row) => {
        const cellVal = String(row.data[f.column] ?? '').toLowerCase()
        const filterVal = f.value.toLowerCase()
        switch (f.operator) {
          case 'contains':     return cellVal.includes(filterVal)
          case 'equals':       return cellVal === filterVal
          case 'starts_with':  return cellVal.startsWith(filterVal)
          case 'ends_with':    return cellVal.endsWith(filterVal)
          case 'is_empty':     return cellVal === ''
          case 'not_empty':    return cellVal !== ''
          default:             return true
        }
      })
    }

    return result
  }, [rows, searchQuery, filters])

  const tableColumns: ColumnDef<Row>[] = [
    {
      id: 'row-number',
      header: '#',
      cell: ({ row }) => (
        <div className="text-gray-400 text-xs font-medium select-none">
          {row.index + 1}
        </div>
      ),
      size: 50,
      enableHiding: false,
    },
    ...columns
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        id: col.name,
        accessorKey: col.name,
        header: col.name,
        cell: ({ row }: any) => {
          const rowId = row.original.id
          const columnName = col.name
          const value = row.original.data[columnName] ?? ''
          const isEditing =
            editingCell?.rowId === rowId &&
            editingCell?.columnName === columnName

          return (
            <div
              className="min-h-[36px] flex items-center"
              onDoubleClick={() => {
                setEditingCell({ rowId, columnName })
                setEditValue(value)
              }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    onCellUpdate(rowId, columnName, editValue)
                    setEditingCell(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onCellUpdate(rowId, columnName, editValue)
                      setEditingCell(null)
                    } else if (e.key === 'Escape') {
                      setEditingCell(null)
                    }
                  }}
                  autoFocus
                  className="w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none text-sm"
                />
              ) : (
                <div className="px-2 py-1 w-full cursor-pointer hover:bg-blue-50/50 rounded text-sm">
                  {value !== '' ? value : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </div>
              )}
            </div>
          )
        },
      })),
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => onDeleteRow(row.original.id)}
          className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
      size: 40,
      enableHiding: false,
    },
  ]

  const table = useReactTable({
    data: filteredRows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility },
  })

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide border-r border-gray-100 last:border-r-0"
                    style={{
                      width: header.getSize(),
                      minWidth: header.id === 'row-number' ? 50 : 160,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
                <th className="px-4 py-2.5 border-r border-gray-100">
                  <button
                    onClick={onAddColumn}
                    className="text-gray-400 hover:text-blue-600 transition flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add field
                  </button>
                </th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length + 1}
                  className="text-center py-16 text-gray-400 text-sm"
                >
                  No records match your search or filter.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-gray-50/80 transition border-b border-gray-100 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-r border-gray-100 px-4 py-1 last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-4 py-1"></td>
                </tr>
              ))
            )}
            <tr>
              <td colSpan={tableColumns.length + 1} className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={onAddRow}
                  className="text-gray-400 hover:text-blue-600 transition flex items-center gap-1 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add record
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
