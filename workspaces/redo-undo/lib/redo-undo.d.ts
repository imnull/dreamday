/**
 * - 1 added
 * - -1 removed
 * - 0 value
 */
export type TPatch = [number, 1 | -1 | 0, string?];
export declare const redoPatch: (val: string, patches: TPatch[]) => string;
export declare const undoPatch: (val: string, patches: TPatch[]) => string;
export declare const applyPatch: (isUndo: boolean, val: string, patches: TPatch[]) => string;
type TRedoUndoSnap = {
    origin: string;
    current: string;
    history: TPatch[][];
    maxSize: number;
};
export default class RedoUndo {
    private readonly origin;
    private current;
    private readonly history;
    private cursor;
    private maxSize;
    constructor(origin?: string, maxSize?: number);
    getValue(): string;
    getCursor(): number;
    getHistory(): TPatch[][];
    getHistoryCount(): number;
    needUpdate(newStr: string): boolean;
    update(newStr: string): void;
    undo(step?: number): void;
    redo(step?: number): void;
    canUndo(): boolean;
    canRedo(): boolean;
    snap(): TRedoUndoSnap;
    static from(snap: TRedoUndoSnap): RedoUndo;
}
export {};
