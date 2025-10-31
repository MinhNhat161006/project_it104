import React from 'react';

const Banner: React.FC = () => {
    const bannerStyle: React.CSSProperties = {
        width: '100%',
        height: '745px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://bizweb.dktcdn.net/100/011/344/files/tac-dung-cua-yoga.webp?v=1680778752047')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '16px',
    };

    const paragraphStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: '300',
        marginBottom: '24px',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: '#2563eb',
        color: 'white',
        fontSize: '18px',
        fontWeight: 500,
        padding: '10px 32px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    return (
        <div style={bannerStyle}>
            <h1 style={headingStyle}>Welcome to Our Gym</h1>
            <p style={paragraphStyle}>Transform Your Body, Transform Your Life</p>
            <button
                style={buttonStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            >
                Bắt đầu ngay
            </button>
        </div>
    );
};

export default Banner;
