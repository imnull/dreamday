export declare const createMovable: <T = any>(props?: TProps) => {
    snap(s: T): void;
    getSnap(): T;
    update(position: TPosition): void;
    init(target: HTMLElement): void;
    dispose(): void;
};
type TProps<T = any> = {
    debug?: boolean;
    grid?: number;
    snap?: T;
    onStart?: () => void;
    onMoving?: (args: {
        position: TPosition;
        offset: TPosition;
    }) => void;
    onEnd?: (args: {
        position: TPosition;
        offset: TPosition;
    }) => void;
};
export type TPosition = {
    x: number;
    y: number;
};
export type TMovable = ReturnType<typeof createMovable>;
export {};
