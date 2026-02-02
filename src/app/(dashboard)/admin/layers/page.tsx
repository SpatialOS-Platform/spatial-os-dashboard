'use client'

import { useState, useEffect } from 'react'

interface Layer {
    layer_id: string
    name: string
    space_id: string
    is_visible: boolean
    z_order: number
    created_at: string
}

export default function LayersPage() {
    const [layers, setLayers] = useState<Layer[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newLayer, setNewLayer] = useState({ name: '', space_id: '' })
    const [spaces, setSpaces] = useState<{ space_id: string; name: string }[]>([])

    useEffect(() => {
        fetchLayers()
        fetchSpaces()
    }, [])

    const fetchLayers = async () => {
        try {
            // Mock data for now - replace with API call
            setLayers([
                { layer_id: 'layer-1', name: 'Navigation', space_id: 'space-1', is_visible: true, z_order: 1, created_at: new Date().toISOString() },
                { layer_id: 'layer-2', name: 'Landmarks', space_id: 'space-1', is_visible: true, z_order: 2, created_at: new Date().toISOString() },
                { layer_id: 'layer-3', name: 'Information', space_id: 'space-2', is_visible: false, z_order: 1, created_at: new Date().toISOString() },
            ])
        } catch (error) {
            console.error('Failed to fetch layers:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSpaces = async () => {
        try {
            setSpaces([
                { space_id: 'space-1', name: 'Building A' },
                { space_id: 'space-2', name: 'Floor 1' },
            ])
        } catch (error) {
            console.error('Failed to fetch spaces:', error)
        }
    }

    const handleCreateLayer = async () => {
        if (!newLayer.name || !newLayer.space_id) return

        const layer: Layer = {
            layer_id: `layer-${Date.now()}`,
            name: newLayer.name,
            space_id: newLayer.space_id,
            is_visible: true,
            z_order: layers.length + 1,
            created_at: new Date().toISOString()
        }

        setLayers([...layers, layer])
        setShowCreateModal(false)
        setNewLayer({ name: '', space_id: '' })
    }

    const toggleVisibility = (layerId: string) => {
        setLayers(layers.map(layer =>
            layer.layer_id === layerId
                ? { ...layer, is_visible: !layer.is_visible }
                : layer
        ))
    }

    const deleteLayer = (layerId: string) => {
        if (confirm('Delete this layer?')) {
            setLayers(layers.filter(layer => layer.layer_id !== layerId))
        }
    }

    const moveLayer = (layerId: string, direction: 'up' | 'down') => {
        const index = layers.findIndex(l => l.layer_id === layerId)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === layers.length - 1) return

        const newLayers = [...layers]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
            ;[newLayers[index], newLayers[swapIndex]] = [newLayers[swapIndex], newLayers[index]]

        // Update z_order
        newLayers.forEach((layer, i) => {
            layer.z_order = i + 1
        })

        setLayers(newLayers)
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
                <h1 className="text-2xl font-bold text-gray-900">Layer Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Layer
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-blue-600">{layers.length}</div>
                    <div className="text-gray-500 text-sm">Total Layers</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-green-600">{layers.filter(l => l.is_visible).length}</div>
                    <div className="text-gray-500 text-sm">Visible</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-2xl font-bold text-gray-600">{layers.filter(l => !l.is_visible).length}</div>
                    <div className="text-gray-500 text-sm">Hidden</div>
                </div>
            </div>

            {/* Layers Table */}
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Space</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visibility</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {layers.map((layer, index) => (
                            <tr key={layer.layer_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => moveLayer(layer.layer_id, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                        >
                                            ▲
                                        </button>
                                        <span className="w-8 text-center">{layer.z_order}</span>
                                        <button
                                            onClick={() => moveLayer(layer.layer_id, 'down')}
                                            disabled={index === layers.length - 1}
                                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="font-medium">{layer.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {spaces.find(s => s.space_id === layer.space_id)?.name || layer.space_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleVisibility(layer.layer_id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${layer.is_visible
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {layer.is_visible ? '👁 Visible' : '🚫 Hidden'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => deleteLayer(layer.layer_id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {layers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No layers yet. Create your first layer to organize anchors.
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create Layer</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Layer Name</label>
                                <input
                                    type="text"
                                    value={newLayer.name}
                                    onChange={e => setNewLayer({ ...newLayer, name: e.target.value })}
                                    placeholder="e.g., Navigation Points"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Space</label>
                                <select
                                    value={newLayer.space_id}
                                    onChange={e => setNewLayer({ ...newLayer, space_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a space...</option>
                                    {spaces.map(space => (
                                        <option key={space.space_id} value={space.space_id}>{space.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateLayer}
                                disabled={!newLayer.name || !newLayer.space_id}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Create Layer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
