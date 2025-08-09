import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './app/Layout'
import Home from './pages/Home'


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
      {
        path: "/",
        element: <Home />
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
