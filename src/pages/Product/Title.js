import React, {useState} from "react";
import styles from './Title.module.scss';
import Price from "components/Price/Price";
import SelectQuantity from "components/SelectQuantity/SelectQuantity";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "context/LanguageContext";
import { useUser } from "context/UserContext";
import { setPage } from "services/page";
import { useLocation } from "wouter";
import { useConfig } from 'context/ConfigContext';

export default function Title({id, name, model, price, brand, brand_model, stock, status, className='', showModal}){
    const lang = useLanguage().language.pages.product;
    const {addCart} = useUser();
    const [quantity,setQuantity] = useState();
    const { store_path } = useConfig();
    const pageCheckout = setPage(store_path,'checkout');
    const [,setLocation] = useLocation();

    const checkOut = () => {
        sessionStorage.setItem('checkout',JSON.stringify([{
            product: id,
            quantity
        }]));
        setLocation(pageCheckout);
    }

    return (
        <div className={styles.container + (className ? ' '+className : '')}>
            <div className={styles.name}>{name}</div>
            <div className={styles.model}>{lang.model} {model}</div>
            {
                (stock<1 || status==0) ?
                <div className={styles.outOfStock}>{lang.out_of_stock}</div> :
                <Price price={price} className={styles.price}/>
            }
            <div className={styles.brand}>{lang.brand} {brand}</div>
            <div className={styles.brand_model}>{lang.brand_model} {brand_model}</div>
            {(stock<1 || status==0) ? 
                <></> :
                <>
                    <div className={styles.stock}>
                        <div>{lang.stock}</div>
                        <SelectQuantity max={stock} setQuantity={setQuantity}/>
                    </div>
                    <div className={styles.btns}>
                        <Button variant="warning" onClick={checkOut}>
                            <FontAwesomeIcon icon={faBagShopping} /> {lang.btn.checkout}
                        </Button>
                        <Button variant="primary" onClick={()=>{ addCart({ product: id, quantity }); showModal(true); }}>
                            <FontAwesomeIcon icon={faShoppingCart} /> {lang.btn.add_cart}
                        </Button>
                    </div>
                </>
            }
        </div>
    );
}