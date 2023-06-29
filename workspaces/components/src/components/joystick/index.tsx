import React, { useEffect, useState } from 'react'
import './index.scss'

import { TJoyStickProps } from '~/components/type'
import { createMovable, TPosition, } from '@imnull/movable'



export default (props: TJoyStickProps) => {
    const {
        width = 64,
        height = 64,
        left = 0,
        top = 0,
        debug = false,
        data = null,
        fill = false,
        onStart,
        onMoving,
        onEnd,
    } = props

    const [ref, setRef] = useState<HTMLElement | null>(null)
    const [m] = useState(createMovable({
        debug,
        onStart() {
            typeof onStart === 'function' && onStart({ movable: m })
        },
        onMoving(args) {
            typeof onMoving === 'function' && onMoving({ ...args, movable: m })
        },
        onEnd(args) {
            typeof onEnd === 'function' && onEnd({ ...args, movable: m })
        },
    }))

    useEffect(() => {
        m.update({ x: left, y: top })
    }, [left, top])

    useEffect(() => {
        m.snap(data)
    }, [data])

    useEffect(() => {
        if (ref) {
            m.init(ref)
            m.update({ x: left, y: top })
            return () => {
                m.dispose()
            }
        }
    }, [ref])

    return <div className={'-make-react-comp-joystick-' + (debug ? ' -debug-' : '')} style={
        fill ? { left: 0, top: 0, right: 0, bottom: 0, position: 'absolute' } : { width, height }} ref={setRef}></div>
}