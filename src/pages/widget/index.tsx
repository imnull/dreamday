import { useEffect, useState } from 'react'
import './index.scss'

import Widget from '~/components/widget'

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

export default () => {

    const handleCloseWidget = (data: any) => {
        console.log('handleCloseWidget', data)
    }

    const [widgets, setWidgets] = useState([
        { title: 'Window1', position: { x: 10, y: 10 }, size: { width: 400, height: 200 }, data: 123, },
        { title: 'Window2', position: { x: 160, y: 260 }, size: { width: 300, height: 300 }, data: 234, },
        { title: 'Window3', position: { x: 560, y: 110 }, size: { width: 300, height: 300 }, data: 345, },
    ])

    const [dashboard, setDashboard] = useState<HTMLElement | null>(null)

    const [selected, setSelected] = useState(widgets.length - 1)
    const [debug, setDebug] = useState(false)
    const [locked, setLocked] = useState(false)
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

    useEffect(() => {
        console.log(JSON.stringify(widgets))
    }, [widgets])

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
        </div>
        <div className='widget-page-dashboard-bg'>
            <div className='widget-page-dashboard' ref={setDashboard}>
                {
                    widgets.map(({ title, position, size, data }, i) => {
                        return <Widget
                            key={i}
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
                                const item = { ...w[i], position: { x: rect.x, y: rect.y }, size: { width: rect.width, height: rect.height } }
                                w.splice(i, 1, item)
                                setWidgets(w)
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