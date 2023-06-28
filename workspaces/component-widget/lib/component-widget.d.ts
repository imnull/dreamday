export type TPosition = { x: number; y: number }
export type TSize = { width: number; height: number; }
export type TEventArgs = { position: TPosition; data: any }
export type TResizeType = '' | 'L' | 'T' | 'R' | 'B' | 'LT' | 'RT' | 'LB' | 'RB'

export type TProps = {
    children?: any;
    data?: any;
    position?: TPosition;
    size?: TSize;
    debug?: boolean;
    active?: boolean;
    title?: string;
    useRuntime?: boolean;
    grid?: number;
    locked?: boolean;
    onSelected?: () => void;
    onClose?: (args: TEventArgs) => void;
    onMoveStart?: (args: TEventArgs) => void;
    onMoveEnd?: (args: TEventArgs) => void;
    onMoving?: (args: TEventArgs) => void;
    onMinify?: (min: boolean) => void;
    onResizing?: (size: TSize) => void;
    onResized?: (size: TSize) => void;
    onChange?: (rect: TSize & TPosition) => void;
    checking?: (rect: TPosition & TSize) => boolean;
}

declare const Widget: (props: TProps) => JSX.Element

export default Widget