'use client'

import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import { useYjsStore } from '@/hooks/useYjsStore'
import Loader from './Loader'

function WhiteboardInner() {
    const store = useYjsStore()

    if (!store) {
        return <Loader />
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
                <ClientSideSuspense fallback={<Loader />}>
                    {() => <WhiteboardInner />}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
