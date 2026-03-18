'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VisibilityState } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataGrid, FilterRule } from '@/components/data-grid'
import {
  Loader2, Upload, ArrowLeft, Plus, Columns,
  Search, Filter, Download, X, ChevronDown, Eye, EyeOff,
} from 'lucide-react'
import Link from 'next/link'

export default function TablePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const tableId = params.tableId as string
  const queryClient = useQueryClient()

  const [showImportModal, setShowImportModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterRule[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showColumnsPanel, setShowColumnsPanel] = useState(false)

  const filterPanelRef = useRef<HTMLDivElement>(null)
  const columnsPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false)
      }
      if (columnsPanelRef.current && !columnsPanelRef.current.contains(e.target as Node)) {
        setShowColumnsPanel(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: table, isLoading: tableLoading } = useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const res = await fetch(`/api/tables/${tableId}`)
      if (!res.ok) throw new Error('Failed to fetch table')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  const { data: rowsData, isLoading: rowsLoading } = useQuery({
    queryKey: ['rows', tableId],
    queryFn: async () => {
      const res = await fetch(`/api/tables/${tableId}/rows?limit=500`)
      if (!res.ok) throw new Error('Failed to fetch rows')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  const updateCellMutation = useMutation({
    mutationFn: async ({ rowId, columnName, value }: { rowId: string; columnName: string; value: string }) => {
      const res = await fetch(`/api/tables/${tableId}/rows/${rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells: { [columnName]: value } }),
      })
      if (!res.ok) throw new Error('Failed to update cell')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rows', tableId] }),
  })

  const addRowMutation = useMutation({
    mutationFn: async () => {
      const cells: Record<string, string> = {}
      table?.columns?.forEach((col: any) => { cells[col.name] = '' })
      const res = await fetch(`/api/tables/${tableId}/rows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells }),
      })
      if (!res.ok) throw new Error('Failed to add row')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rows', tableId] }),
  })

  const deleteRowMutation = useMutation({
    mutationFn: async (rowId: string) => {
      const res = await fetch(`/api/tables/${tableId}/rows/${rowId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete row')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rows', tableId] }),
  })

  const addColumnMutation = useMutation({
    mutationFn: async () => {
      const columnName = prompt('Enter column name:')
      if (!columnName) return
      const res = await fetch(`/api/tables/${tableId}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: columnName, type: 'text' }),
      })
      if (!res.ok) throw new Error('Failed to add column')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table', tableId] })
      queryClient.invalidateQueries({ queryKey: ['rows', tableId] })
    },
  })

  function handleExport() {
    const cols: any[] = table?.columns ?? []
    const rows: any[] = rowsData?.rows ?? []
    const header = cols.map((c: any) => c.name).join(',')
    const body = rows.map((row: any) =>
      cols.map((c: any) => {
        const val = String(row.data[c.name] ?? '')
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
      }).join(',')
    ).join('\n')
    const csv = [header, body].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${table?.name ?? 'export'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function addFilter() {
    const firstCol = table?.columns?.[0]?.name ?? ''
    setFilters((prev) => [...prev, { column: firstCol, operator: 'contains', value: '' }])
  }

  function updateFilter(index: number, patch: Partial<FilterRule>) {
    setFilters((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  function removeFilter(index: number) {
    setFilters((prev) => prev.filter((_, i) => i !== index))
  }

  function toggleColumnVisibility(colName: string) {
    setColumnVisibility((prev) => ({
      ...prev,
      [colName]: prev[colName] === false ? true : false,
    }))
  }

  const activeFilterCount = filters.filter((f) => f.column && (f.operator === 'is_empty' || f.operator === 'not_empty' || f.value)).length
  const hiddenColumnCount = Object.values(columnVisibility).filter((v) => v === false).length

  if (status === 'loading' || tableLoading || rowsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  const cols: any[] = table?.columns ?? []

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">

        {/* Toolbar Header */}
        <div className="flex flex-col gap-3 py-4 px-6 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/workspaces/${workspaceId}`}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  {table?.name || 'Table'}
                </h1>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="uppercase font-bold tracking-wider">{rowsData?.rows?.length || 0} ROWS</span>
                  <span>•</span>
                  <span className="uppercase font-bold tracking-wider">{cols.length} COLUMNS</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button
                onClick={handleExport}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <div className="h-6 w-px bg-gray-100 mx-1"></div>
              <button
                onClick={() => addRowMutation.mutate()}
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </button>
            </div>
          </div>

          {/* Secondary Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-200 text-xs rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="h-4 w-px bg-gray-200"></div>

              {/* Filter Button */}
              <div className="relative" ref={filterPanelRef}>
                <button
                  onClick={() => { setShowFilterPanel((v) => !v); setShowColumnsPanel(false) }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    showFilterPanel || activeFilterCount > 0
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {showFilterPanel && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-900">Filters</span>
                      {filters.length > 0 && (
                        <button onClick={() => setFilters([])} className="text-xs text-red-500 hover:text-red-700 font-medium">
                          Clear all
                        </button>
                      )}
                    </div>

                    {filters.length === 0 ? (
                      <p className="text-xs text-gray-400 mb-3">No filters applied. Add one below.</p>
                    ) : (
                      <div className="space-y-2 mb-3">
                        {filters.map((f, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <select
                              value={f.column}
                              onChange={(e) => updateFilter(i, { column: e.target.value })}
                              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                            >
                              {cols.map((c: any) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                            <select
                              value={f.operator}
                              onChange={(e) => updateFilter(i, { operator: e.target.value as FilterRule['operator'] })}
                              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                            >
                              <option value="contains">contains</option>
                              <option value="equals">equals</option>
                              <option value="starts_with">starts with</option>
                              <option value="ends_with">ends with</option>
                              <option value="is_empty">is empty</option>
                              <option value="not_empty">is not empty</option>
                            </select>
                            {f.operator !== 'is_empty' && f.operator !== 'not_empty' && (
                              <input
                                type="text"
                                value={f.value}
                                onChange={(e) => updateFilter(i, { value: e.target.value })}
                                placeholder="Value"
                                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                              />
                            )}
                            <button onClick={() => removeFilter(i)} className="text-gray-400 hover:text-red-500 transition">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={addFilter}
                      disabled={cols.length === 0}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add filter
                    </button>
                  </div>
                )}
              </div>

              {/* Columns Button */}
              <div className="relative" ref={columnsPanelRef}>
                <button
                  onClick={() => { setShowColumnsPanel((v) => !v); setShowFilterPanel(false) }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    showColumnsPanel || hiddenColumnCount > 0
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  Columns
                  {hiddenColumnCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {hiddenColumnCount}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {showColumnsPanel && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-900">Visible Fields</span>
                      {hiddenColumnCount > 0 && (
                        <button
                          onClick={() => setColumnVisibility({})}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Show all
                        </button>
                      )}
                    </div>

                    {cols.length === 0 ? (
                      <p className="text-xs text-gray-400">No columns yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {cols.map((col: any) => {
                          const isVisible = columnVisibility[col.name] !== false
                          return (
                            <button
                              key={col.id}
                              onClick={() => toggleColumnVisibility(col.name)}
                              className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition group"
                            >
                              <span className={`text-xs font-medium ${isVisible ? 'text-gray-800' : 'text-gray-400'}`}>
                                {col.name}
                              </span>
                              {isVisible
                                ? <Eye className="h-3.5 w-3.5 text-blue-500" />
                                : <EyeOff className="h-3.5 w-3.5 text-gray-300" />
                              }
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              {(searchQuery || activeFilterCount > 0) && (
                <span className="text-blue-500 normal-case font-semibold">
                  Filtered
                </span>
              )}
              Last saved: Just now
            </div>
          </div>
        </div>

        {/* Data Grid Area */}
        <div className="flex-1 overflow-hidden relative bg-[#FBFBFC]">
          <div className="absolute inset-0 p-4">
            <div className="h-full w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {table && rowsData && (
                <DataGrid
                  tableId={tableId}
                  columns={cols}
                  rows={rowsData.rows || []}
                  searchQuery={searchQuery}
                  filters={filters}
                  columnVisibility={columnVisibility}
                  onCellUpdate={(rowId, columnName, value) => updateCellMutation.mutate({ rowId, columnName, value })}
                  onAddRow={() => addRowMutation.mutate()}
                  onAddColumn={() => addColumnMutation.mutate()}
                  onDeleteRow={(rowId) => deleteRowMutation.mutate(rowId)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showImportModal && (
        <ImportModal
          tableId={tableId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false)
            queryClient.invalidateQueries({ queryKey: ['rows', tableId] })
          }}
        />
      )}
    </DashboardLayout>
  )
}

function ImportModal({
  tableId,
  onClose,
  onSuccess,
}: {
  tableId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`/api/tables/${tableId}/import`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to import CSV')
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import CSV</h2>
        <p className="text-gray-500 mb-8">Upload your data into this table instantly.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-blue-50/30 hover:border-blue-200 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-gray-700">
                {file ? file.name : 'Click or drag CSV file'}
              </p>
              <p className="text-xs text-gray-400 mt-2">Headers must match column names</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 bg-blue-600 text-white px-6 py-3 font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
