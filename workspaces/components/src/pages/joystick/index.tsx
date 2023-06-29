import { useEffect, useState } from 'react'
import './index.scss'
import { TMovable, createMovable } from '@imnull/movable'
import { JoyStick } from '~/components'

export default () => {

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [ox, setOX] = useState(0)
    const [oy, setOY] = useState(0)

    const [shadow, setShadow] = useState(false)

    return <>
        <h1>Drag the box below</h1>
        <div>x:{x + ox}  y:{y + oy}</div>
        <div className={'stick-container' + (shadow ? ' shadow' : '')} style={{ transform: `translateX(${x + ox}px) translateY(${y + oy}px)` }}>
            <JoyStick
                debug={false}
                left={x}
                top={y}
                width={120}
                height={120}
                onStart={() => {
                    document.body.style.cursor = 'move'
                    setShadow(true)
                }}
                onMoving={({ position, offset: { x, y } }) => {
                    setOX(x)
                    setOY(y)
                }}
                onEnd={({ position: { x, y } }) => {
                    setX(x)
                    setY(y)
                    setOX(0)
                    setOY(0)
                    setShadow(false)
                    document.body.style.cursor = ''
                }}
            />
        </div>
    </>
}