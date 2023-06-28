import { useEffect, useState } from 'react'
import './index.scss'
import { TMovable, createMovable } from '~/libs/movable'

export default () => {
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [position, setPosition] = useState({ x: 110, y: 0 })
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [movable] = useState<TMovable>(createMovable({
        onMoving({ offset }) {
            setOffset(offset)
        },
        onEnd({ position }) {
            setPosition(position)
            setOffset({ x: 0, y: 0 })
        }
    }))

    useEffect(() => {
        movable.update(position)
    }, [position])

    useEffect(() => {
        if(target) {
            movable.init(target)
        }
        return () => {
            movable.dispose()
        }
    }, [target])

    return <>
        <h1>Playgound</h1>
        <div className='block' ref={setTarget} style={{ transform: `translateX(${position.x + offset.x}px) translateY(${position.y + offset.y}px)` }}>block</div>
    </>
}