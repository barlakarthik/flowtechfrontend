import React,{createContext, useState} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Email from './components/Email';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import AdminaccessPage from './components/AdminaccessPage';
export const store = createContext()
const router = createBrowserRouter([
  {
    path:'/',
    element:<Email/>
  },
  {
    path:'/register',
    element:<Register/>
  },
  {
    path:'/password',
    element:<Password/>
  },
  {
    path:'/admin',
    element:<AdminaccessPage/>
  },
  {
    path:'/profile',
    element:<Profile/>
  },
  {
    path:'*',
    element:<PageNotFound/>
  },
  {
    path:'/recovery',
    element:<Recovery/>
  },
  {
    path:'/reset',
    element:<Reset/>
  }
])
function App() {
  const [email,setEmail] = useState(null);
  return (
    <main>
      <store.Provider value={[email,setEmail]}>
      <RouterProvider router={router}></RouterProvider>
      </store.Provider>
    </main>
  );
}

export default App;
