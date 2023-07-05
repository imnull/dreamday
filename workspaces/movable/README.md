# `Movable`

通过 `mousedown` `mousemove` `mouseup` 事件，封装用户操作，快速创建`拖移`效果的基础模块。

## useMovable

```tsx
import { useEffect, useState } from 'react'
import { useMovable } from '@imnull/movable'

export default () => {
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (target) {
            const m = useMovable({
                update: setPos,
            })
            m.init(target)
            return () => {
                m.dispose()
            }
        }
    }, [target])

    return <>
        <h1>Playgound</h1>
        <div className='block' ref={setTarget} style={{ transform: `translateX(${pos.x}px) translateY(${pos.y}px)` }}>block</div>
    </>
}
````