import React, { useState, useEffect, createContext, useMemo } from "react";
import { loginByToken, logout } from 'services/user';
import {
    addCart as addCartBE,
    removeCart as removeCartBE,
    addForLater as addForLaterBE,
    removeForLater as removeForLaterBE,
    restoreForLater as restoreForLaterBE
} from 'services/cart';
import { useConfig } from './ConfigContext';

const UserContext = createContext();



function makeChanges(name){
    let local = localStorage.getItem(name);
    let session = sessionStorage.getItem(name);
    
    if(local===null && session!==null) localStorage.setItem(name,session);
    else if(local!==null && local!==session) sessionStorage.setItem(name,local);
}



function get(name){
    return localStorage.getItem(name);
}



function set(name,value){
    localStorage.setItem(name,value);
    makeChanges(name);
}



export const UserProvider = ({ children }) => {
    makeChanges('user');
    const userDft = JSON.stringify({name:'', session:'', cart:[], forLater:[], lastViews:[]});
    const [user,setUserValue] = useState({...JSON.parse(userDft), ...JSON.parse(get('user') || '{}')});
    const [token,setTokenValue] = useState(get('token'));
    const [loading,setLoading] = useState(true);
    const {api_url} = useConfig();


    const setUser = (v) => {
        v = v ? {...JSON.parse(userDft), ...v} : JSON.parse(userDft);
        set('user',JSON.stringify(v));
        setUserValue(v);
    };


    const setToken = (v) => {
        localStorage.setItem('token',v);
        setTokenValue(v);
    };



    const addCart = ({ product, quantity=1, date=0 }) => {
        const cart = [...user.cart];

        try{ quantity = parseInt(quantity) || 1; } catch{ quantity = 1; }
        if(!date) date = Math.floor((new Date()).getTime() / 1000);

        let e = false;
        for(let p of cart){
            if(p.product!=product) continue;
            //Si los valores son iguales terminamos
            if(p.quantity==quantity && p.date==date) return;
            p.quantity = quantity;
            p.date = date;
            e = true;
            break;
        }
        if(!e) cart.push({
            product,
            quantity,
            date
        });

        setUser({...user, cart});
        if(user.session) addCartBE({api_url, token, session: user.session, product, quantity, date});
    }



    const removeCart = ({ product }) => {
        const cart = [...user.cart];

        let e = false;
        for(let k in cart){
            if(cart[k].product!=product) continue;
            cart.splice(k,1);
            e = true;
            break;
        }

        if(!e) return;

        setUser({...user, cart});
        if(user.session) removeCartBE({api_url, token, session: user.session, product});
    }



    const addForLater = ({ product, date=0 }) => {
        const cart = [...user.cart];
        const forLater = [...user.forLater];

        if(!date) date = Math.floor((new Date()).getTime() / 1000);

        for(let k in cart){
            if(cart[k].product!=product) continue;
            cart.splice(k,1);
            break;
        }
        
        let e = false;
        for(let p of forLater){
            if(p.product!=product) continue;
            p.date=date;
            e = true;
            break;
        }
        if(!e) forLater.push({
            product,
            date
        });

        setUser({...user, cart, forLater});
        if(user.session) addForLaterBE({api_url, token, session: user.session, product, date});
    }
    
    

    const removeForLater = ({ product }) => {
        const forLater = [...user.forLater];

        let e = false;
        for(let k in forLater){
            if(forLater[k].product!=product) continue;
            forLater.splice(k,1);
            e = true;
            break;
        }

        if(!e) return;

        setUser({...user, forLater});
        if(user.session) removeForLaterBE({api_url, token, session: user.session, product});
    }



    const restoreForLater = ({ product, date=0 }) => {
        const cart = [...user.cart];
        const forLater = [...user.forLater];

        if(!date) date = Math.floor((new Date()).getTime() / 1000);
        
        for(let k in forLater){
            if(forLater[k].product!=product) continue;
            forLater.splice(k,1);
            break;
        }
        
        let e = false;
        for(let p of cart){
            if(p.product!=product) continue;
            p.date=date;
            e = true;
            break;
        }
        if(!e) cart.push({
            product,
            date,
            quantity: 1
        });

        setUser({...user, cart, forLater});
        if(user.session) restoreForLaterBE({api_url, token, session: user.session, product, date});
    }



    const setLogout = () => {
        if(!token || !user.session) return;
        logout({ api_url, token, session:user.session });
        setToken('');
        setUser({});
    }


    useEffect(()=>{
        const onChange = window.addEventListener("storage",()=>{
            makeChanges('user');
            if(JSON.stringify(user) != get('user')) setUserValue(JSON.parse(get('user')));
            if(token != get('token')) setTokenValue(get('token'));
        });

        const unload = window.addEventListener("beforeunload",()=>{
            localStorage.removeItem('user');
        });

        return ()=>{
            window.removeEventListener("storage",onChange);
            window.removeEventListener("beforeunload",unload);
        };
    },[]);


    useEffect(()=>{
        if(loading){
            if(!token) setUser({...user, session:''});
            else if(!user.session){
                loginByToken({ api_url, token }).then(d=>{
                    if(!d.response) setUser({...user, session:''});
                    else{
                        setToken(d.token);
                        setUser(d.user);
                    }
                });
            }
            setLoading(false);
        }
    },[loading]);
    
    const value = useMemo(()=>{
        return ({
            user,
            setUser,
            token,
            setToken,
            setLogout,
            addCart,
            removeCart,
            addForLater,
            removeForLater,
            restoreForLater
        });
    },[user,token]);

    
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}



export const useUser = ()=>{
    const context = React.useContext(UserContext);
    if(!context) throw new Error('no access to useUser');
    return context;
}



export default UserContext;