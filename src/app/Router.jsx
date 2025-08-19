import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/app/Layout'
import Home from '@/pages/Home'
import UserPage from '@/pages/userPage/UserPage';
import Login from '@/pages/auth/Login';
import ProductCatalogPage from '@/pages/productCatalog/ProductRoute';
import ProductDetailRoute, { productLoader } from '@/pages/productDetail/ProductDetailRoute';


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
            element: <ProductCatalogPage />,
        },
        {
            path: "products/:id",
            loader: productLoader,
            element: <ProductDetailRoute />,
            errorElement: <div className="p-6">Product not found 🐾</div>, // optional, nicer 404 for this page
        },
        // {
        //     path: "product-customize",
        //     element: <ProductDetailRoute />,
        // },
        {
            path: "login",
            element: <Login />,
        },
        ],
    },
]);
