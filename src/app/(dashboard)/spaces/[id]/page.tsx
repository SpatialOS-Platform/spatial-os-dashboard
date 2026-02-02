import { PresenceList } from '@/components/PresenceList';

export default async function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Space Details</h1>
            {/* Existing details would go here */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PresenceList spaceId={id} />
                {/* Other widgets */}
            </div>
        </div>
    );
}
