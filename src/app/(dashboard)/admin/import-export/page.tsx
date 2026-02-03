'use client'

import { useState, useRef } from 'react'

interface ExportedSpace {
    space_id: string
    name: string
    parent_space_id?: string | null
    origin_lat?: number
    origin_lon?: number
}

interface ExportedAnchor {
    anchor_id: string
    space_id: string
    type: string
    px: number
    py: number
    pz: number
    payload?: string
}

interface ExportedLayer {
    layer_id: string
    name: string
    is_visible: boolean
}

interface SpaceExport {
    version: string
    exported_at: string
    spaces: ExportedSpace[]
    anchors: ExportedAnchor[]
    layers: ExportedLayer[]
}

export default function ImportExportPage() {
    const [exportData, setExportData] = useState<SpaceExport | null>(null)
    const [importing, setImporting] = useState(false)
    const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null)
    const [selectedSpaces, setSelectedSpaces] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const spaces = [
        { space_id: 'space-1', name: 'Building A', anchors: 5 },
        { space_id: 'space-2', name: 'Floor 1', anchors: 12 },
        { space_id: 'space-3', name: 'Conference Room', anchors: 3 },
    ]

    const handleExport = async () => {
        const spacesToExport = selectedSpaces.length > 0
            ? spaces.filter(s => selectedSpaces.includes(s.space_id))
            : spaces

        const exportPayload: SpaceExport = {
            version: '1.0',
            exported_at: new Date().toISOString(),
            spaces: spacesToExport.map(s => ({
                space_id: s.space_id,
                name: s.name,
                parent_space_id: null,
                origin_lat: 37.7749,
                origin_lon: -122.4194
            })),
            anchors: spacesToExport.flatMap(s =>
                Array(s.anchors).fill(null).map((_, i) => ({
                    anchor_id: `${s.space_id}-anchor-${i + 1}`,
                    space_id: s.space_id,
                    type: ['IMAGE', 'QR', 'GPS', 'MARKER'][i % 4],
                    px: Math.random() * 10,
                    py: Math.random() * 2,
                    pz: Math.random() * 10,
                    payload: JSON.stringify({ generated: true })
                }))
            ),
            layers: [
                { layer_id: 'layer-default', name: 'Default Layer', is_visible: true }
            ]
        }

        setExportData(exportPayload)

        // Download file
        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `spatial-os-export-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImporting(true)
        setImportResult(null)

        try {
            const text = await file.text()
            const data = JSON.parse(text) as SpaceExport

            // Validate structure
            if (!data.version || !data.spaces || !data.anchors) {
                throw new Error('Invalid export file format')
            }

            // Simulate import process
            await new Promise(resolve => setTimeout(resolve, 1500))

            setImportResult({
                success: true,
                message: `Successfully imported ${data.spaces.length} spaces and ${data.anchors.length} anchors`
            })
        } catch (error) {
            setImportResult({
                success: false,
                message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
        } finally {
            setImporting(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const toggleSpaceSelection = (spaceId: string) => {
        setSelectedSpaces(prev =>
            prev.includes(spaceId)
                ? prev.filter(id => id !== spaceId)
                : [...prev, spaceId]
        )
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Import / Export Spaces</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Export Section */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="text-2xl">📤</span> Export
                    </h2>

                    <p className="text-gray-600 mb-4">
                        Export spaces, anchors, and layers to a JSON file for backup or migration.
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Spaces to Export (leave empty for all)
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                            {spaces.map(space => (
                                <label key={space.space_id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedSpaces.includes(space.space_id)}
                                        onChange={() => toggleSpaceSelection(space.space_id)}
                                        className="rounded"
                                    />
                                    <span className="font-medium">{space.name}</span>
                                    <span className="text-gray-400 text-sm">({space.anchors} anchors)</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Export {selectedSpaces.length > 0 ? `${selectedSpaces.length} Space(s)` : 'All Spaces'}
                    </button>

                    {exportData && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                            ✅ Exported {exportData.spaces.length} spaces, {exportData.anchors.length} anchors
                        </div>
                    )}
                </div>

                {/* Import Section */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="text-2xl">📥</span> Import
                    </h2>

                    <p className="text-gray-600 mb-4">
                        Import spaces and anchors from a previously exported JSON file.
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div
                        onClick={handleImportClick}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                        {importing ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
                                <p className="text-gray-600">Importing...</p>
                            </div>
                        ) : (
                            <>
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-gray-600 font-medium">Click to upload</p>
                                <p className="text-gray-400 text-sm">or drag and drop a JSON file</p>
                            </>
                        )}
                    </div>

                    {importResult && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${importResult.success
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {importResult.success ? '✅' : '❌'} {importResult.message}
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                        ⚠️ <strong>Warning:</strong> Importing will add new spaces and anchors. Existing data with matching IDs will be updated.
                    </div>
                </div>
            </div>

            {/* Format Reference */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
                <h3 className="font-semibold mb-3">Export Format Reference</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "version": "1.0",
  "exported_at": "2026-02-01T12:00:00Z",
  "spaces": [
    { "space_id": "...", "name": "...", "parent_space_id": null }
  ],
  "anchors": [
    { "anchor_id": "...", "space_id": "...", "type": "IMAGE", "px": 0, "py": 0, "pz": 0 }
  ],
  "layers": [
    { "layer_id": "...", "name": "...", "is_visible": true }
  ]
}`}
                </pre>
            </div>
        </div>
    )
}
