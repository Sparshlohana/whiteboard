'use client'

import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import { useYjsStore } from '@/hooks/useYjsStore'

function WhiteboardInner() {
    const store = useYjsStore()

    if (!store) {
        return <div className="absolute inset-0 flex items-center justify-center">Loading...</div>
    }

    return (
        <div style={{ position: 'fixed', inset: 0 }}>
            <Tldraw store={store} />
        </div>
    )
}

export default function CollaborativeWhiteboard() {
    const roomId = "whiteboard-room-1" // Fixed room for demo

    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
            <RoomProvider id={roomId} initialPresence={{}}>
                <ClientSideSuspense fallback={<div>Loading room...</div>}>
                    {() => <WhiteboardInner />}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
