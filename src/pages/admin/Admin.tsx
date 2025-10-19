import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { Store } from '../../stores'

export default function Admin() {
    const userStore = useSelector((store: Store) => store.user)

    useEffect(() => {
        if (!userStore.data && !userStore.loading) {
            window.location.href = "/"
        }
    }
        , [userStore.data, userStore.loading]
    )

    return (
        <div>Admin</div>
    )
}
