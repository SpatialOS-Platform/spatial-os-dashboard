'use client';

import { useEffect, useState } from 'react';
import { spatial } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Box, Plus, Edit, FolderTree, MapPin } from 'lucide-react';

interface Space {
    space_id: string;
    name: string;
    lat?: number;
    lon?: number;
    parent_space_id?: string;
    parent_space?: { name: string };
    h3_index?: string;
    is_public: boolean;
    created_at: string;
    _count?: { anchors: number; children: number };
}

export default function SpacesPage() {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSpace, setEditingSpace] = useState<Space | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formLat, setFormLat] = useState('');
    const [formLon, setFormLon] = useState('');
    const [formParent, setFormParent] = useState('');

    const fetchSpaces = async () => {
        try {
            const data = await spatial.getSpaces();
            setSpaces(data);
        } catch (e) {
            console.error('Failed to fetch spaces', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, []);

    const handleCreateSpace = async () => {
        try {
            await spatial.createSpace({
                name: formName,
                lat: formLat ? parseFloat(formLat) : null,
                lon: formLon ? parseFloat(formLon) : null,
                parent_space_id: formParent || null
            });
            setShowCreateModal(false);
            resetForm();
            await fetchSpaces();
        } catch (e) {
            console.error('Failed to create space', e);
        }
    };

    const handleUpdateSpace = async () => {
        if (!editingSpace) return;
        try {
            await spatial.updateSpace(editingSpace.space_id, {
                name: formName,
                lat: formLat ? parseFloat(formLat) : null,
                lon: formLon ? parseFloat(formLon) : null,
                parent_space_id: formParent || null
            });
            setEditingSpace(null);
            resetForm();
            await fetchSpaces();
        } catch (e) {
            console.error('Failed to update space', e);
        }
    };

    const openEditModal = (space: Space) => {
        setEditingSpace(space);
        setFormName(space.name);
        setFormLat(space.lat?.toString() || '');
        setFormLon(space.lon?.toString() || '');
        setFormParent(space.parent_space_id || '');
    };

    const resetForm = () => {
        setFormName('');
        setFormLat('');
        setFormLon('');
        setFormParent('');
    };

    const buildHierarchyTree = (spaces: Space[]): Space[] => {
        // Sort spaces by hierarchy: parents first, then children
        const rootSpaces = spaces.filter(s => !s.parent_space_id);
        const childSpaces = spaces.filter(s => s.parent_space_id);

        const result: Space[] = [];

        const addWithChildren = (parent: Space, level: number = 0) => {
            result.push({ ...parent, name: '  '.repeat(level) + (level > 0 ? '└─ ' : '') + parent.name });
            const children = childSpaces.filter(c => c.parent_space_id === parent.space_id);
            children.forEach(child => addWithChildren(child, level + 1));
        };

        rootSpaces.forEach(root => addWithChildren(root));
        return result;
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white font-display flex items-center gap-3">
                        <Box className="w-8 h-8" />
                        Spaces Management
                    </h2>
                    <p className="text-gray-400">Manage spatial hierarchies (Buildings → Floors → Rooms)</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Space
                </Button>
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingSpace) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            {editingSpace ? 'Edit Space' : 'Create New Space'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Name *</label>
                                <Input
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g., Main Building, Floor 1, Room 101"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Latitude</label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={formLat}
                                        onChange={(e) => setFormLat(e.target.value)}
                                        placeholder="40.7128"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Longitude</label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={formLon}
                                        onChange={(e) => setFormLon(e.target.value)}
                                        placeholder="-74.0060"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Parent Space</label>
                                <select
                                    value={formParent}
                                    onChange={(e) => setFormParent(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                                >
                                    <option value="">None (Root Space)</option>
                                    {spaces
                                        .filter(s => s.space_id !== editingSpace?.space_id)
                                        .map((s) => (
                                            <option key={s.space_id} value={s.space_id}>
                                                {s.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingSpace(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={editingSpace ? handleUpdateSpace : handleCreateSpace}>
                                {editingSpace ? 'Save Changes' : 'Create Space'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Spaces Table */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : spaces.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        No spaces found. Create one to get started.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>H3 Index</TableHead>
                                <TableHead>Anchors</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buildHierarchyTree(spaces).map((space) => (
                                <TableRow key={space.space_id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {space.parent_space_id ? (
                                                <FolderTree className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <Box className="w-4 h-4 text-blue-400" />
                                            )}
                                            <span className="font-mono text-sm whitespace-pre">{space.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {space.lat && space.lon ? (
                                            <span className="flex items-center gap-1 text-sm text-gray-400">
                                                <MapPin className="w-3 h-3" />
                                                {space.lat.toFixed(4)}, {space.lon.toFixed(4)}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs text-gray-400">{space.h3_index || '—'}</code>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                            {space._count?.anchors || 0}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${space.is_public ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {space.is_public ? 'Public' : 'Private'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => openEditModal(space)}
                                            className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                            title="Edit space"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
