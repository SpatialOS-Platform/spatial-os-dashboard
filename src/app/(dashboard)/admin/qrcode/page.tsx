'use client'

import { useState, useRef, useMemo } from 'react'
import Image from 'next/image'

interface QRCodeOptions {
    anchorId?: string
    spaceId?: string
    size: number
    foregroundColor: string
    backgroundColor: string
    errorCorrection: 'L' | 'M' | 'Q' | 'H'
}

export default function QRCodeGeneratorPage() {
    const [options, setOptions] = useState<QRCodeOptions>({
        size: 256,
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        errorCorrection: 'M'
    })
    const [content, setContent] = useState('')
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    // Mock data - use useMemo instead of useEffect to avoid cascading renders
    const spaces = useMemo(() => [
        { space_id: 'space-1', name: 'Building A' },
        { space_id: 'space-2', name: 'Floor 1' },
        { space_id: 'space-3', name: 'Conference Room' },
    ], [])

    const anchors = useMemo(() => [
        { anchor_id: 'anchor-1', type: 'QR' },
        { anchor_id: 'anchor-2', type: 'IMAGE' },
    ], [])

    const generateQRContent = () => {
        // Generate deep link URL for Spatial OS
        const baseUrl = 'https://spatial-os.app/anchor'

        if (options.anchorId) {
            return `${baseUrl}/${options.anchorId}`
        } else if (options.spaceId) {
            return `${baseUrl}?space=${options.spaceId}`
        } else {
            return content || 'https://spatial-os.app'
        }
    }

    const generateQRCode = () => {
        const qrContent = generateQRContent()
        setContent(qrContent)

        // Use a simple QR code visualization (in production, use a proper library like qrcode.react)
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const size = options.size
        canvas.width = size
        canvas.height = size

        // Draw background
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(0, 0, size, size)

        // Simple QR code pattern simulation (replace with real QR library)
        const moduleCount = 25
        const moduleSize = size / moduleCount

        // Generate deterministic pattern based on content hash
        const hash = hashCode(qrContent)

        ctx.fillStyle = options.foregroundColor

        // Draw finder patterns (corners)
        drawFinderPattern(ctx, 0, 0, moduleSize)
        drawFinderPattern(ctx, (moduleCount - 7) * moduleSize, 0, moduleSize)
        drawFinderPattern(ctx, 0, (moduleCount - 7) * moduleSize, moduleSize)

        // Draw data modules (simplified)
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                // Skip finder pattern areas
                if ((row < 9 && col < 9) ||
                    (row < 9 && col > moduleCount - 9) ||
                    (row > moduleCount - 9 && col < 9)) {
                    continue
                }

                // Pseudo-random pattern based on hash
                const cellValue = ((hash * (row + 1) * (col + 1)) % 100) > 50
                if (cellValue) {
                    ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize - 1, moduleSize - 1)
                }
            }
        }

        setQrDataUrl(canvas.toDataURL('image/png'))
    }

    const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
        const patternSize = 7 * moduleSize

        // Outer black
        ctx.fillStyle = options.foregroundColor
        ctx.fillRect(x, y, patternSize, patternSize)

        // Inner white
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)

        // Center black
        ctx.fillStyle = options.foregroundColor
        ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }

    const hashCode = (str: string): number => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }
        return Math.abs(hash)
    }

    const downloadQR = () => {
        if (!qrDataUrl) return

        const link = document.createElement('a')
        link.download = `spatial-qr-${options.anchorId || options.spaceId || 'code'}.png`
        link.href = qrDataUrl
        link.click()
    }

    const copyEmbedCode = () => {
        const embedCode = `<img src="${qrDataUrl}" alt="Spatial OS QR Code" width="${options.size}" height="${options.size}" />`
        navigator.clipboard.writeText(embedCode)
        alert('Embed code copied!')
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Options Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-lg font-semibold mb-4">Link Target</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Space</label>
                                <select
                                    value={options.spaceId || ''}
                                    onChange={e => setOptions({ ...options, spaceId: e.target.value, anchorId: undefined })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">None</option>
                                    {spaces.map(s => (
                                        <option key={s.space_id} value={s.space_id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Or Link to Anchor</label>
                                <select
                                    value={options.anchorId || ''}
                                    onChange={e => setOptions({ ...options, anchorId: e.target.value, spaceId: undefined })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">None</option>
                                    {anchors.map(a => (
                                        <option key={a.anchor_id} value={a.anchor_id}>{a.anchor_id} ({a.type})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Or Custom URL</label>
                                <input
                                    type="text"
                                    value={content}
                                    onChange={e => { setContent(e.target.value); setOptions({ ...options, spaceId: undefined, anchorId: undefined }) }}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-lg font-semibold mb-4">Appearance</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
                                <select
                                    value={options.size}
                                    onChange={e => setOptions({ ...options, size: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value={128}>128 x 128</option>
                                    <option value={256}>256 x 256</option>
                                    <option value={512}>512 x 512</option>
                                    <option value={1024}>1024 x 1024</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Error Correction</label>
                                <select
                                    value={options.errorCorrection}
                                    onChange={e => setOptions({ ...options, errorCorrection: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="L">Low (7%)</option>
                                    <option value="M">Medium (15%)</option>
                                    <option value="Q">Quartile (25%)</option>
                                    <option value="H">High (30%)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foreground</label>
                                <input
                                    type="color"
                                    value={options.foregroundColor}
                                    onChange={e => setOptions({ ...options, foregroundColor: e.target.value })}
                                    className="w-full h-10 rounded-lg cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                                <input
                                    type="color"
                                    value={options.backgroundColor}
                                    onChange={e => setOptions({ ...options, backgroundColor: e.target.value })}
                                    className="w-full h-10 rounded-lg cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={generateQRCode}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Generate QR Code
                    </button>
                </div>

                {/* Preview Panel */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-lg font-semibold mb-4">Preview</h2>

                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[300px]">
                        {qrDataUrl ? (
                            <Image src={qrDataUrl} alt="QR Code" className="max-w-full" width={options.size} height={options.size} unoptimized />
                        ) : (
                            <div className="text-gray-400 text-center">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <p>Configure options and click Generate</p>
                            </div>
                        )}
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    {qrDataUrl && (
                        <div className="mt-4 space-y-2">
                            <div className="text-sm text-gray-500 break-all">
                                <strong>Encoded URL:</strong> {content}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={downloadQR}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                >
                                    📥 Download PNG
                                </button>
                                <button
                                    onClick={copyEmbedCode}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                                >
                                    📋 Copy Embed Code
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
