import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { Store } from '../../stores'

export default function Admin() {
    const userStore = useSelector((store: Store) => store.user)

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (currentUser.role === 'user') {
        window.location.href = '/'
    }

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
