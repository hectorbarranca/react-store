import React, {useRef, useEffect} from "react";
import styles from './ProductList.module.scss';
import { useConfig } from "context/ConfigContext";
import { useLocation } from "wouter";
import { setPage } from "services/page";
import { pmoney, slideHide, slideShow } from "services/functions";
import SelectQuantity from "components/SelectQuantity/SelectQuantity";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import { useUser } from "context/UserContext";

export function ProductList({id=0, name='', price=0, date=0, stock=0, quantity=1, dateCart=0, status=true, type='cart', useSlide=true }){
    const [,setLocation] = useLocation();
    const {img_url,store_path} = useConfig();
    const url = setPage(store_path,'product',[id,name]);
    const lang = useLanguage().language.components.product_list;
    const {
        addCart,
        removeCart,
        addForLater,
        removeForLater,
        restoreForLater
    } = useUser();
    const refContainer = useRef();
    const slideDuration = 350;

    const setQuantity = (newQuantity) => addCart({ product:id, quantity:newQuantity, date:dateCart });
    
    const fnRemoveCart = async () => {
        await slideHide(refContainer.current,slideDuration);
        removeCart({product:id});
    };
    const fnAddForLater = async () => {
        await slideHide(refContainer.current,slideDuration);
        addForLater({product:id});
    };

    const fnRestoreForLater = async () => {
        await slideHide(refContainer.current,slideDuration);
        restoreForLater({product:id});
    };
    const fnRemoveForLater = async () => {
        await slideHide(refContainer.current,slideDuration);
        removeForLater({product:id});
    };    

    useEffect(()=>{
        if(refContainer.current.style.display=='none') slideShow(refContainer.current,slideDuration);
    });
    
    return (
        <div className={"div-separator "+styles.div_separator} ref={refContainer} style={useSlide ? {display:'none'} : {}}>
            <div className={styles.container}>
                <div>
                    <a href={url} onClick={e=>{ e.preventDefault(); setLocation(url); }}>
                        <img alt="noImage" loading="lazy" src={img_url+`pid.php?p=${id}&s=90&t=${date}`}/>
                    </a>
                </div>
                <div>
                    <div>
                        <span className={styles.name}>
                            {name.trim()}
                        </span>
                    </div>
                    <div>
                        {
                            status ? <> 
                                <div className={styles.money}>
                                    {
                                        type=='cart' ? <>
                                            <div>{pmoney(price)} x</div>
                                            <SelectQuantity max={stock} dft={quantity} setQuantity={setQuantity}/>
                                        </> : <>
                                            <div>{pmoney(price)}</div>
                                        </>
                                    }
                                </div>
                            </> : <>
                                <div className="text-danger text-bold">{lang.soldOut}</div>
                            </>
                        }
                    </div>
                    <div className="text-right">
                        {
                            type=='cart' ? <>
                                <Button variant="primary" size="sm" className={styles.btn} onClick={fnAddForLater}><FontAwesomeIcon icon={faHeart}/> {lang.btn.forLater}</Button>
                                <Button variant="danger" size="sm" className={styles.btn} onClick={fnRemoveCart}><FontAwesomeIcon icon={faTrash}/> {lang.btn.cartDelete}</Button>
                            </> : <>
                                <Button variant="primary" size="sm" className={styles.btn} onClick={fnRestoreForLater}><FontAwesomeIcon icon={faShoppingCart}/> {lang.btn.toCart}</Button>
                                <Button variant="danger" size="sm" className={styles.btn} onClick={fnRemoveForLater}><FontAwesomeIcon icon={faTrash}/> {lang.btn.forLaterDelete}</Button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}