'use client';

import { useState } from 'react';
import { spatial } from '@/lib/api';

export default function SpatialManager() {
    const [status, setStatus] = useState('');
    const [spaceId, setSpaceId] = useState('');
    const [payload, setPayload] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Registering...');
        try {
            await spatial.registerAnchor({
                space_id: spaceId || 'default-lobby', // fallback for demo
                type: 'IMAGE',
                payload,
                lat: lat ? parseFloat(lat) : undefined,
                lon: lon ? parseFloat(lon) : undefined
            });
            setStatus('✅ Anchor Registered!');
            setPayload('');
        } catch (err: any) {
            setStatus(`❌ Error: ${err.message}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Spatial Calibration Manager</h1>

            <div className="bg-white p-6 rounded shadow-md max-w-lg">
                <h2 className="text-xl mb-4">Register New Anchor</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Space ID (Room/Floor)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={spaceId}
                            onChange={(e) => setSpaceId(e.target.value)}
                            placeholder="e.g. room-101"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Payload (Image URL / Marker ID)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            placeholder="https://example.com/marker.jpg"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-2">Latitude (Opt)</label>
                            <input
                                type="number" step="any"
                                className="w-full p-2 border rounded"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-2">Longitude (Opt)</label>
                            <input
                                type="number" step="any"
                                className="w-full p-2 border rounded"
                                value={lon}
                                onChange={(e) => setLon(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Register Anchor
                    </button>

                    {status && <p className="mt-4 text-center font-bold">{status}</p>}
                </form>
            </div>

            <div className="mt-8">
                <h2 className="text-xl mb-2">Instructions</h2>
                <ul className="list-disc pl-5">
                    <li>Upload a reference image to a public URL.</li>
                    <li>Enter the Space ID (e.g., "lobby-main").</li>
                    <li>Paste the Image URL into Payload.</li>
                    <li>Click Register.</li>
                    <li>The Unity Client will now recognize this image and sync coordinates.</li>
                </ul>
            </div>
        </div>
    );
}
