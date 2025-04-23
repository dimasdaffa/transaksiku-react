import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Login from './Pages/Auth/Login'
import { RouterProvider } from 'react-router-dom'
import Router from './Routes/Router'

function App(){

  return (
    
      <div>
        <RouterProvider router={Router} />
        </div>
   
  )

}
export default App
