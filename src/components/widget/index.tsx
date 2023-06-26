import { useCallback, useEffect, useState } from 'react'
import './index.scss'
import { createMovable } from '~/libs/movable'

type TPosition = { x: number; y: number }
type TSize = { width: number; height: number; }
type TEventArgs = { position: TPosition; data: any }
type TResizeType = '' | 'L' | 'T' | 'R' | 'B' | 'LT' | 'RT' | 'LB' | 'RB'

const posPlus = (a: TPosition, b: TPosition) => {
    return { x: a.x + b.x, y: a.y + b.y }
}

const genTranslate = (position: TPosition, offset: TPosition, size: TSize, sizeOffset: TPosition, resizeType: TResizeType) => {
    let { x, y } = posPlus(position, offset)
    let { width: w, height: h } = size

    if (resizeType.includes('L')) {
        w -= sizeOffset.x
        if (w >= 0) {
            x += sizeOffset.x
        } else {
            x += size.width
        }
    }
    if (resizeType.includes('R')) {
        w += sizeOffset.x
        if (w < 0) {
            x += w
        }
    }
    if (resizeType.includes('T')) {
        h -= sizeOffset.y
        if (h >= 0) {
            y += sizeOffset.y
        } else {
            y += size.height
        }
    }
    if (resizeType.includes('B')) {
        h += sizeOffset.y
        if (h < 0) {
            y += h
        }
    }
    return `translateX(${x}px) translateY(${y}px)`
}

const genWidth = (size: TSize, sizeOffset: TPosition, resizeType: TResizeType) => {
    if (resizeType.includes('L')) {
        return Math.abs(size.width - sizeOffset.x)
    } else if (resizeType.includes('R')) {
        return Math.abs(size.width + sizeOffset.x)
    } else {
        return size.width
    }
}

const genHeight = (size: TSize, sizeOffset: TPosition, resizeType: TResizeType) => {
    if (resizeType.includes('T')) {
        return Math.abs(size.height - sizeOffset.y)
    } else if (resizeType.includes('B')) {
        return Math.abs(size.height + sizeOffset.y)
    } else {
        return size.height
    }
}

const calRect = (size: TSize, pos: TPosition, offset: TPosition, resizeType: TResizeType) => {
    let x = pos.x
    let y = pos.y
    let width = size.width
    let height = size.height

    if (resizeType.includes('L')) {
        width -= offset.x
        if (width > 0) {
            x += offset.x
        } else {
            x += size.width
        }
    }
    if (resizeType.includes('R')) {
        width += offset.x
        if (width < 0) {
            x += width
        }
    }
    if (resizeType.includes('T')) {
        height -= offset.y
        if (height > 0) {
            y += offset.y
        } else {
            y += size.height
        }
    }
    if (resizeType.includes('B')) {
        height += offset.y
        if (height < 0) {
            y += height
        }
    }
    return { x, y, width: Math.abs(width), height: Math.abs(height) }
}

const createResizeHandler = (options: {
    debug?: boolean;
    target: HTMLElement;
    resizeType: TResizeType;
    size: TSize;
    position: TPosition;
    setResizeType: (type: TResizeType) => void;
    setSizeOffset: (offset: TPosition) => void;
    setPos: (pos: TPosition) => void;
    setSize: (pos: TSize) => void;
}) => {
    const { target, resizeType, size, position, setResizeType, setSizeOffset, setPos, setSize, debug = false } = options
    const m = createMovable({
        debug,
        onStart() {
            setResizeType(resizeType)
        },
        onMoving({ offset }) {
            setSizeOffset(offset)
        },
        onEnd: ({ offset }: any) => {
            setSizeOffset({ x: 0, y: 0 })
            const { x, y, width, height } = calRect(size, position, offset, resizeType)
            setPos({ x, y })
            setSize({ width, height })
        }
    })
    m.init(target)

    return () => {
        m.dispose()
    }
}

