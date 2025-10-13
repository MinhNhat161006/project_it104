import React from 'react'
import { Route, Routes } from 'react-router'

export default function RouterSetup() {
    return (
        <Routes>
            <Route path='*' element={<>Home</>}></Route>
        </Routes>
    )
}
