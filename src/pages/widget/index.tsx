import { useEffect, useState } from 'react'
import './index.scss'

import Widget from '~/components/widget'
import UndoRedo from '~/libs/undo-redo'

const TestItem = (props: { size?: { width: number; height: number } }) => {
    const { size = { width: 0, height: 0 } } = props
    const [count, setCount] = useState(0)
    return <div style={{
        ...size,
        position: 'absolute',
        left: 0,
        top: 0,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff',
        fontSize: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <div>{JSON.stringify(size)}</div>
        <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
}

const equalWidgetRect = (a: any, b: any) => {
    return (
        a.position.x === b.position.x
        && a.position.y === b.position.y
        && a.size.width === b.size.width
        && a.size.height === b.size.height
    )
}

export default () => {

    const handleCloseWidget = (data: any) => {
        console.log('handleCloseWidget', data)
    }

    const [widgets, setWidgets] = useState([
        { title: 'Window1', position: { x: 10, y: 10 }, size: { width: 400, height: 200 }, data: 123, _id: 0, },
        { title: 'Window2', position: { x: 160, y: 260 }, size: { width: 300, height: 300 }, data: 234, _id: 0, },
        { title: 'Window3', position: { x: 560, y: 110 }, size: { width: 300, height: 300 }, data: 345, _id: 0, },
    ])

    const [dashboard, setDashboard] = useState<HTMLElement | null>(null)

    const [selected, setSelected] = useState(widgets.length - 1)
    const [debug, setDebug] = useState(false)
    const [locked, setLocked] = useState(false)
    const [ur] = useState(new UndoRedo(JSON.stringify(widgets)))
    const [canRedo, setCanRedo] = useState(ur.canRedo())
    const [canUndo, setCanUndo] = useState(ur.canUndo())
    const grid = 100

    useEffect(() => {
        if (!dashboard) {
            return
        }
        const mousedown = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target === dashboard) {
                setSelected(-1)
                return
            }
            let p = target.parentElement
            while (p) {
                if (p === dashboard) {
                    return
                }
                p = p.parentElement
            }
            setSelected(-1)
        }
        document.addEventListener('mousedown', mousedown)
        return () => {
            document.removeEventListener('mousedown', mousedown)
        }
    }, [dashboard])


    return <>
        <div className='widget-page-head'>
            <h1>Widget</h1>
            <label className='checkbox'>
                <input type="checkbox" disabled={locked} checked={debug} onChange={(e) => {
                    setDebug(!debug)
                }} />
                <span>debug</span>
            </label>
            <label className='checkbox'>
                <input type="checkbox" checked={locked} onChange={(e) => {
                    setLocked(!locked)
                    setDebug(false)
                }} />
                <span>lock</span>
            </label>
            <button disabled={!canUndo} onClick={() => {
                ur.undo()
                const val = ur.getValue()
                const widgets = JSON.parse(val)
                setWidgets(widgets)
                setCanRedo(ur.canRedo())
                setCanUndo(ur.canUndo())
            }}>undo</button>
            <button disabled={!canRedo} onClick={() => {
                ur.redo()
                const val = ur.getValue()
                const widgets = JSON.parse(val)
                setWidgets(widgets)
                setCanRedo(ur.canRedo())
                setCanUndo(ur.canUndo())
            }}>redo</button>
        </div>
        <div className='widget-page-dashboard-bg'>
            <div className='widget-page-dashboard' ref={setDashboard}>
                {
                    widgets.map(({ title, position, size, data, _id }, i) => {
                        return <Widget
                            key={`_${i}_${_id}`}
                            debug={debug}
                            locked={locked}
                            active={i === selected}
                            title={title}
                            position={position}
                            size={size}
                            data={data}
                            onClose={handleCloseWidget}
                            onSelected={() => setSelected(i)}
                            useRuntime={i % 2 < 1}
                            grid={100}
                            checking={({ x, y, width, height }) => {
                                return (
                                    x >= 0
                                    && y >= 0
                                    && width >= grid * 2
                                    && height >= grid * 2
                                    && x + width <= window.innerWidth - 20
                                    && y + height <= window.innerHeight - 120
                                )
                            }}
                            onChange={rect => {
                                const w = [...widgets]
                                const oldItem = w[i]
                                const newRect = { position: { x: rect.x, y: rect.y }, size: { width: rect.width, height: rect.height } }
                                const item = { ...oldItem, ...newRect }
                                w.splice(i, 1, item as any)
                                setWidgets(w)
                                item._id += 1
                                const current = JSON.stringify(w)
                                if (ur.needUpdate(current)) {
                                    ur.update(current)
                                    setCanRedo(ur.canRedo())
                                    setCanUndo(ur.canUndo())
                                }
                            }}
                        >
                            <TestItem />
                        </Widget>
                    })
                }
            </div>
        </div>
    </>
}