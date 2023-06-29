import React from 'react'
import './index.scss'

import { TResizeType } from '~/components/type'
import { JoyStick } from '~/components'

import {
    TData, TCalRes,
    getCursor, calRect, calOffset,
} from '../helper'

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
            }}
        />
    </div>
}

export default ResizeHandler