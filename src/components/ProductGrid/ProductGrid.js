import React from "react";
import "./ProductGrid.scss";
import { useConfig } from "context/ConfigContext";
import { useLocation } from "wouter";
import { setPage } from "services/page";
import Price from "components/Price/Price";


export function ProductGridLoading(){
    const {loading} = useConfig();
    return (
        <>
            <div className="productGridLoading">
                <img alt="loading" src={loading}/>
            </div>
        </>
    );
}

export function ProductGrid({id=0, name='', price=0, date=0 }){
    const [,setLocation] = useLocation();
    const {img_url,store_path} = useConfig();

    const url = setPage(store_path,'product',[id,name]);

    return (
        <a href={url} className="productGrid" onClick={e=>{ e.preventDefault(); setLocation(url); }}>
            <div>
                <div>
                    <img alt="noImage" loading="lazy" src={img_url+`pid.php?p=${id}&s=280&t=${date}`}/>
                </div>
                <div></div>
                <div>
                    <Price price={price}/>
                    <div><span>{name.trim()}</span></div>
                </div>
            </div>
        </a>
    );
}