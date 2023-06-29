import { TRectParams, TJoyStickProps, TResizeType, TSize, TMoveEventArgs } from '~/components/type'
import './index.scss'

import { JoyStick } from '~/components'
import { CSSProperties, useEffect, useState } from 'react'
import { TPosition } from '@imnull/movable'

const getCursor = (type: TResizeType) => {
    switch (type) {
        case 'LT':
        case 'RB':
            return 'nwse-resize'
        case 'LB':
        case 'RT':
            return 'nesw-resize'
        case 'R':
        case 'L':
            return 'ew-resize'
        case 'T':
        case 'B':
            return 'ns-resize'
    }
    return 'default'
}

const calRect = (type: TResizeType, size: number, corner: number) => {
    switch (type) {
        case 'R':
            return { top: corner, right: 0, bottom: corner, width: size, zIndex: 3 }
        case 'B':
            return { left: corner, right: corner, bottom: 0, height: size, zIndex: 3 }
        case 'L':
            return { left: 0, top: corner, bottom: corner, width: size, zIndex: 3 }
        case 'T':
            return { left: corner, right: corner, top: 0, height: size, zIndex: 3 }
        case 'LT':
            return { left: 0, top: 0, width: corner, height: corner, zIndex: 6 }
        case 'RT':
            return { right: 0, top: 0, width: corner, height: corner, zIndex: 6 }
        case 'RB':
            return { right: 0, bottom: 0, width: corner, height: corner, zIndex: 6 }
        case 'LB':
            return { left: 0, bottom: 0, width: corner, height: corner, zIndex: 6 }
    }
    return {}
}

type TCalResult = TSize & TPosition & { left: number; top: number; ox: number; oy: number; ow: number; oh: number; w: number; h: number; }

type TCalRes = { x: number; y: number; w: number; h: number; }

const calOffset = (type: TResizeType, pos: TPosition, box: TSize, min: TSize, max: TSize, offset: TPosition) => {
    const minX = min.width - box.width
    const minY = min.height - box.height
    let x = 0, y = 0, ox = 0, oy = 0, w = 0, h = 0, ow = 0, oh = 0

    if (type.includes('L')) {
        x = Math.max(minX, -offset.x)
        ox = -x
    }
    if (type.includes('R')) {
        x = Math.max(minX, offset.x)
    }
    if (type.includes('T')) {
        y = Math.max(minY, -offset.y)
        oy = -y
    }
    if (type.includes('B')) {
        y = Math.max(minY, offset.y)
    }

    w = box.width + x
    h = box.height + y
    ow = box.width + x
    oh = box.height + y
    return {
        x, y, ox, oy,
        w, h, ow, oh,
        width: box.width + x, height: box.height + y,
        left: pos.x + ox, top: pos.y + oy,
    } as TCalResult
}

type TData = {
    pos: TPosition,
    box: TSize;
    min: TSize;
    max: TSize;
}

const ResizeHandler = (props: {
    debug?: boolean;
    size: number;
    corner: number;
    boxLeft: number;
    boxTop: number;
    boxWidth: number;
    boxHeight: number;
    boxMinWidth: number;
    boxMinHeight: number;
    boxMaxWidth: number;
    boxMaxHeight: number;
    type: TResizeType;
    onResize: (offsetSize: TCalRes) => void;
    onEnd: (offsetSize: TCalRes) => void;
}) => {
    const {
        size,
        corner,
        debug = false,
        type,
        boxLeft, boxTop,
        boxWidth, boxHeight,
        boxMinWidth, boxMinHeight,
        boxMaxWidth, boxMaxHeight,
        onResize, onEnd,
    } = props
    const cursor = getCursor(type)
    const oldCursor = document.body.style.cursor

    return <div className={`-make-react-comp-resizebox-handler- -${type}-`} style={{
        cursor,
        ...calRect(type, size, corner)
    }}>
        <JoyStick
            debug={debug}
            fill={true}
            width={size}
            height={size}
            data={{
                pos: { x: boxLeft, y: boxTop },
                box: { width: boxWidth, height: boxHeight },
                min: { width: boxMinWidth, height: boxMinHeight },
                max: { width: boxMaxWidth, height: boxMaxHeight }
            }}
            onStart={() => {
                document.body.style.cursor = cursor
            }}
            onMoving={({ offset, movable }) => {
                const { pos, box, min, max } = movable.getSnap() as TData
                const { x, y, ox, oy } = calOffset(type, pos, box, min, max, offset)
                onResize({ x: ox, y: oy, w: x, h: y, })
            }}
            onEnd={({ offset, movable }) => {
                document.body.style.cursor = oldCursor
                const { pos, box, min, max } = movable.getSnap() as TData
                const { width, height, left, top } = calOffset(type, pos, box, min, max, offset)
                onEnd({ w: width, h: height, y: top, x: left })
                // onEnd({ width, height, left, top, ox, oy, w, h, ow, oh, y: top, x: left })
            }}
        />
    </div>
}

