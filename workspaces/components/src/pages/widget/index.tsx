import { useEffect, useState } from 'react'
import './index.scss'
import { TMovable, createMovable } from '@imnull/movable'
import { Widget } from '~/components'

export default () => {

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const [ox, setOX] = useState(0)
    const [oy, setOY] = useState(0)

    const [shadow, setShadow] = useState(false)

    return <>
        <Widget debug={false} left={120} top={130} />
    </>
}