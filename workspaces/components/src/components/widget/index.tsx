import './index.scss'
import { useEffect, useState } from 'react'

import { TWidgetProps } from '~/components/type'
import { JoyStick } from '~/components'
import ResizeHandler from './resize-handler'

import { calPadding } from './helper'

export default (props: TWidgetProps) => {
    const {
        debug = false,
        left = 0,
        top = 0,
        width = 240,
        height = 180,
        minWidth = 128,
        minHeight = 128,
        maxWidth = -1,
        maxHeight = -1,
        stickSize = 4,
        cornerSize = 10,
        padding = 0,
        active,
        activeClass,
        normalClass,
        children,
        title = 'Untitled',
    } = props

    const [x, setX] = useState(left)
    const [y, setY] = useState(top)
    const [w, setW] = useState(width)
    const [h, setH] = useState(height)

    const [ox, setOX] = useState(0)
    const [oy, setOY] = useState(0)
    const [ow, setOW] = useState(0)
    const [oh, setOH] = useState(0)

    const [newChildren, setNewChildren] = useState(children)

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
                <div className='-widget-title-'>{title}</div>
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
            <div className='-widget-content-'>{newChildren}</div>
        </div>
    </div>
}