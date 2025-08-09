import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div>
        <h1>404 - Page Not Found ⚠️</h1>
      </div>
    ),
    children: [

    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
