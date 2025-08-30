import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/app/Layout.jsx'
import Home from '@/pages/Home.jsx'
import Login from '@/pages/auth/Login.jsx';
import ProductCatalogPage from '@/pages/productCatalog/ProductRoute.jsx';
import Cart from '@/pages/userCart/Cart.jsx';
import ProductDetailRoute, { productLoader } from '@/pages/productDetail/ProductDetailRoute.jsx';
import Signup from '@/pages/auth/SignUp.jsx';
import NotFound from '@/pages/404_page.jsx';
import UserPage from '@/pages/userPage/UserPage.jsx';
import Checkout from '@/pages/checkout/Checkout.jsx';
import ResetPassword from '@/pages/auth/ResetPassword.jsx';
import VerificationForm from '@/pages/auth/VerificationForm.jsx';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: (
        <NotFound />
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
        {
            path: "signup",
            element: <Signup />,
        },
        {
            path: "cart",
            element: <Cart />
        },
        {
            path: "cart/checkout",
            element: <Checkout />
        },
        {
          path: "resetpassword",
          element: <ResetPassword />,
        },
        {
          path: "verification",
          element: <VerificationForm />,
        },
        ],
    },
]);
