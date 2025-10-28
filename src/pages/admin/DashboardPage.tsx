import { useEffect } from 'react'

export default function DashboardPage() {
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

        if (!currentUser) {
            window.location.href = '/'
        } else if (currentUser.role !== 'admin') {
            window.location.href = '/'
        } else {
            // Redirect to booking management page
            window.location.href = '/admin/bookings'
        }
    }, [])

    return (
        <div>Loading...</div>
    )
}

