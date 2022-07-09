import React from "react";
import { useLocation } from "wouter";
import { useConfig } from "context/ConfigContext";
import Home from "pages/Home/Home"
import NotFound from "pages/NotFound";
import Search from "pages/Search";
import { getPage } from "services/page";
import Product from "pages/Product/Product";
import Register from "pages/Register/Register";
import PasswordReset from "pages/PasswordReset/PasswordReset";
import Cart from "pages/Cart/Cart";
import Account from "pages/Account/Account";
import Orders from "pages/Orders/Orders";
import Addresses from "pages/Addresses/Addresses";
import Checkout from "pages/Checkout/Checkout";
import Login from "pages/Login/Login";

export default function Body(){
    let page = getPage(useConfig().store_path,useLocation()[0]);

    switch (page.page){
        case '': return <Home/>;
        case 'search': return <Search/>;
        case 'product': return <Product/>;
        case 'register': return <Register/>;
        case 'password_reset': return <PasswordReset/>;
        case 'cart': return <Cart/>;
        case 'account': return <Account/>;
        case 'orders': return <Orders/>;
        case 'addresses': return <Addresses/>;
        case 'checkout': return <Checkout/>;
        case 'login': return <Login/>;
        default: return <NotFound/>;
    }
}