import React, { useState, useEffect, useRef } from "react";
import { useConfig } from 'context/ConfigContext';
import { useLanguage } from "context/LanguageContext";
import { getCart, getCartNoSession } from 'services/cart';
import Loading from "pages/Loading";
import { useUser } from "context/UserContext";
import {ProductList} from "components/ProductList/ProductList";
import styles from './Cart.module.scss';
import { Button, Alert } from "react-bootstrap";
import { pmoney, slideShow } from "services/functions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping as iconCheckOut } from '@fortawesome/free-solid-svg-icons'
import { setPage } from "services/page";
import { useLocation } from "wouter";



function getStatus({price, status, stock}){
    return (price<=1 || status!=1 || stock<1) ? false : true;
}


export default () => {
    const [loading,setLoading] = useState(true);
    const [product,setProduct] = useState({});
    const { api_url, store_path } = useConfig();
    const lang = useLanguage().language.pages.cart;
    const { user, token, setUser } = useUser();
    const pageCheckout = setPage(store_path,'checkout');
    const [,setLocation] = useLocation();
    const refNoCartList = useRef();

    useEffect(()=>{
        const cartReload = window.addEventListener('cart.update',()=>setLoading(true));
        return window.removeEventListener('cart.update', cartReload);
    },[]);

    useEffect(()=>{
        if(loading){
            if(user.session) getCart({ api_url, token, session:user.session }).then((r)=>{
                if(typeof r !== 'object') setProduct({});
                else{
                    setUser({...user, cart:r.cart, forLater:r.forLater });
                    setProduct(r.product);
                }
                setLoading(false);
            });
            else if(user.cart.length==0 && user.forLater.length==0){
                setProduct({});
                setLoading(false);
            }
            else getCartNoSession({ api_url, cart:user.cart, forLater:user.forLater }).then((r)=>{
                if(typeof r !== 'object') setProduct({});
                else setProduct(r.product);
                setLoading(false);
            });
        }
    },[loading]);

    useEffect(()=>{
        if(refNoCartList.current && refNoCartList.current.style.display=='none') slideShow(refNoCartList.current,600);
    });

    if(loading) return <Loading/>;
    
    const cart = JSON.parse(JSON.stringify(user.cart));
    cart.sort((a,b)=>a.date-b.date);
    const forLater = JSON.parse(JSON.stringify(user.forLater));
    forLater.sort((a,b)=>b.date-a.date);    

    let total = 0;
    const $cart = [];
    const checkOutData = [];
    for(let p of cart){
        if(typeof product[p.product] == 'undefined') continue;

        let pdata = product[p.product];

        let status = getStatus(pdata);

        let quantity = p.quantity;
        if(quantity>pdata.stock) quantity = pdata.stock;

        total += status ? quantity * pdata.price : 0;

        if(status) checkOutData.push({
            product: pdata.id,
            quantity
        });

        $cart.push(
            <ProductList
                key={"cart_"+pdata.id} 
                id={pdata.id}
                name={pdata.name}
                price={pdata.price}
                date={pdata.date}
                stock={pdata.stock}
                quantity={quantity}
                dateCart={p.date}
                status={status}
                type="cart"
            />
        );
    }

    const $forLater = [];
    for(let p of forLater){
        if(typeof product[p.product] == 'undefined') continue;

        let pdata = product[p.product];

        let status = getStatus(pdata);

        $forLater.push(
            <ProductList
                key={"forlater_"+pdata.id} 
                id={pdata.id}
                name={pdata.name}
                price={pdata.price}
                date={pdata.date}
                status={status}
                type="forlater"
            />
        );
    }


    const checkOut = () => {
        sessionStorage.setItem('checkout',JSON.stringify(checkOutData));
        setLocation(pageCheckout);
    }
    

    return <>
        <div className={styles.div_container}>
            <div className={styles.title}>
                <h4>{lang.title.cart}</h4>
            </div>
            {
                $cart.length ? <>
                    {$cart}
                    <div className={styles.div_separator+" div-separator"}>
                        <div className={styles.total}>
                            <div>
                                {lang.total+' '+pmoney(total)}
                            </div>
                            <div>
                                <Button variant="warning" onClick={checkOut}><FontAwesomeIcon icon={iconCheckOut}/> {lang.btn.checkout}</Button>
                            </div>
                        </div>
                    </div>
                </>: <>
                    <div className="div-separator" ref={refNoCartList} style={{display:'none'}}>
                        <Alert variant="warning" className="text-center">
                            {lang.no_cart_list}
                        </Alert>
                    </div>
                </>
            }
        </div>
        {
            $forLater.length==0 ? '' : <>
                <div className={styles.div_container}>
                    <div className={styles.title}>
                        <h4>{lang.title.forLater}</h4>
                    </div>
                    {$forLater}
                </div>
            </>
        }
    </>;
}