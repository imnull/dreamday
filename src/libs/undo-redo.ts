import { diffChars, Change } from 'diff'

/**
 * - 1 added
 * - -1 removed
 * - 0 value
 */
export type TPatch = [number, 1 | -1 | 0, string?]

const change2patch = (change: Change) => {
    const patch: (string | number)[] = [change.count || 0, change.added ? 1 : change.removed ? -1 : 0]
    if (change.added || change.removed) {
        patch.push(change.value)
    }
    return patch as TPatch
}

export const redoPatch = (val: string, patches: TPatch[]) => {
    const segs: string[] = []
    let idx = 0
    patches.forEach(patch => {
        const [count, type, value = ''] = patch
        if (type === 0) {
            segs.push(val.substring(idx, idx + count))
            idx += count
        } else if (type === 1) {
            segs.push(value)
        } else {
            idx += count
        }
    })
    return segs.join('')
}

export const undoPatch = (val: string, patches: TPatch[]) => {
    const segs: string[] = []
    let idx = 0
    patches.forEach(patch => {
        const [count, type, value = ''] = patch
        if (type === 0) {
            segs.push(val.substring(idx, idx + count))
            idx += count
        } else if (type === -1) {
            segs.push(value)
        } else {
            idx += count
        }
    })
    return segs.join('')
}

export const applyPatch = (isUndo: boolean, val: string, patches: TPatch[]) => {
    const segs: string[] = []
    let idx = 0
    patches.forEach(patch => {
        const [count, type, value = ''] = patch
        if (type === 0) {
            segs.push(val.substring(idx, idx + count))
            idx += count
        } else if ((type === 1 && !isUndo) || (type === -1 && isUndo)) {
            segs.push(value)
        } else {
            idx += count
        }
    })
    return segs.join('')
}

type TUndoRedoSnap = {
    origin: string;
    current: string;
    history: TPatch[][];
}

export default class UndoRedo {
    private readonly origin: string
    private current: string
    private history: TPatch[][]
    private cursor: number
    constructor(origin: string = '') {
        this.origin = origin
        this.current = origin
        this.history = []
        this.cursor = this.history.length
    }

    getValue() {
        if(this.cursor <= 0) {
            return this.origin
        } else if(this.cursor >= this.history.length) {
            return this.current
        }
        const isUndo = this.cursor > this.history.length * .5
        const slice = isUndo ? this.history.slice(this.cursor).reverse() : this.history.slice(0, this.cursor)
        let val = isUndo ? this.current : this.origin
        slice.forEach(patches => {
            val = applyPatch(isUndo, val, patches)
        })
        return val
    }
    getCursor() {
        return this.cursor
    }
    getHistory() {
        return this.history.map(it => [...it])
    }
    getHistoryCount() {
        return this.history.length
    }

    needUpdate(newStr: string) {
        return newStr !== this.getValue()
    }

    update(newStr: string) {
        if(this.current === newStr) {
            return
        }
        const diff = diffChars(this.getValue(), newStr)
        const patches = diff.map(change2patch)
        const abandon = this.history.splice(this.cursor, this.history.length, patches)
        this.current = newStr
        this.cursor = this.history.length
    }

    undo(step: number = 1) {
        this.cursor = Math.max(0, this.cursor - step)
    }
    redo(step: number = 1) {
        this.cursor = Math.min(this.history.length, this.cursor + step)
    }

    canUndo() {
        return this.getHistoryCount() > 0 && this.cursor > 0
    }
    canRedo() {
        return this.getHistoryCount() > 0 && this.cursor < this.history.length
    }

    snap() {
        return {
            origin: this.origin,
            current: this.current,
            history: this.getHistory(),
        } as TUndoRedoSnap
    }

    static from(snap: TUndoRedoSnap) {
        const { origin, current, history } = snap
        const ur = new UndoRedo(origin)
        ur.current = current
        ur.history.push(...history)
        ur.cursor = ur.history.length
        return ur
    }
}