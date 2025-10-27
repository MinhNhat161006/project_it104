import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/home/Home'
import Admin from './pages/admin/Admin'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import BookingPage from './pages/user/BookingPage'

export default function RouterSetup() {
    return (
        <Routes>
            <Route path='*' element={<Home />}></Route>
            <Route path='admin' element={<Admin />}></Route>
            <Route path='sign-in' element={<Signin />}></Route>
            <Route path='sign-up' element={<Signup />}></Route>
            <Route path='booking' element={<BookingPage />}></Route>
        </Routes>
    )
}
