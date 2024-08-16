import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

const Whiteboard = () => {
    return (
        <div style={{
            position: 'fixed', inset: 0, fontFamily: 'sans-serif' }}>
            <Tldraw persistenceKey='white-data' />
        </div>

    )
}

export default Whiteboard
