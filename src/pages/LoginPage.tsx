import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../stores'
import { signInUserThunk } from '../slices/authSlice'

type FormData = {
    email: string
    password: string
}

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>()

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (currentUser) {
        if (currentUser.role === 'admin') {
            window.location.href = '/admin'
        } else {
            window.location.href = '/'
        }
    }

    const onSubmit = async (data: FormData) => {
        try {
            const result = await dispatch(signInUserThunk(data)).unwrap()
            alert('Chào mừng ' + result.fullName + ' đã đăng nhập thành công')
            if (result.role === 'admin') {
                window.location.href = '/admin'
            } else {
                window.location.href = '/'
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Đăng nhập thất bại';
            alert(message)
        }
    }

    return (
        <div style={containerStyle}>
            <div style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng nhập</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={fieldStyle}>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                            type="text"
                            id="email"
                            style={inputStyle}
                            {...register('email', {
                                required: 'Email không được để trống',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Email không đúng định dạng'
                                }
                            })}
                        />
                        {errors.email && <div style={errorStyle}>{errors.email.message}</div>}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="password" style={labelStyle}>Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            style={inputStyle}
                            {...register('password', {
                                required: 'Mật khẩu không được để trống'
                            })}
                        />
                        {errors.password && <div style={errorStyle}>{errors.password.message}</div>}
                    </div>
                    <button type="submit" style={buttonStyle}>Đăng nhập</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Chưa có tài khoản? <a href="/sign-up">Đăng ký ngay</a>
                </p>
            </div>
        </div>
    )
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
}

const formBoxStyle = {
    width: '100%',
    maxWidth: '350px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    paddingRight: '50px'
}

const fieldStyle = {
    marginBottom: '25px'
}

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '14px'
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px'
}

const buttonStyle = {
    width: '107%',
    padding: '11px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
}

const errorStyle = {
    color: 'red',
    fontSize: '13px',
    marginTop: '4px'
}

