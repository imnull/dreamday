import { useEffect, useState } from 'react'
import './index.scss'
import { useMovable } from '@imnull/movable'

export default () => {
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (target) {
            const m = useMovable({
                update: setPos,
            })
            m.init(target)
            return () => {
                m.dispose()
            }
        }
    }, [target])

    return <>
        <h1>Playgound</h1>
        <div className='block' ref={setTarget} style={{ transform: `translateX(${pos.x}px) translateY(${pos.y}px)` }}>block</div>
    </>
}