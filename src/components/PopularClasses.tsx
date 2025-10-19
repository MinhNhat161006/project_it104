import React from 'react';

const PopularClasses: React.FC = () => {
    const classes = [
        {
            title: 'Gym',
            img: 'https://ansupps.com/cdn/shop/articles/weights.jpg?v=1692780831',
            desc: 'Tập luyện với các thiết bị hiện đại',
        },
        {
            title: 'Yoga',
            img: 'https://img.freepik.com/premium-vector/international-yoga-day-banner-design-vector-file_783553-340.jpg',
            desc: 'Thư giãn và cân bằng tâm trí',
        },
        {
            title: 'Zumba',
            img: 'https://img.freepik.com/free-psd/zumba-lifestyle-banner-template_23-2149193901.jpg',
            desc: 'Đốt cháy calories với những điệu nhảy sôi động',
        },
    ];

    const containerStyle: React.CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '40px',
    };

    // Wrapper sẽ được responsive bằng className + CSS
    const cardWrapperClass = 'card-wrapper';

    const cardStyle: React.CSSProperties = {
        width: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        textAlign: 'left',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
    };

    const bodyStyle: React.CSSProperties = {
        padding: '20px',
    };

    const descStyle: React.CSSProperties = {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '16px',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: '#2563eb',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '14px',
    };

    return (
        <>
            <style>
                {`
          .card-wrapper {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
          }

          @media (max-width: 375px) {
            .card-wrapper {
              flex-direction: column;
              align-items: center;
            }
          }
        `}
            </style>

            <div style={containerStyle}>
                <h2 style={titleStyle}>Các lớp học phổ biến</h2>
                <div className={cardWrapperClass}>
                    {classes.map((cls) => (
                        <div key={cls.title} style={cardStyle}>
                            <img src={cls.img} alt={cls.title} style={imageStyle} />
                            <div style={bodyStyle}>
                                <h3>{cls.title}</h3>
                                <p style={descStyle}>{cls.desc}</p>
                                <button
                                    style={buttonStyle}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                                >
                                    Đặt lịch
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PopularClasses;
