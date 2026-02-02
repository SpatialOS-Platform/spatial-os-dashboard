'use client'

import { useState, useEffect, useMemo } from 'react'

interface SpatialAnchor {
    anchor_id: string
    space_id: string
    type: 'IMAGE' | 'QR' | 'GPS' | 'MARKER'
    px: number
    py: number
    pz: number
    payload?: string
    h3_index?: string
    created_at: string
}

interface Space {
    space_id: string
    name: string
}

type SortField = 'created_at' | 'type' | 'space_id' | 'anchor_id'
type SortDirection = 'asc' | 'desc'

export default function AnchorSearchPage() {
    const [anchors, setAnchors] = useState<SpatialAnchor[]>([])
    const [spaces, setSpaces] = useState<Space[]>([])
    const [loading, setLoading] = useState(true)

    // Filter state
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('')
    const [spaceFilter, setSpaceFilter] = useState<string>('')
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Mock data
            setSpaces([
                { space_id: 'space-1', name: 'Building A' },
                { space_id: 'space-2', name: 'Floor 1' },
                { space_id: 'space-3', name: 'Conference Room' },
            ])

            setAnchors([
                { anchor_id: 'anc-001', space_id: 'space-1', type: 'IMAGE', px: 1.5, py: 0, pz: 2.3, payload: '{"marker":"logo.png"}', h3_index: '8a2a10c2c67ffff', created_at: '2026-01-28T10:00:00Z' },
                { anchor_id: 'anc-002', space_id: 'space-1', type: 'QR', px: 0, py: 1, pz: 0, payload: '{"code":"entry-001"}', h3_index: '8a2a10c2c67ffff', created_at: '2026-01-29T14:30:00Z' },
                { anchor_id: 'anc-003', space_id: 'space-2', type: 'GPS', px: 37.7749, py: 0, pz: -122.4194, payload: '{"name":"Main Entrance"}', h3_index: '8928308280fffff', created_at: '2026-01-30T09:15:00Z' },
                { anchor_id: 'anc-004', space_id: 'space-2', type: 'MARKER', px: 2, py: 1.5, pz: 3, payload: '{"label":"Info Point"}', created_at: '2026-01-30T11:00:00Z' },
                { anchor_id: 'anc-005', space_id: 'space-3', type: 'IMAGE', px: 0, py: 0, pz: 0, payload: '{"marker":"sign.png"}', created_at: '2026-01-31T16:45:00Z' },
                { anchor_id: 'anc-006', space_id: 'space-3', type: 'QR', px: 1, py: 0, pz: 1, payload: '{"code":"room-id-42"}', created_at: '2026-02-01T08:00:00Z' },
            ])
        } finally {
            setLoading(false)
        }
    }

    // Filter and sort anchors
    const filteredAnchors = useMemo(() => {
        let result = [...anchors]

        // Search filter (fuzzy match on anchor_id and payload)
        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(a =>
                a.anchor_id.toLowerCase().includes(searchLower) ||
                (a.payload && a.payload.toLowerCase().includes(searchLower)) ||
                a.h3_index?.includes(searchLower)
            )
        }

        // Type filter
        if (typeFilter) {
            result = result.filter(a => a.type === typeFilter)
        }

        // Space filter
        if (spaceFilter) {
            result = result.filter(a => a.space_id === spaceFilter)
        }

        // Sort
        result.sort((a, b) => {
            let valueA: any = a[sortField]
            let valueB: any = b[sortField]

            if (sortField === 'created_at') {
                valueA = new Date(valueA).getTime()
                valueB = new Date(valueB).getTime()
            }

            if (sortDirection === 'asc') {
                return valueA > valueB ? 1 : -1
            } else {
                return valueA < valueB ? 1 : -1
            }
        })

        return result
    }, [anchors, search, typeFilter, spaceFilter, sortField, sortDirection])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const getTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            IMAGE: 'bg-purple-100 text-purple-800',
            QR: 'bg-blue-100 text-blue-800',
            GPS: 'bg-green-100 text-green-800',
            MARKER: 'bg-orange-100 text-orange-800'
        }
        return colors[type] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
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
            <h1 className="text-2xl font-bold mb-6">Anchor Search & Filter</h1>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-blue-600">{anchors.length}</div>
                    <div className="text-gray-500 text-sm">Total Anchors</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-purple-600">{anchors.filter(a => a.type === 'IMAGE').length}</div>
                    <div className="text-gray-500 text-sm">Image Anchors</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-green-600">{anchors.filter(a => a.type === 'GPS').length}</div>
                    <div className="text-gray-500 text-sm">GPS Anchors</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-orange-600">{filteredAnchors.length}</div>
                    <div className="text-gray-500 text-sm">Filtered Results</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="ID, payload, H3..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">All Types</option>
                            <option value="IMAGE">IMAGE</option>
                            <option value="QR">QR</option>
                            <option value="GPS">GPS</option>
                            <option value="MARKER">MARKER</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Space</label>
                        <select
                            value={spaceFilter}
                            onChange={e => setSpaceFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">All Spaces</option>
                            {spaces.map(s => (
                                <option key={s.space_id} value={s.space_id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => { setSearch(''); setTypeFilter(''); setSpaceFilter('') }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                { field: 'anchor_id' as SortField, label: 'Anchor ID' },
                                { field: 'type' as SortField, label: 'Type' },
                                { field: 'space_id' as SortField, label: 'Space' },
                                { field: 'created_at' as SortField, label: 'Position' },
                                { field: 'created_at' as SortField, label: 'Created' },
                            ].map(col => (
                                <th
                                    key={col.label}
                                    onClick={() => handleSort(col.field)}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                >
                                    {col.label}
                                    {sortField === col.field && (
                                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAnchors.map(anchor => (
                            <tr key={anchor.anchor_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{anchor.anchor_id}</code>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(anchor.type)}`}>
                                        {anchor.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {spaces.find(s => s.space_id === anchor.space_id)?.name || anchor.space_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ({anchor.px.toFixed(2)}, {anchor.py.toFixed(2)}, {anchor.pz.toFixed(2)})
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(anchor.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                                        <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                                        <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAnchors.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No anchors match your search criteria.
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredAnchors.length} of {anchors.length} anchors
            </div>
        </div>
    )
}
