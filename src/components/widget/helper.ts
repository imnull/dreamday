import { createMovable } from '~/libs/movable'

export type TPosition = { x: number; y: number }
export type TSize = { width: number; height: number; }
export type TEventArgs = { position: TPosition; data: any }
export type TResizeType = '' | 'L' | 'T' | 'R' | 'B' | 'LT' | 'RT' | 'LB' | 'RB'

export const posPlus = (a: TPosition, b: TPosition) => {
    return { x: a.x + b.x, y: a.y + b.y }
}

export const genTranslate = (position: TPosition, offset: TPosition, size: TSize, sizeOffset: TPosition, resizeType: TResizeType) => {
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

export const genWidth = (size: TSize, sizeOffset: TPosition, resizeType: TResizeType) => {
    if (resizeType.includes('L')) {
        return Math.abs(size.width - sizeOffset.x)
    } else if (resizeType.includes('R')) {
        return Math.abs(size.width + sizeOffset.x)
    } else {
        return size.width
    }
}

export const genHeight = (size: TSize, sizeOffset: TPosition, resizeType: TResizeType) => {
    if (resizeType.includes('T')) {
        return Math.abs(size.height - sizeOffset.y)
    } else if (resizeType.includes('B')) {
        return Math.abs(size.height + sizeOffset.y)
    } else {
        return size.height
    }
}

export const calRect = (size: TSize, pos: TPosition, offset: TPosition, resizeType: TResizeType) => {
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

type TStateParams<T> = [T, (arg: T) => void]

export const createResizeHandler = (options: {
    position: TStateParams<TPosition>;
    sizeOffset: TStateParams<TPosition>;
    resizeType: TStateParams<TResizeType>;
    size: TStateParams<TSize>;
    runtimeSize: TStateParams<TSize>;
    runtimePosition: TStateParams<TPosition>;
    debug?: boolean;
    onSelected?: () => void;
    useRuntime?: boolean;
}) => {
    const {
        debug = false,
        position: [position, setPosition],
        size: [size, setSize],
        resizeType: [resizeType, setResizeType],
        sizeOffset: [, setSizeOffset],
        runtimeSize: [runtimeSize, setRuntimeSize],
        runtimePosition: [runtimePosition, setRuntimePosition],
        onSelected,
        useRuntime = false,
    } = options


    const _position = { ...position }
    const _size = { ...size }

    const m = createMovable({
        debug,
        onStart() {
            setResizeType(resizeType)
            typeof onSelected === 'function' && onSelected()
        },
        onMoving({ offset }) {
            setSizeOffset(offset)
            if(useRuntime) {
                const { x, y, width, height } = calRect(_size, _position, offset, resizeType)
                setRuntimeSize({ width, height })
                setRuntimePosition({ x, y })
            }
        },
        onEnd: ({ offset }: any) => {
            setSizeOffset({ x: 0, y: 0 })
            const { x, y, width, height } = calRect(_size, _position, offset, resizeType)
            setPosition({ x, y })
            setSize({ width, height })
            setRuntimeSize({ width, height })
            setRuntimePosition({ x, y })
        }
    })

    const R = {
        updatePosition(pos: TPosition) {
            Object.assign(_position, pos)
        },
        updateSize(size: TSize) {
            Object.assign(_size, size)
        },
        update(pos: TPosition, size: TSize) {
            Object.assign(_position, pos)
            Object.assign(_size, size)
        },
        init(target: HTMLElement) {
            m.init(target)
        },
        dispose() {
            m.dispose()
        }
    }
    return R
}