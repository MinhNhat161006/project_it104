import React from 'react';

const Footer: React.FC = () => {
    const footerStyle: React.CSSProperties = {
        backgroundColor: '#1F2937',
        color: 'white',
        padding: '40px 20px',
        marginTop: '60px',
        fontFamily: 'sans-serif',
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const rowClass = 'footer-row';

    const columnStyle: React.CSSProperties = {
        flex: '1',
        minWidth: '250px',
        marginBottom: '20px',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
    };

    const textStyle: React.CSSProperties = {
        color: '#9CA3AF',
        fontSize: '14px',
        lineHeight: '1.6',
    };

    const socialStyle: React.CSSProperties = {
        display: 'flex',
        gap: '16px',
        marginTop: '8px',
    };

    const copyrightStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '15px',
        fontWeight: 300,
        marginTop: '30px',
    };

    return (
        <>
            <style>
                {`
          .footer-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            border-bottom: 1px solid #374151;
            padding-bottom: 30px;
          }

          @media (max-width: 375px) {
            .footer-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
            }
          }
        `}
            </style>

            <footer style={footerStyle}>
                <div style={containerStyle}>
                    <div className={rowClass}>
                        <div style={columnStyle}>
                            <h5 style={headingStyle}>Về chúng tôi</h5>
                            <p style={textStyle}>Gym Management - Nơi bạn bắt đầu hành</p>
                            <p style={textStyle}>trình fitness của mình với các trang</p>
                            <p style={textStyle}>thiết bị hiện đại và đội ngũ huấn luyện</p>
                            <p style={textStyle}>viên chuyên nghiệp.</p>
                        </div>
                        <div style={columnStyle}>
                            <h5 style={headingStyle}>Liên hệ</h5>
                            <p style={textStyle}>
                                Email: contact@gym.com<br />
                                Phone: (123) 456-7890<br />
                                Địa chỉ: 123 đường ABC, Quận XYZ
                            </p>
                        </div>
                        <div style={columnStyle}>
                            <h5 style={headingStyle}>Theo dõi chúng tôi</h5>
                            <div style={socialStyle}>
                                <p style={textStyle}>Facebook</p>
                                <p style={textStyle}>Instagram</p>
                                <p style={textStyle}>Twitter</p>
                            </div>
                        </div>
                    </div>
                    <div style={copyrightStyle}>
                        © 2024 Gym Management. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
