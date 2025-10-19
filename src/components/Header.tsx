import React from 'react'

const Header = () => {
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
                    <a href="/schedule" style={{ color: 'white', textDecoration: 'none' }}>Lịch tập</a>
                    <a href="/sign-in" style={{ color: 'white', textDecoration: 'none' }}>Đăng nhập</a>
                </div>
            </div>
        </header>
    )
}

export default Header
