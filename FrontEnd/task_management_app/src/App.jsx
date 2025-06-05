import React, { useState } from 'react';
import { Registration } from "../pages/Registration";
import { Login } from "../pages/Login";
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import {Dashboard} from "../pages/TaskDashboard";

const router = createBrowserRouter([
  {
    path:"/",
    element:<Login/>,
  },
  {
    path:"/login",
    element:<Login/>,
  },
  {
    path:"/dashboard",
    element:<Dashboard/>
  },
  {
    path:"/register",
    element:<Registration/>
  }
]);


const App = () => {
   return <RouterProvider router={router}> </RouterProvider>
}

export default App;