
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react'

import Start from './Components/StartPage/StartPage'
import Register from './Components/Register/Register';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
    // errorElement: <ErrorPage />
  },

  {
    path: "/entry",
    element: <>dddd</>,
    // errorElement: <ErrorPage />
  },

  {
    path: "/register",
    element: <Register />,
    // errorElement: <ErrorPage />
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