const calPadding = (padding?: number | number[]): CSSProperties => {
    if (Array.isArray(padding)) {
        const [top = 0, right = top, bottom = top, left = right] = padding
        return { top, right, bottom, left }
    } else if (typeof padding !== 'number' || isNaN(padding)) {
        return calPadding([0])
    } else {
        return calPadding([padding])
    }
}

export default (props: TRectParams & {
    debug?: boolean,
    stickSize?: number;
    cornerSize?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    padding?: number | number[];
    normalClass?: string;
    active?: boolean;
    activeClass?: string;
}) => {
    const {
        debug = false,
        left = 0,
        top = 0,
        width = 240,
        height = 180,
        minWidth = 48,
        minHeight = 48,
        maxWidth = -1,
        maxHeight = -1,
        stickSize = 4,
        cornerSize = 10,
        padding = 0,
        active,
        activeClass,
        normalClass,
    } = props

    const [x, setX] = useState(left)
    const [y, setY] = useState(top)
    const [w, setW] = useState(width)
    const [h, setH] = useState(height)

    const [ox, setOX] = useState(0)
    const [oy, setOY] = useState(0)
    const [ow, setOW] = useState(0)
    const [oh, setOH] = useState(0)

    useEffect(() => {
    }, [ox, oy])

    useEffect(() => {
    }, [x, y])

    useEffect(() => {
        // console.log(w, h)
    }, [w, h])

    const itemProps = {
        debug,
        size: stickSize,
        corner: cornerSize,
        boxLeft: x,
        boxTop: y,
        boxWidth: w,
        boxHeight: h,
        boxMinWidth: minWidth,
        boxMinHeight: minHeight,
        boxMaxWidth: maxWidth,
        boxMaxHeight: maxHeight,
    }

    return <div className={'-make-react-comp-resizebox-' + (debug ? ' debug' : '')} style={{
        width: w + ow,
        height: h + oh,
        transform: `translateX(${x + ox}px) translateY(${y + oy}px)`,
    }}>
        <div className={'-widget-container-' + (normalClass ? ` ${normalClass}` : '') + (active ? ` ${activeClass || ''}` : '')} style={calPadding(padding)}>
            <div className='-widget-head-'>
                <JoyStick
                    debug={debug}
                    fill
                    left={x}
                    top={y}
                    onMoving={({ offset }) => {
                        setOX(offset.x)
                        setOY(offset.y)
                    }}
                    onEnd={({ position }) => {
                        setX(position.x)
                        setY(position.y)
                        setOX(0)
                        setOY(0)
                    }}
                />
            </div>
            <div className='-resize-container-'>
                <ResizeHandler {...itemProps}
                    type={'T'}
                    onResize={rect => {
                        setOY(rect.y)
                        setOH(rect.h)
                    }}
                    onEnd={rect => {
                        setY(rect.y)
                        setH(rect.h)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
                <ResizeHandler {...itemProps}
                    type={'R'}
                    onResize={size => {
                        setOW(size.w)
                    }}
                    onEnd={size => {
                        setW(size.w)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
                <ResizeHandler {...itemProps}
                    type={'B'}
                    onResize={size => {
                        setOH(size.h)
                    }}
                    onEnd={size => {
                        setH(size.h)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
                <ResizeHandler {...itemProps}
                    type={'L'}
                    onResize={rect => {
                        setOX(rect.x)
                        setOW(rect.w)
                    }}
                    onEnd={rect => {
                        setX(rect.x)
                        setW(rect.w)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />

                <ResizeHandler {...itemProps}
                    type={'LT'}
                    onResize={rect => {
                        setOX(rect.x)
                        setOY(rect.y)
                        setOW(rect.w)
                        setOH(rect.h)
                    }}
                    onEnd={rect => {
                        setX(rect.x)
                        setY(rect.y)
                        setW(rect.w)
                        setH(rect.h)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
                <ResizeHandler {...itemProps}
                    type={'RT'}
                    onResize={rect => {
                        setOY(rect.y)
                        setOW(rect.w)
                        setOH(rect.h)
                    }}
                    onEnd={rect => {
                        setY(rect.y)
                        setW(rect.w)
                        setH(rect.h)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
                <ResizeHandler {...itemProps}
                    type={'RB'}
                    onResize={size => {
                        setOW(size.w)
                        setOH(size.h)
                    }}
                    onEnd={size => {
                        setW(size.w)
                        setH(size.h)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
                <ResizeHandler {...itemProps}
                    type={'LB'}
                    onResize={rect => {
                        setOX(rect.x)
                        setOW(rect.w)
                        setOH(rect.h)
                    }}
                    onEnd={rect => {
                        setX(rect.x)
                        setW(rect.w)
                        setH(rect.h)
                        setOX(0)
                        setOY(0)
                        setOW(0)
                        setOH(0)
                    }}
                />
            </div>
            <div className='-widget-content-'></div>
        </div>
    </div>
}