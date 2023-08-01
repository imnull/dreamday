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
    onMoving?: (args: TArgs) => void;
    onEnd?: (args: TArgs) => void;
};
export type TPosition = {
    x: number;
    y: number;
};
export type TArgs = {
    position: TPosition;
    offset: TPosition;
};
export type TMovable<T = any> = ReturnType<typeof createMovable<T>>;
export declare const useMovable: (props: {
    update?: (pos: TPosition) => void;
    debug?: boolean;
    onChange?: (args: TArgs) => void;
    reducer?: ((pos: TPosition) => TPosition)[];
    grid?: number;
}) => {
    snap(s: any): void;
    getSnap(): any;
    update(position: TPosition): void;
    init(target: HTMLElement): void;
    dispose(): void;
};
export {};
