'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataGrid } from '@/components/data-grid'
import { Loader2, Upload, ArrowLeft, Plus, Columns, Search, Filter, Download } from 'lucide-react'
import Link from 'next/link'

export default function TablePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const tableId = params.tableId as string
  const queryClient = useQueryClient()
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

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
      const res = await fetch(`/api/tables/${tableId}/rows?limit=100`)
      if (!res.ok) throw new Error('Failed to fetch rows')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  const updateCellMutation = useMutation({
    mutationFn: async ({
      rowId,
      columnName,
      value,
    }: {
      rowId: string
      columnName: string
      value: string
    }) => {
      const res = await fetch(`/api/tables/${tableId}/rows/${rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells: { [columnName]: value } }),
      })
      if (!res.ok) throw new Error('Failed to update cell')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rows', tableId] })
    },
  })

  const addRowMutation = useMutation({
    mutationFn: async () => {
      const cells: Record<string, string> = {}
      table?.columns?.forEach((col: any) => {
        cells[col.name] = ''
      })

      const res = await fetch(`/api/tables/${tableId}/rows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells }),
      })
      if (!res.ok) throw new Error('Failed to add row')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rows', tableId] })
    },
  })

  const deleteRowMutation = useMutation({
    mutationFn: async (rowId: string) => {
      const res = await fetch(`/api/tables/${tableId}/rows/${rowId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete row')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rows', tableId] })
    },
  })

  const addColumnMutation = useMutation({
    mutationFn: async () => {
      const columnName = prompt('Enter column name:')
      if (!columnName) return

      const res = await fetch(`/api/tables/${tableId}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: columnName,
          type: 'text',
        }),
      })
      if (!res.ok) throw new Error('Failed to add column')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table', tableId] })
      queryClient.invalidateQueries({ queryKey: ['rows', tableId] })
    },
  })

  if (status === 'loading' || tableLoading || rowsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        {/* Toolbar Header */}
        <div className="flex flex-col gap-4 py-4 px-6 bg-white border-b border-gray-100">
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
                   <span className="uppercase font-bold tracking-wider">{table?.columns?.length || 0} COLUMNS</span>
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
              <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search records..." 
                    className="pl-8 pr-4 py-1.5 bg-gray-50 border-none text-xs rounded-lg w-48 focus:ring-2 focus:ring-blue-500/10 transition"
                  />
               </div>
               <div className="h-4 w-px bg-gray-100"></div>
               <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition">
                    <Columns className="h-3.5 w-3.5" />
                    Columns
                  </button>
               </div>
            </div>
            
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
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
                  columns={table.columns || []}
                  rows={rowsData.rows || []}
                  onCellUpdate={(rowId, columnName, value) => {
                    updateCellMutation.mutate({ rowId, columnName, value })
                  }}
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
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import CSV</h2>
        <p className="text-gray-500 mb-8">Upload your data into this table instantly.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
               <p className="text-xs text-gray-400 mt-2">
                 Headers must match column names
               </p>
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
