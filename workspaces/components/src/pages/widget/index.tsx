import { useEffect, useState } from 'react'
import './index.scss'
import { TMovable, createMovable } from '@imnull/movable'
import { Widget } from '~/components'

export default () => {

    return <>
        <Widget title='Widget-01' debug={false} left={120} top={130} padding={3} normalClass='widget-normal' active activeClass='widget-active' />
    </>
}