export default (props: {
    children?: JSX.Element,
    data?: any;
    position?: TPosition;
    size?: TSize,
    debug?: boolean,
    title?: string;
    zIndex?: number;
    onClose?: (args: TEventArgs) => void;
    onMoveStart?: (args: TEventArgs) => void;
    onMoveEnd?: (args: TEventArgs) => void;
    onMoving?: (args: TEventArgs) => void;
    onMinify?: (min: boolean) => void;
}) => {
    const {
        title = 'Untitled',
        zIndex = 0,
        children,
        position: _position = { x: 0, y: 0 },
        size: _size = { width: 240, height: 240 },
        data = null,
        debug = false,
        onClose,
        onMoveStart,
        onMoveEnd,
        onMoving,
        onMinify,
    } = props

    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [pos, setPos] = useState(_position)
    useEffect(() => {
        if (target) {
            setHeadHeight(target.getBoundingClientRect().height)
            const m = createMovable({
                debug,
                onStart() {
                    setResizeType('')
                    setStart(true)
                },
                onMoving({ offset }) {
                    setOffset(offset)
                },
                onEnd({ position }) {
                    setStart(false)
                    setPos(position)
                    setOffset({ x: 0, y: 0 })
                }
            })
            m.update({ ...pos })
            m.init(target)
            return () => {
                m.dispose()
            }
        }
    }, [target, pos])

    useEffect(() => {
        setPos({ ..._position })
    }, [_position])


    const [tools, setTools] = useState<HTMLElement | null>(null)
    const [min, setMin] = useState(false)
    const [headHeight, setHeadHeight] = useState(0)

    const [start, setStart] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [size, setSize] = useState(_size)
    const [sizeOffset, setSizeOffset] = useState({ x: 0, y: 0 })
    const [resizeType, setResizeType] = useState<'' | 'L' | 'T' | 'R' | 'B' | 'LT' | 'RT' | 'LB' | 'RB'>('')

    /** 事件 */

    useEffect(() => {
        if (start && typeof onMoving === 'function') {
            onMoving({
                position: {
                    x: pos.x + offset.x,
                    y: pos.y + offset.y,
                },
                data
            })
        }
    }, [pos, offset, start, data])

    useEffect(() => {
        const args = { position: { ...pos }, data }
        const method = start ? onMoveStart : onMoveEnd
        typeof method === 'function' && method(args)
    }, [pos, start, data])
    useEffect(() => {
        typeof onMinify === 'function' && onMinify(min)
    }, [min])

    useEffect(() => {
        if (!tools) {
            return
        }
        const mousedown = (e: MouseEvent) => {
            e.stopPropagation()
        }
        tools.addEventListener('mousedown', mousedown)
        return () => {
            tools.removeEventListener('mousedown', mousedown)
        }
    }, [tools])

    const handleClose = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        typeof onClose === 'function' && onClose({ position: { ...pos }, data })
    }, [data, pos])

    const handleMin = () => {
        setMin(!min)
    }

    /** 事件 END */

    const [barL, setBarL] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (barL) {
            const dispose = createResizeHandler({
                debug,
                target: barL,
                resizeType: 'L',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [barL, size, pos])
    const [barR, setBarR] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (barR) {
            const dispose = createResizeHandler({
                debug,
                target: barR,
                resizeType: 'R',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [barR, size, pos])
    const [barT, setBarT] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (barT) {
            const dispose = createResizeHandler({
                debug,
                target: barT,
                resizeType: 'T',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [barT, size, pos])
    const [barB, setBarB] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (barB) {
            const dispose = createResizeHandler({
                debug,
                target: barB,
                resizeType: 'B',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [barB, size, pos])

    const [cornerLT, setCornerLT] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (cornerLT) {
            const dispose = createResizeHandler({
                debug,
                target: cornerLT,
                resizeType: 'LT',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [cornerLT, size, pos])
    const [cornerRT, setCornerRT] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (cornerRT) {
            const dispose = createResizeHandler({
                debug,
                target: cornerRT,
                resizeType: 'RT',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [cornerRT, size, pos])
    const [cornerLB, setCornerLB] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (cornerLB) {
            const dispose = createResizeHandler({
                debug,
                target: cornerLB,
                resizeType: 'LB',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [cornerLB, size, pos])
    const [cornerRB, setCornerRB] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (cornerRB) {
            const dispose = createResizeHandler({
                debug,
                target: cornerRB,
                resizeType: 'RB',
                size,
                position: pos,
                setResizeType,
                setSizeOffset,
                setPos,
                setSize
            })
            return () => {
                dispose()
            }
        }
    }, [cornerRB, size, pos])

    return <div className="marvin-widget" style={{
        zIndex,
        transform: genTranslate(pos, offset, size, sizeOffset, resizeType),
        width: genWidth(size, sizeOffset, resizeType),
        height: min ? headHeight : genHeight(size, sizeOffset, resizeType),
    }}>
        <div className="widget-head" ref={setTarget}>
            <div className='title'>{title}</div>
            <div className='tools' ref={setTools}>
                <div className='btn minify' onClick={handleMin}></div>
                <div className='btn close' onClick={handleClose}></div>
            </div>
        </div>
        <div className="widget-body">{children}</div>
        {min ? null : <div className="widget-resize">
            <div className={debug ? "bar debug left" : "bar left"} ref={setBarL}></div>
            <div className={debug ? "bar debug right" : "bar right"} ref={setBarR}></div>
            <div className={debug ? "bar debug top" : "bar top"} ref={setBarT}></div>
            <div className={debug ? "bar debug bottom" : "bar bottom"} ref={setBarB}></div>
            <div className={debug ? "corner debug lt" : "corner lt"} ref={setCornerLT}></div>
            <div className={debug ? "corner debug rt" : "corner rt"} ref={setCornerRT}></div>
            <div className={debug ? "corner debug lb" : "corner lb"} ref={setCornerLB}></div>
            <div className={debug ? "corner debug rb" : "corner rb"} ref={setCornerRB}></div>
        </div>}
    </div >
}