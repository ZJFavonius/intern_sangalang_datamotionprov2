'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Plus, Table as TableIcon, Loader2, ArrowLeft, MoreHorizontal, Settings, Users, LayoutGrid, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function WorkspacePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const queryClient = useQueryClient()
  const [showNewTableModal, setShowNewTableModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const { data: workspace, isLoading: workspaceLoading } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${workspaceId}`)
      if (!res.ok) throw new Error('Failed to fetch workspace')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['tables', workspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${workspaceId}/tables`)
      if (!res.ok) throw new Error('Failed to fetch tables')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  if (status === 'loading' || workspaceLoading || tablesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Breadcrumbs / Header */}
        <div className="flex flex-col gap-6 mb-12">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100">
                <LayoutGrid className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {workspace?.name || 'Workspace'}
                </h1>
                <p className="text-gray-500 mt-1">{workspace?.description || 'Collaborative workspace'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition">
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition">
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowNewTableModal(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Table
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <TableIcon className="h-5 w-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Data Tables</h2>
          </div>

          {tables && tables.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-20 text-center">
              <div className="bg-gray-50 p-5 rounded-2xl inline-block mb-6">
                <TableIcon className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tables in this workspace</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Create a table to start organizing your data, importing CSVs, and collaborating.</p>
              <button
                onClick={() => setShowNewTableModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                <Plus className="h-5 w-5" />
                Create First Table
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables?.map((table: any) => (
                <Link
                  key={table.id}
                  href={`/dashboard/workspaces/${workspaceId}/tables/${table.id}`}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-50 transition-all duration-300 relative"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-600 transition-colors duration-300">
                      <TableIcon className="h-6 w-6 text-green-600 group-hover:text-white" />
                    </div>
                    <button className="p-1.5 text-gray-300 hover:text-gray-600 transition">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {table.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-8 h-[40px]">
                    {table.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        {table._count?.rows || 0} ROWS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(table.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Add New Quick Card */}
              <button
                onClick={() => setShowNewTableModal(true)}
                className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:bg-blue-50 hover:border-blue-200 transition-all group"
              >
                <div className="bg-white p-3 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-blue-600 uppercase tracking-wider">Add Table</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showNewTableModal && (
        <NewTableModal
          workspaceId={workspaceId}
          onClose={() => setShowNewTableModal(false)}
          onSuccess={() => {
            setShowNewTableModal(false)
            queryClient.invalidateQueries({ queryKey: ['tables', workspaceId] })
          }}
        />
      )}
    </DashboardLayout>
  )
}

function NewTableModal({
  workspaceId,
  onClose,
  onSuccess,
}: {
  workspaceId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [columns, setColumns] = useState([
    { name: 'Name', type: 'text' },
    { name: 'Email', type: 'text' },
  ])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, columns }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create table')
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Table</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Table Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                placeholder="Active Customers"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                rows={2}
                placeholder="What data is in this table?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Fields
              </label>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {columns.map((col, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => {
                        const newCols = [...columns]
                        newCols[idx].name = e.target.value
                        setColumns(newCols)
                      }}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm transition focus:bg-white"
                      placeholder="Field Name"
                    />
                    <select
                      value={col.type}
                      onChange={(e) => {
                        const newCols = [...columns]
                        newCols[idx].type = e.target.value
                        setColumns(newCols)
                      }}
                      className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm transition focus:bg-white"
                    >
                      <option value="text">TEXT</option>
                      <option value="number">NUM</option>
                      <option value="date">DATE</option>
                      <option value="boolean">BOOL</option>
                    </select>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setColumns([...columns, { name: '', type: 'text' }])
                }
                className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </button>
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
              disabled={loading || !name}
              className="flex-1 bg-blue-600 text-white px-6 py-3 font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
