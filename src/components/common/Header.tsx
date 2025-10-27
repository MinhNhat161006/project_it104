import React from 'react'

const Header = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        window.location.href = '/sign-in'
    }

    return (
        <header style={{
            width: '100%',
            height: '52px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#1F2937',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
        }}>
            <div style={{
                width: '1280px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
                color: 'white'
            }}>
                <div style={{ fontWeight: 600, fontSize: '20px' }}>GYM MANAGEMENT</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Trang chủ</a>
                    <a href="/booking" style={{ color: 'white', textDecoration: 'none' }}>Lịch tập</a>

                    {/* {currentUser && currentUser.role === 'admin' && (
                        <a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>Quản lý</a>
                    )} */}


                    {currentUser && (
                        <p style={{
                            background: 'none',
                            border: 'none',
                            color: 'orange',
                            cursor: 'pointer',
                        }}>Xin chào, {currentUser.displayName}</p>
                    )}

                    {currentUser ? (
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            Đăng xuất
                        </button>
                    ) : (
                        <a href="/sign-in" style={{ color: 'white', textDecoration: 'none' }}>Đăng nhập</a>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
