import React from 'react'

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { useSharedStore } from 'appshell/exposed'

import uuid from 'uuid-random'

const ChangeUserIdButton = () => (
    <button
        onClick={
            () => useSharedStore.setState(state => {
                state.userId = uuid()
            })
        }
    >Change UserID
    </button>
)

export default ChangeUserIdButton