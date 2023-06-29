import { useEffect, useState } from 'react'
import './index.scss'
import { TMovable, createMovable } from '@imnull/movable'
import { Widget } from '~/components'

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

    return <>
        <Widget
            title='Widget-01'
            debug={false}
            left={120}
            top={130}
            width={400}
            height={300}
            minWidth={360}
            minHeight={300}
            padding={3}
            normalClass='widget-normal'
            active activeClass='widget-active'
        >
            <TestItem />
        </Widget>
    </>
}