
export const createMovable = <T = any>(props: TProps = {}) => {

    const { onStart, onMoving, onEnd, debug = false, grid: _grid = 1, snap = null } = props

    const grid = Math.max(1, _grid >> 0)

    const state = {
        element: null as HTMLElement | null,
        status: 0,
        start: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
        snap,
    }

    const mousedown = (e: MouseEvent) => {
        e.stopPropagation()
        state.status = 1
        state.start = { x: e.clientX, y: e.clientY }
        state.offset = { x: 0, y: 0 }
        typeof onStart === 'function' && onStart()
    }

    const mousemove = (e: MouseEvent) => {
        e.stopPropagation()
        if (state.status !== 1) {
            return
        }
        const x = e.clientX - state.start.x
        const y = e.clientY - state.start.y
        const offset = { x, y }
        const position = { x: state.position.x + x, y: state.position.y + y }
        state.offset = offset
        typeof onMoving === 'function' && onMoving({ position, offset })
    }

    const mouseup = (e: MouseEvent) => {
        e.stopPropagation()
        if (state.status !== 1) {
            return
        }
        state.status = 0
        const { x, y } = state.offset
        const position = { x: state.position.x + x, y: state.position.y + y }
        position.x = Math.round(position.x / grid) * grid
        position.y = Math.round(position.y / grid) * grid
        // state.position = { ...position }
        typeof onEnd === 'function' && onEnd({ position, offset: { x, y } })
    }

    const R = {
        snap(s: T) {
            state.snap = s
        },
        getSnap() {
            return state.snap as T
        },
        update(position: TPosition) {
            state.position = { ...position }
        },
        init(target: HTMLElement) {
            state.element = target
            target.addEventListener('mousedown', mousedown)
            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
            debug && console.log('[movable] inited')
        },
        dispose() {
            if (state.element) {
                state.element.removeEventListener('mousedown', mousedown)
            }
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
            debug && console.log('[movable] displosed')
        }
    }
    return R
}


type TProps<T = any> = {
    debug?: boolean;
    grid?: number;
    snap?: T;
    onStart?: () => void;
    onMoving?: (args: { position: TPosition; offset: TPosition; }) => void;
    onEnd?: (args: { position: TPosition; offset: TPosition; }) => void;
}
export type TPosition = { x: number; y: number; }
export type TMovable<T = any> = ReturnType<typeof createMovable<T>>