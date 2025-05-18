
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react'

import Start from './Components/StartPage/StartPage'
import Register from './Components/Register/Register';
import Entry from './Components/Entry/Entry'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
    // errorElement: <ErrorPage />
  },

  {
    path: "/entry",
    element: <Entry />,
    
  },

  {
    path: "/register",
    element: <Register />,
    
  },
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>

  )
}

export default App
