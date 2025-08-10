import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/app/Layout'
import Home from '@/pages/Home'
import UserPage from '@/pages/userPage/UserPage';
import ProductDetail from '@/pages/ProductDetail';
import Login from '@/pages/auth/Login';
import ProductRoute from '@/pages/productCatalog/ProductRoute';


export const router = createBrowserRouter([
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
        {
            path: "user",
            element: <UserPage />,
        },
        {
            path: "catalog",
            element: <ProductRoute />,
        },
        {
            path: "product-customize",
            element: <ProductDetail />,
        },
        {
            path: "login",
            element: <Login />,
        },
        ],
    },
]);