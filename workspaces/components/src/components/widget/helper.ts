import { createElement, isValidElement } from "react"
import { TRectParams, TJoyStickProps, TResizeType, TSize, TMoveEventArgs } from '~/components/type'
import { TPosition } from '@imnull/movable'

export const getCursor = (type: TResizeType) => {
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

export const calRect = (type: TResizeType, size: number, corner: number) => {
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

export const calPadding = (padding?: number | number[]): Record<string, number> => {
    if (Array.isArray(padding)) {
        const [top = 0, right = top, bottom = top, left = right] = padding
        return { top, right, bottom, left }
    } else if (typeof padding !== 'number' || isNaN(padding)) {
        return calPadding([0])
    } else {
        return calPadding([padding])
    }
}

export const calOffset = (type: TResizeType, pos: TPosition, box: TSize, min: TSize, max: TSize, offset: TPosition) => {
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

export const cloneChildren = (children: any, extProps: Record<string, any>, key: any = null): any => {
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

export type TData = {
    pos: TPosition,
    box: TSize;
    min: TSize;
    max: TSize;
}

export type TCalResult = TSize & TPosition & { left: number; top: number; ox: number; oy: number; ow: number; oh: number; w: number; h: number; }

export type TCalRes = { x: number; y: number; w: number; h: number; }