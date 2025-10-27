import React from 'react'
import RouterSetup from './RouterSetup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {


  return (
    <>
      <RouterSetup />
      <ToastContainer />
    </>
  )
}
