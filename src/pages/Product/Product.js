import React, {useState,useEffect} from "react";
import { useLocation } from "wouter";
import { useConfig } from 'context/ConfigContext';
import NotFound from "pages/NotFound";
import { getPage } from "services/page";
import { rnnumber, textarea_to_html } from "services/functions";
import Loading from "pages/Loading";
import {getProduct} from "services/getProduct";
import styles from './Product.module.scss';
import Images from "./Images";
import Title from "./Title";
import Modal from "./Modal";
import parse from 'html-react-parser';

export default function Product(){
    const {api_url,store_path} = useConfig();
    const page = getPage(store_path, useLocation()[0]);
    const pageProduct = parseInt(rnnumber(page.data[0] || 0) || 0);

    const [modal,showModal] = useState(false);
    const [product,setProduct] = useState({id:0});
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(loading){
            getProduct(api_url,pageProduct).then(p=>{
                setProduct(p);
                setLoading(false);
            });
        }
    },[loading]);

    if(loading===false && product.id!=pageProduct && pageProduct!==0) setLoading(true);

    if(pageProduct===0 || (!loading && typeof product.notFound != 'undefined')) return <NotFound/>;
    if(loading) return <Loading/>
    else return (
        <>
            <div className="text-center">
                <div className={styles.product}>
                    <div className={styles.header}>
                        <Images pid={product.id} img={product.img} className={styles.product_images}/>
                        <div className={styles.hr+' '+styles.hrsm}></div>
                        <Title {...product} showModal={showModal} className={styles.product_title}/>
                    </div>
                    <div className={styles.hr}></div>
                    <div className={styles.description}>{parse(textarea_to_html(product.description))}</div>
                </div>
            </div>
            { modal ? <Modal pid={product.id} img={product.img[0]} showModal={showModal}/> : '' }
        </>
    );
}