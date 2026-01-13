'use client'

import { useEffect, useState } from 'react'
import { createTLStore, defaultShapeUtils, transacted } from '@tldraw/tldraw'
import * as Y from 'yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { useRoom } from '@liveblocks/react/suspense'

export function useYjsStore({
    shapeUtils = [],
} = {}) {
    const room = useRoom()
    const [store] = useState(() =>
        createTLStore({
            shapeUtils: [...defaultShapeUtils, ...shapeUtils],
        })
    )
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const yDoc = new Y.Doc()
        const provider = new LiveblocksYjsProvider(room, yDoc)
        const yMap = yDoc.getMap('tl_whiteboard')

        // Sync validation
        let isTransactionLocal = false

        // 1. Listen for Yjs updates -> Update Tldraw Store
        yMap.observeDeep((events) => {
            if (isTransactionLocal) return

            const changes = {
                added: {},
                updated: {},
                removed: {},
            }

            events.forEach((event) => {
                event.keys.forEach((change, key) => {
                    if (change.action === 'add' || change.action === 'update') {
                        const record = yMap.get(key)
                        changes.updated[key] = record
                    } else if (change.action === 'delete') {
                        changes.removed[key] = { id: key }
                    }
                })
            })

            // Apply changes to store without triggering listener
            store.mergeRemoteChanges(() => {
                store.put(Object.values(changes.updated))
                store.remove(Object.values(changes.removed).map((r) => r.id))
            })
        })

        // 2. Listen for Tldraw Store updates -> Update Yjs
        const cleanupStore = store.listen(
            (event) => {
                isTransactionLocal = true
                yDoc.transact(() => {
                    const { changes } = event

                    // Added
                    Object.values(changes.added).forEach((record) => {
                        yMap.set(record.id, record)
                    })

                    // Updated
                    Object.values(changes.updated).forEach(([_prev, record]) => {
                        yMap.set(record.id, record)
                    })

                    // Removed
                    Object.values(changes.removed).forEach((record) => {
                        yMap.delete(record.id)
                    })
                })
                isTransactionLocal = false
            },
            { source: 'user', scope: 'document' } // Only sync user changes
        )

        // Handle connection status
        const handleSync = (isSynced) => {
            if (isSynced) {
                // Initialize store from Yjs data
                const records = Array.from(yMap.values())
                if (records.length > 0) {
                    store.mergeRemoteChanges(() => {
                        store.put(records)
                    })
                }
                setInitialized(true)
            }
        }

        // Wait for sync
        const unsub = room.subscribe('status', (status) => {
            if (status === 'connected') handleSync(true)
        })

        // Also check current status
        if (room.getStatus() === 'connected') handleSync(true)


        return () => {
            cleanupStore()
            provider.destroy()
            yDoc.destroy()
            unsub()
        }
    }, [room, store])

    return initialized ? store : null
}
