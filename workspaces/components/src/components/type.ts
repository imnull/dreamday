import { TMovable } from "@imnull/movable";

export type TPosition = { x: number; y: number }
export type TSize = { width: number; height: number; }
export type TEventArgs = { position: TPosition; data: any }
export type TMoveEventArgs = { position: TPosition; offset: TPosition }
export type TResizeType = '' | 'L' | 'T' | 'R' | 'B' | 'LT' | 'RT' | 'LB' | 'RB'

export type TRectangle = { left: number; top: number; width: number; height: number; }
export type TRectParams = { [key in keyof TRectangle]?: number }

export type TJoyStickProps<T = any> = TRectParams & {
    debug?: boolean;
    fill?: boolean;
    data?: T;
    onStart?: (args: { movable: TMovable<T> }) => void;
    onMoving?: (args: TMoveEventArgs & { movable: TMovable<T> }) => void;
    onEnd?: (args: TMoveEventArgs & { movable: TMovable<T> }) => void;
}
declare const JoyStick: (props: TJoyStickProps) => JSX.Element

export { JoyStick }