import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/admin/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingPage from './pages/BookingPage'
import BookingManagementPage from './pages/admin/BookingManagementPage'
import CourseManagementPage from './pages/admin/CourseManagementPage'
import UserManagementPage from './pages/admin/UserManagementPage'

export default function RouterSetup() {
    return (
        <Routes>
            <Route path='*' element={<HomePage />}></Route>
            <Route path='admin' element={<DashboardPage />}></Route>
            <Route path='admin/bookings' element={<BookingManagementPage />}></Route>
            <Route path='admin/courses' element={<CourseManagementPage />}></Route>
            <Route path='admin/users' element={<UserManagementPage />}></Route>
            <Route path='sign-in' element={<LoginPage />}></Route>
            <Route path='sign-up' element={<RegisterPage />}></Route>
            <Route path='booking' element={<BookingPage />}></Route>
        </Routes>
    )
}
