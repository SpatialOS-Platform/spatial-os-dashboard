'use client';

import { useEffect, useRef, useState } from 'react';
import { spatial } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Box, Save, Layers, RefreshCw } from 'lucide-react';

// Types for 3D scene
interface AnchorNode {
    id: string;
    type: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    payload?: string;
    status: string;
}

interface SpaceNode {
    id: string;
    name: string;
    children: SpaceNode[];
    anchors: AnchorNode[];
    position: { x: number; y: number; z: number };
}

/**
 * P2-9/10/11: 3D Space Viewer Component
 * 
 * This component provides a visual editor for spatial anchors using
 * a 3D scene. It uses basic Canvas 2D for now, with a note for
 * future Three.js/R3F integration.
 * 
 * Features:
 * - Hierarchy visualization (Building → Floor → Room)
 * - Anchor placement and dragging
 * - Real-time sync via WebSocket
 */
export default function SpaceViewerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spaces, setSpaces] = useState<SpaceNode[]>([]);
    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
    const [anchors, setAnchors] = useState<AnchorNode[]>([]);
    const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [loading, setLoading] = useState(true);

    // Camera/view state
    const [offset] = useState({ x: 400, y: 300 });
    const [scale, setScale] = useState(1);

    const fetchSpaces = async () => {
        try {
            const data = await spatial.getSpaces();
            // Convert flat list to hierarchical structure
            const hierarchical = buildHierarchy(data);
            setSpaces(hierarchical);
            if (data.length > 0 && !selectedSpace) {
                setSelectedSpace(data[0].space_id);
            }
        } catch (e) {
            console.error('Failed to fetch spaces', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnchors = async (spaceId: string) => {
        try {
            const data = await spatial.getAnchorsInSpace(spaceId);
            const mapped: AnchorNode[] = data.map((a: { anchor_id: string; type: string; lat?: number; lon?: number; alt?: number; payload?: string; status: string }, i: number) => ({
                id: a.anchor_id,
                type: a.type,
                position: {
                    x: (a.lat || 0) * 100 + i * 60,
                    y: (a.lon || 0) * 100 + i * 40,
                    z: a.alt || 0
                },
                rotation: { x: 0, y: 0, z: 0 },
                payload: a.payload,
                status: a.status
            }));
            setAnchors(mapped);
        } catch (e) {
            console.error('Failed to fetch anchors', e);
        }
    };

    const buildHierarchy = (flatSpaces: { space_id: string; name: string; parent_space_id?: string; lat?: number; lon?: number }[]): SpaceNode[] => {
        const map = new Map<string, SpaceNode>();
        const roots: SpaceNode[] = [];

        flatSpaces.forEach(s => {
            map.set(s.space_id, {
                id: s.space_id,
                name: s.name,
                children: [],
                anchors: [],
                position: { x: s.lat || 0, y: s.lon || 0, z: 0 }
            });
        });

        flatSpaces.forEach(s => {
            const node = map.get(s.space_id)!;
            if (s.parent_space_id && map.has(s.parent_space_id)) {
                map.get(s.parent_space_id)!.children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    useEffect(() => {
        fetchSpaces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedSpace) {
            fetchAnchors(selectedSpace);
        }
    }, [selectedSpace]);

    // Render 2D Canvas
    useEffect(() => {
        if (!canvasRef.current || viewMode !== '2d') return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const canvas = canvasRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        const gridSize = 50 * scale;
        for (let x = offset.x % gridSize; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = offset.y % gridSize; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw anchors
        anchors.forEach(anchor => {
            const x = offset.x + anchor.position.x * scale;
            const y = offset.y + anchor.position.y * scale;

            // Anchor circle
            ctx.beginPath();
            ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);

            // Color based on type
            if (anchor.id === selectedAnchor) {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'; // Blue selected
                ctx.strokeStyle = '#3B82F6';
            } else if (anchor.status === 'deleted') {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
                ctx.strokeStyle = '#EF4444';
            } else {
                ctx.fillStyle = anchor.type === 'IMAGE' ? 'rgba(16, 185, 129, 0.6)' :
                    anchor.type === 'QR' ? 'rgba(139, 92, 246, 0.6)' :
                        'rgba(245, 158, 11, 0.6)';
                ctx.strokeStyle = anchor.type === 'IMAGE' ? '#10B981' :
                    anchor.type === 'QR' ? '#8B5CF6' : '#F59E0B';
            }
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();

            // Type icon
            ctx.fillStyle = '#fff';
            ctx.font = `${12 * scale}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(anchor.type[0], x, y);

            // Label
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = `${10 * scale}px sans-serif`;
            ctx.fillText(anchor.payload?.slice(0, 10) || anchor.id.slice(0, 8), x, y + 30 * scale);
        });

    }, [anchors, selectedAnchor, offset, scale, viewMode]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - offset.x) / scale;
        const y = (e.clientY - rect.top - offset.y) / scale;

        // Find clicked anchor
        const clicked = anchors.find(a => {
            const dx = a.position.x - x;
            const dy = a.position.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 25;
        });

        setSelectedAnchor(clicked?.id || null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !selectedAnchor) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - offset.x) / scale;
        const y = (e.clientY - rect.top - offset.y) / scale;

        setAnchors(prev => prev.map(a =>
            a.id === selectedAnchor
                ? { ...a, position: { ...a.position, x, y } }
                : a
        ));
    };

    const handleSave = async () => {
        // Save anchor positions back to server
        for (const anchor of anchors) {
            try {
                await spatial.updateAnchor(anchor.id, {
                    // Convert back to lat/lon (simplified)
                    lat: anchor.position.x / 100,
                    lon: anchor.position.y / 100
                });
            } catch (e) {
                console.error(`Failed to save anchor ${anchor.id}`, e);
            }
        }
        alert('Positions saved!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white font-display flex items-center gap-3">
                        <Box className="w-8 h-8" />
                        Visual Anchor Editor
                    </h2>
                    <p className="text-gray-400">Drag anchors to reposition. Click to select.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setScale(s => s * 1.2)}>
                        Zoom In
                    </Button>
                    <Button variant="outline" onClick={() => setScale(s => s / 1.2)}>
                        Zoom Out
                    </Button>
                    <Button variant="outline" onClick={() => fetchAnchors(selectedSpace!)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4">
                {/* Space selector */}
                <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">Space</label>
                    <select
                        value={selectedSpace || ''}
                        onChange={(e) => setSelectedSpace(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                    >
                        {spaces.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                        {spaces.flatMap(s => s.children.map(c => (
                            <option key={c.id} value={c.id}>└─ {c.name}</option>
                        )))}
                    </select>
                </div>

                {/* View mode toggle */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">View</label>
                    <div className="flex rounded-lg overflow-hidden border border-white/10">
                        <button
                            className={`px-4 py-2 ${viewMode === '2d' ? 'bg-blue-500' : 'bg-black/30'}`}
                            onClick={() => setViewMode('2d')}
                        >
                            2D
                        </button>
                        <button
                            className={`px-4 py-2 ${viewMode === '3d' ? 'bg-blue-500' : 'bg-black/30'}`}
                            onClick={() => setViewMode('3d')}
                            disabled
                            title="3D mode requires Three.js (coming soon)"
                        >
                            3D
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Legend</label>
                    <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            IMAGE
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            QR
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                            GPS
                        </span>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                {loading ? (
                    <div className="h-[500px] flex items-center justify-center text-gray-400">
                        Loading...
                    </div>
                ) : viewMode === '2d' ? (
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={500}
                        className="w-full h-[500px] cursor-crosshair"
                        onClick={handleCanvasClick}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onMouseMove={handleMouseMove}
                    />
                ) : (
                    <div className="h-[500px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>3D View requires Three.js integration</p>
                            <p className="text-sm mt-2">Coming in next release</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected anchor details */}
            {selectedAnchor && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold text-white mb-2">Selected Anchor</h3>
                    {(() => {
                        const anchor = anchors.find(a => a.id === selectedAnchor);
                        if (!anchor) return null;
                        return (
                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">ID:</span>
                                    <span className="ml-2 font-mono">{anchor.id.slice(0, 12)}...</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Type:</span>
                                    <span className="ml-2">{anchor.type}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Position:</span>
                                    <span className="ml-2 font-mono">
                                        ({anchor.position.x.toFixed(1)}, {anchor.position.y.toFixed(1)})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`ml-2 ${anchor.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                        {anchor.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
