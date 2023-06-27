import { useEffect, useState } from 'react'
import './index.scss'

import Widget from '~/components/widget'

export default () => {

    const handleCloseWidget = (data: any) => {
        console.log('handleCloseWidget', data)
    }

    const [widgets, setWidgets] = useState([
        { title: 'Window1', position: { x: 10, y: 10 }, size: { width: 400, height: 200 }, data: 123, },
        { title: 'Window2', position: { x: 160, y: 260 }, size: { width: 300, height: 100 }, data: 234, },
        { title: 'Window3', position: { x: 560, y: 110 }, size: { width: 200, height: 300 }, data: 345, },
    ])

    const [selected, setSelected] = useState(widgets.length - 1)

    return <>
        <h1>Widget</h1>
        {
            widgets.map(({ title, position, size, data }, i) => {
                return <Widget
                    key={i}
                    debug={false}
                    active={i === selected}
                    title={title}
                    position={position}
                    size={size}
                    data={data}
                    onClose={handleCloseWidget}
                    onSelected={() => setSelected(i)}
                    onResize={size => console.log(`widget ${i} size:`, size)}
                >
                    <h3 style={{ textAlign: 'center' }}>{data}</h3>
                </Widget>
            })
        }
        {/* <Widget title='zIndex=10' zIndex={10} position={{ x: 10, y: 10 }} data={111} onClose={handleCloseWidget} onMoveEnd={e => console.log(e.position)} />
        <Widget title='中文试试' position={{ x: 20, y: 70 }} data={222} onClose={handleCloseWidget} onMoving={e => console.log(e.position)} />
        <Widget debug={false} position={{ x: 130, y: 130 }} data={333} onClose={handleCloseWidget} onMoveStart={e => console.log(e.position)} /> */}
    </>
}