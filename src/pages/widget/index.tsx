import { useEffect, useState } from 'react'
import './index.scss'

import Widget from '~/components/widget'

export default () => {

    const handleCloseWidget = (data: any) => {
        console.log('handleCloseWidget', data)
    }

    return <>
        <h1>Widget</h1>
        <Widget title='zIndex=10' zIndex={10} position={{ x: 10, y: 10 }} data={111} onClose={handleCloseWidget} onMoveEnd={e => console.log(e.position)} />
        <Widget title='中文试试' position={{ x: 20, y: 70 }} data={222} onClose={handleCloseWidget} onMoving={e => console.log(e.position)} />
        <Widget debug={false} position={{ x: 130, y: 130 }} data={333} onClose={handleCloseWidget} onMoveStart={e => console.log(e.position)} />
    </>
}