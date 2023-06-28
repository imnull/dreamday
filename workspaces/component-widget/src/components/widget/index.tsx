import { useCallback, useEffect, isValidElement, useState, createElement } from 'react'
import './index.scss'
import { createMovable } from '@imnull/movable'
import {
    TPosition, TSize, TEventArgs,
    genTranslate,
    createResizeHandler,
    genWidth,
    genHeight,
    TResizeType,
    gridValue,
    positionEqual,
    sizeEqual,
} from './helper'

const cloneChildren = (children: any, extProps: Record<string, any>, key: any = null): any => {
    if (Array.isArray(children)) {
        return children.map((children: any, key: number) => cloneChildren(children, extProps, key))
    } else if (isValidElement(children)) {
        const { props, type } = children
        const { ...restProps } = props as any
        const newChildren = createElement(type, { ...restProps, ...extProps, key })
        return newChildren
    } else {
        return children
    }
}

export default (props: {
    children?: any;
    data?: any;
    position?: TPosition;
    size?: TSize;
    debug?: boolean;
    active?: boolean;
    title?: string;
    useRuntime?: boolean;
    grid?: number;
    locked?: boolean;
    onSelected?: () => void;
    onClose?: (args: TEventArgs) => void;
    onMoveStart?: (args: TEventArgs) => void;
    onMoveEnd?: (args: TEventArgs) => void;
    onMoving?: (args: TEventArgs) => void;
    onMinify?: (min: boolean) => void;
    onResizing?: (size: TSize) => void;
    onResized?: (size: TSize) => void;
    onChange?: (rect: TSize & TPosition) => void;
    checking?: (rect: TPosition & TSize) => boolean;
}) => {
    const {
        title = 'Untitled',
        children,
        position: _position = { x: 0, y: 0 },
        size: _size = { width: 240, height: 240 },
        data = null,
        debug = false,
        active = false,
        useRuntime = false,
        grid = 1,
        locked = false,
        onClose,
        onMoveStart,
        onMoveEnd,
        onMoving,
        onMinify,
        onSelected,
        onResizing,
        onResized,
        onChange,
        checking
    } = props

    const [start, setStart] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [min, setMin] = useState(false)
    const [headHeight, setHeadHeight] = useState(0)

    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [tools, setTools] = useState<HTMLElement | null>(null)

    const _pos = { x: gridValue(grid, _position.x), y: gridValue(grid, _position.y) }
    const [pos, setPos] = useState(_pos)
    const [runtimePosition, setRuntimePosition] = useState({ x: gridValue(grid, _position.x), y: gridValue(grid, _position.y) })

    const _siz = { width: gridValue(grid, _size.width), height: gridValue(grid, _size.height) }
    const [size, setSize] = useState(_siz)
    const [runtimeSize, setRuntimeSize] = useState({ width: gridValue(grid, _size.width), height: gridValue(grid, _size.height) })
    const [sizeOffset, setSizeOffset] = useState({ x: 0, y: 0 })
    const [resizeType, setResizeType] = useState<TResizeType>('')

    const [move] = useState(createMovable<TSize>({
        debug,
        grid,
        snap: size,
        onStart() {
            setResizeType('')
            setStart(true)
            _onSelected()
        },
        onMoving({ offset }) {
            setOffset(offset)
        },
        onEnd({ position }) {
            setStart(false)
            setEditing(false)
            setOffset({ x: 0, y: 0 })
            if (typeof checking !== 'function' || checking({ ...position, ...move.getSnap() })) {
                setPos(position)
            }
        }
    }))
    useEffect(() => {
        if (target) {
            const { height } = target.getBoundingClientRect()
            setHeadHeight(height >> 0)
            move.init(target)
            return () => {
                move.dispose()
            }
        }
    }, [target])

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
            _onSelected()
        }
        const mouseup = (e: MouseEvent) => {
            e.stopPropagation()
            setEditing(false)
        }
        tools.addEventListener('mousedown', mousedown)
        tools.addEventListener('mouseup', mouseup)
        return () => {
            tools.removeEventListener('mousedown', mousedown)
            tools.removeEventListener('mouseup', mouseup)
        }
    }, [tools])

    const handleClose = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        typeof onClose === 'function' && onClose({ position: { ...pos }, data })
    }, [data, pos])

    const handleMin = () => {
        setMin(!min)
    }

    const handleMaxium = () => {

    }

    /** 事件 END */

    const [editing, setEditing] = useState(false)
    const _onSelected = () => {
        setEditing(true)
        typeof onSelected === 'function' && onSelected()
    }

    const createResizeParams = (resizeType: TResizeType) => {
        return {
            debug,
            grid,
            checking,
            editing: [editing, setEditing],
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: [resizeType, setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected: _onSelected,
            useRuntime,
            onResized,
        }
    }

    const createResizeEffect = (element: HTMLElement | null, m: ReturnType<typeof createResizeHandler>) => {
        return () => {
            if (element) {
                m.init(element)
                return () => {
                    m.dispose()
                }
            }
        }
    }

    const [barL, setBarL] = useState<HTMLElement | null>(null)
    const [mL] = useState(createResizeHandler(createResizeParams('L') as any))
    useEffect(createResizeEffect(barL, mL), [barL])

    const [barR, setBarR] = useState<HTMLElement | null>(null)
    const [mR] = useState(createResizeHandler(createResizeParams('R') as any))
    useEffect(createResizeEffect(barR, mR), [barR])

    const [barT, setBarT] = useState<HTMLElement | null>(null)
    const [mT] = useState(createResizeHandler(createResizeParams('T') as any))
    useEffect(createResizeEffect(barT, mT), [barT])

    const [barB, setBarB] = useState<HTMLElement | null>(null)
    const [mB] = useState(createResizeHandler(createResizeParams('B') as any))
    useEffect(createResizeEffect(barB, mB), [barB])

    const [cornerLT, setCornerLT] = useState<HTMLElement | null>(null)
    const [mLT] = useState(createResizeHandler(createResizeParams('LT') as any))
    useEffect(createResizeEffect(cornerLT, mLT), [cornerLT])

    const [cornerRT, setCornerRT] = useState<HTMLElement | null>(null)
    const [mRT] = useState(createResizeHandler(createResizeParams('RT') as any))
    useEffect(createResizeEffect(cornerRT, mRT), [cornerRT])

    const [cornerLB, setCornerLB] = useState<HTMLElement | null>(null)
    const [mLB] = useState(createResizeHandler(createResizeParams('LB') as any))
    useEffect(createResizeEffect(cornerLB, mLB), [cornerLB])

    const [cornerRB, setCornerRB] = useState<HTMLElement | null>(null)
    const [mRB] = useState(createResizeHandler(createResizeParams('RB') as any))
    useEffect(createResizeEffect(cornerRB, mRB), [cornerRB])

    useEffect(() => {
        [mL, mR, mT, mB, mLT, mRT, mLB, mRB].forEach(m => m.updatePosition(pos))
        move.update(pos)
    }, [pos])
    useEffect(() => {
        [mL, mR, mT, mB, mLT, mRT, mLB, mRB].forEach(m => m.updateSize(size))
        move.snap(size)
    }, [size])

    useEffect(() => {
        if(!positionEqual(_pos, pos) || !sizeEqual(_siz, size)) {
            console.log(1111)
            typeof onChange === 'function' && onChange({ ...pos, ...size })
        }
    }, [pos, size])

    useEffect(() => {
        typeof onResizing === 'function' && onResizing({ ...runtimeSize })
    }, [runtimeSize, headHeight])

    const [_children, setChildren] = useState<any>(null)
    useEffect(() => {
        const newChildren = cloneChildren(children, {
            size: { ...runtimeSize },
        })
        setChildren(newChildren)
    }, [children, runtimeSize, headHeight])

    const [showTitle, setShowTitle] = useState(false)

    return <div className={active && !locked ? "marvin-widget" : "marvin-widget background"} style={{
        transform: genTranslate(pos, offset, size, sizeOffset, resizeType),
        width: genWidth(size, sizeOffset, resizeType),
        height: min ? headHeight : genHeight(size, sizeOffset, resizeType),
        transition: editing || locked ? '' : 'all 0.2s',
    }} onMouseDown={e => {
        _onSelected()
    }} onMouseUp={() => {
        setEditing(false)
    }} onMouseEnter={() => {
        setShowTitle(true)
    }} onMouseLeave={() => {
        setShowTitle(false)
    }}>
        {locked ? null : <div className="widget-head" ref={setTarget} style={{ opacity: showTitle || editing ? 1 : 0 }}>
            <div className='title'>{title}</div>
            <div className='tools' ref={setTools}>
                <div className='btn maxium' onClick={handleMaxium}></div>
                <div className='btn minify' onClick={handleMin}></div>
                <div className='btn close' onClick={handleClose}></div>
            </div>
        </div>}
        <div className="widget-body">{_children}</div>
        {min || locked ? null : <div className={(locked ? "widget-resize" : "widget-resize editing") + (active ? ' active' : '')}>
            <div className={debug ? "bar debug left" : "bar left"} ref={setBarL}></div>
            <div className={debug ? "bar debug right" : "bar right"} ref={setBarR}></div>
            <div className={debug ? "bar debug top" : "bar top"} ref={setBarT}></div>
            <div className={debug ? "bar debug bottom" : "bar bottom"} ref={setBarB}></div>
            <div className={debug ? "corner debug lt" : "corner lt"} ref={setCornerLT}></div>
            <div className={debug ? "corner debug rt" : "corner rt"} ref={setCornerRT}></div>
            <div className={debug ? "corner debug lb" : "corner lb"} ref={setCornerLB}></div>
            <div className={debug ? "corner debug rb" : "corner rb"} ref={setCornerRB}></div>
        </div>
        }
    </div >
}