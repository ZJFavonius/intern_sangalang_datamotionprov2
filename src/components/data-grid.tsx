'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table'
import { Plus, Trash2, MoreHorizontal, Copy, FileText, Type } from 'lucide-react'

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

function RowActionsMenu({ onDelete, onDuplicate }: { onDelete: () => void; onDuplicate: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Copy className="h-3.5 w-3.5 text-gray-400" />
            Duplicate row
          </button>
          <div className="h-px bg-gray-100 mx-2" />
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete row
          </button>
        </div>
      )}
    </div>
  )
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
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnName: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedRow, setSelectedRow] = useState<string | null>(null)

  const filteredRows = useMemo(() => {
    let result = rows
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((row) =>
        Object.values(row.data).some((val) => String(val ?? '').toLowerCase().includes(q))
      )
    }
    for (const f of filters) {
      if (!f.column) continue
      result = result.filter((row) => {
        const cellVal = String(row.data[f.column] ?? '').toLowerCase()
        const filterVal = f.value.toLowerCase()
        switch (f.operator) {
          case 'contains':    return cellVal.includes(filterVal)
          case 'equals':      return cellVal === filterVal
          case 'starts_with': return cellVal.startsWith(filterVal)
          case 'ends_with':   return cellVal.endsWith(filterVal)
          case 'is_empty':    return cellVal === ''
          case 'not_empty':   return cellVal !== ''
          default:            return true
        }
      })
    }
    return result
  }, [rows, searchQuery, filters])

  async function handleDuplicateRow(row: Row) {
    const res = await fetch(`/api/tables/${tableId}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cells: { ...row.data } }),
    })
    if (res.ok) onAddRow()
  }

  const tableColumns: ColumnDef<Row>[] = [
    {
      id: 'row-number',
      header: () => (
        <div className="flex items-center justify-center w-full">
          <FileText className="h-3 w-3 text-gray-300" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center text-[11px] text-gray-300 font-mono select-none group-hover:text-gray-500 transition-colors">
          {row.index + 1}
        </div>
      ),
      size: 48,
      enableHiding: false,
    },
    ...columns
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        id: col.name,
        accessorKey: col.name,
        header: () => (
          <div className="flex items-center gap-1.5 w-full">
            <Type className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{col.name}</span>
          </div>
        ),
        cell: ({ row }: any) => {
          const rowId = row.original.id
          const columnName = col.name
          const value = row.original.data[columnName] ?? ''
          const isEditing = editingCell?.rowId === rowId && editingCell?.columnName === columnName
          const isSelected = selectedRow === rowId

          return (
            <div
              className="min-h-[34px] flex items-center relative"
              onClick={() => setSelectedRow(rowId)}
              onDoubleClick={() => {
                setEditingCell({ rowId, columnName })
                setEditValue(value)
                setSelectedRow(rowId)
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
                    if (e.key === 'Enter') { onCellUpdate(rowId, columnName, editValue); setEditingCell(null) }
                    else if (e.key === 'Escape') setEditingCell(null)
                  }}
                  autoFocus
                  className="absolute inset-0 w-full h-full px-3 py-1 border-2 border-blue-500 bg-white rounded-none focus:outline-none text-sm z-10 shadow-lg"
                />
              ) : (
                <div className={`px-3 py-1.5 w-full text-sm transition-colors leading-tight ${
                  isSelected && !isEditing ? 'text-gray-900' : 'text-gray-700'
                } ${value === '' ? 'text-gray-300' : ''}`}>
                  {value !== '' ? value : <span className="italic text-[11px]">—</span>}
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
        <RowActionsMenu
          onDelete={() => onDeleteRow(row.original.id)}
          onDuplicate={() => handleDuplicateRow(row.original)}
        />
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
    <div className="flex flex-col h-full bg-white" onClick={(e) => {
      if ((e.target as HTMLElement).closest('td') === null) setSelectedRow(null)
    }}>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          {/* Column Headers */}
          <thead className="sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50 border-b-2 border-gray-200">
                {headerGroup.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={`
                      px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 tracking-wide
                      border-r border-gray-200 last:border-r-0 select-none
                      ${i === 0 ? 'text-center w-12' : ''}
                      ${header.id === 'actions' ? 'w-10' : ''}
                    `}
                    style={{ minWidth: header.id === 'row-number' ? 48 : header.id === 'actions' ? 40 : 160 }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                {/* Add column button in header */}
                <th className="px-3 py-2.5 w-32 border-r border-gray-200">
                  <button
                    onClick={onAddColumn}
                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    <Plus className="h-3 w-3" />
                    Add field
                  </button>
                </th>
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length + 1} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No records found</p>
                    <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => {
                const isSelected = selectedRow === row.original.id
                return (
                  <tr
                    key={row.id}
                    className={`group border-b border-gray-100 transition-colors cursor-default ${
                      isSelected
                        ? 'bg-blue-50/60'
                        : idx % 2 === 0
                        ? 'bg-white hover:bg-blue-50/30'
                        : 'bg-gray-50/40 hover:bg-blue-50/30'
                    }`}
                    onClick={() => setSelectedRow(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`border-r border-gray-100 last:border-r-0 relative ${
                          isSelected ? 'border-blue-100' : ''
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="border-r-0 w-10 px-1">
                    </td>
                  </tr>
                )
              })
            )}

            {/* Add row */}
            <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
              <td colSpan={tableColumns.length + 1} className="px-3 py-2">
                <button
                  onClick={onAddRow}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add record
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between bg-gray-50/60">
        <span className="text-[11px] text-gray-400 font-medium">
          {table.getRowModel().rows.length} record{table.getRowModel().rows.length !== 1 ? 's' : ''}
          {filteredRows.length !== rows.length && ` (filtered from ${rows.length})`}
        </span>
        <span className="text-[11px] text-gray-300 font-medium">
          Double-click a cell to edit
        </span>
      </div>
    </div>
  )
}
