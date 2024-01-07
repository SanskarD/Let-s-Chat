import './App.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ChatsPage from './pages/ChatsPage'

function App() {

  const router = createBrowserRouter([
    {
      path:'/',
      element:<LoginPage />
    },
    {
      path:'/chats',
      element:<ChatsPage />,
    }
  ])
  return (
    <div className='App'>
    <RouterProvider router={router}/>
    </div>
  )
}

export default App
