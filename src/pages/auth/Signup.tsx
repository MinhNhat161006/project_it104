import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { signUpUserThunk } from '../../stores/slices/user.slice'
import type { AppDispatch } from '../../stores'


type FormData = {
    displayName: string
    email: string
    password: string
    confirmPassword: string
}

export default function Signup() {
    const dispatch = useDispatch<AppDispatch>()
    // dispatch<AppDispatch>() giúp TypeScript hiểu rõ kiểu trả về của dispatch
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>()

    const password = watch('password')

    const onSubmit = async (data: FormData) => {
        try {
            const result = await dispatch(
                signUpUserThunk({
                    displayName: data.displayName.trim(),
                    email: data.email.trim(),
                    password: data.password
                })
            ).unwrap()
            // dispatch(...).unwrap() giúp bạn lấy kết quả trả về từ fulfilled hoặc ném lỗi từ rejected.

            alert('Chúc mừng ' + result.displayName + ' đã đăng ký thành công')
            window.location.href = '/'
        } catch (error: any) {
            alert(error || 'Đăng ký thất bại')
        }
    }

    return (
        <div style={containerStyle}>
            <div style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng ký tài khoản</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={fieldStyle}>
                        <label htmlFor="displayName" style={labelStyle}>Họ và tên</label>
                        <input
                            type="text"
                            id="displayName"
                            style={inputStyle}
                            {...register('displayName', {
                                required: 'Họ và tên không được để trống'
                            })}
                        />
                        {errors.displayName && <div style={errorStyle}>{errors.displayName.message}</div>}
                    </div>
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
                                required: 'Mật khẩu không được để trống',
                                minLength: {
                                    value: 8,
                                    message: 'Mật khẩu phải có ít nhất 8 ký tự'
                                }
                            })}
                        />
                        {errors.password && <div style={errorStyle}>{errors.password.message}</div>}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="confirmPassword" style={labelStyle}>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            style={inputStyle}
                            {...register('confirmPassword', {
                                required: 'Vui lòng xác nhận mật khẩu',
                                validate: value =>
                                    value === password || 'Mật khẩu xác nhận không khớp'
                            })}
                        />
                        {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword.message}</div>}
                    </div>
                    <button type="submit" style={buttonStyle}>Đăng ký</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Đã có tài khoản? <a href="/sign-in">Đăng nhập ngay</a>
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
