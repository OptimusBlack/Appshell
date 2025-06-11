import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import Remote1 from 'remote1/Main'

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { useSharedStore } from 'appshell/exposed'

import uuid from 'uuid-random'
import ChangeUserIdButton from '../ChangeUserIdButton'

import styles from './style.css'

const Main = () => {
    const userId = useSharedStore(state => state.userId)

    useEffect(() => {
        useSharedStore.setState(state => {
            state.userId = uuid()
        })
    }, [])

    return (
        <div className={styles.appshell}>
            <h1>Appshell</h1>
            <ChangeUserIdButton />
            <div>{userId}</div>

            <Remote1 />
        </div>
    )
}

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<Main />)