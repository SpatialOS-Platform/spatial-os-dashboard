'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Space {
    space_id: string
    name: string
    owner_id?: string
    parent_space_id?: string
    origin_lat?: number
    origin_lon?: number
    created_at: string
}

export default function SpacesPage() {
    const [spaces, setSpaces] = useState<Space[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [newSpace, setNewSpace] = useState({ name: '', origin_lat: '', origin_lon: '' })
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchSpaces()
    }, [])

    const fetchSpaces = async () => {
        try {
            const res = await fetch('http://localhost:8787/spatial/spaces')
            const data = await res.json()
            // Handle both array and {spaces: []} formats
            const spacesArray = Array.isArray(data) ? data : (data.spaces || [])
            setSpaces(spacesArray)
        } catch (e) {
            console.error('Failed to fetch spaces:', e)
            setSpaces([])
        } finally {
            setLoading(false)
        }
    }

    const createSpace = async () => {
        setCreating(true)
        try {
            const res = await fetch('http://localhost:8787/spatial/space', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newSpace.name,
                    origin_lat: newSpace.origin_lat ? parseFloat(newSpace.origin_lat) : null,
                    origin_lon: newSpace.origin_lon ? parseFloat(newSpace.origin_lon) : null
                })
            })

            if (res.ok) {
                setShowCreate(false)
                setNewSpace({ name: '', origin_lat: '', origin_lon: '' })
                fetchSpaces()
            }
        } finally {
            setCreating(false)
        }
    }

    const deleteSpace = async (spaceId: string) => {
        if (!confirm('Are you sure you want to delete this space?')) return

        await fetch(`http://localhost:8787/spatial/space/${spaceId}`, { method: 'DELETE' })
        fetchSpaces()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Spaces Management</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Create Space
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-blue-600">{spaces.length}</div>
                    <div className="text-gray-500 text-sm">Total Spaces</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-green-600">{spaces.filter(s => s.origin_lat).length}</div>
                    <div className="text-gray-500 text-sm">Geo-referenced</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-purple-600">{spaces.filter(s => s.parent_space_id).length}</div>
                    <div className="text-gray-500 text-sm">Nested Spaces</div>
                </div>
            </div>

            {/* Spaces Table */}
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Space ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {spaces.map(space => (
                            <tr key={space.space_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{space.space_id}</code>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{space.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                    {space.origin_lat && space.origin_lon
                                        ? `${space.origin_lat.toFixed(4)}, ${space.origin_lon.toFixed(4)}`
                                        : '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                    {space.parent_space_id || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                    {new Date(space.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <Link href={`/spaces/${space.space_id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                        <button
                                            onClick={() => deleteSpace(space.space_id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {spaces.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No spaces found. Create your first space to get started.
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Create New Space</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Space Name *</label>
                                <input
                                    type="text"
                                    value={newSpace.name}
                                    onChange={e => setNewSpace({ ...newSpace, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Building A, Floor 1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={newSpace.origin_lat}
                                        onChange={e => setNewSpace({ ...newSpace, origin_lat: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="37.7749"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={newSpace.origin_lon}
                                        onChange={e => setNewSpace({ ...newSpace, origin_lon: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="-122.4194"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createSpace}
                                disabled={!newSpace.name || creating}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Create Space'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
