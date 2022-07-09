import React, { useState, useEffect } from "react";
import useGetSearch from "hooks/useGetSearch";
import NotFound from "pages/NotFound";
import Loading from "pages/Loading";
import { searchProductsInfiniteScroll, getSearchProductsInfiniteScrollStorage, setSearchProductsInfiniteScrollStorage } from "services/getProduct";
import NoResults from "./NoResults";
import {ProductGrid, ProductGridLoading} from "components/ProductGrid/ProductGrid";
import { useConfig } from 'context/ConfigContext';
import InfiniteScroll from "react-infinite-scroll-component";

export default function Search(){
    let ls = getSearchProductsInfiniteScrollStorage();
    const [search,setSearch] = useState(ls.search);
    const [filter,setFilter] = useState(ls.filter);
    const [loading,setLoading] = useState(false);
    const [list,setList] = useState(ls.list);
    const {api_url} = useConfig();
    
    useEffect(()=>{
        let ls = getSearchProductsInfiniteScrollStorage();
        try{ window.scrollTo(0,ls.scroll); } catch {}
    },[]);


    useEffect(()=>{
        const searchScroll = ()=> setSearchProductsInfiniteScrollStorage({scroll:window.scrollY});

        window.addEventListener('scroll', searchScroll );
        return () => window.removeEventListener('scroll',searchScroll);
    });

    
    useEffect(()=>{
        if(loading){
            searchProductsInfiniteScroll({ api_url, search, filter, ...list}).then( l=>{
                setList(l);
                setLoading(false);
                setSearchProductsInfiniteScrollStorage({search, filter, list:l, scroll:window.scrollY});
            });
        }
    },[loading]);
    
    let actualSearch = useGetSearch();
    if(search!=actualSearch.search || JSON.stringify(filter)!=JSON.stringify(actualSearch.filter)){
        setList({});
        setSearch(actualSearch.search);
        setFilter(actualSearch.filter);
        setLoading(true);
        setSearchProductsInfiniteScrollStorage({search:'',filter:{},list:{},scroll:0});
    }

    const moreProducts = ()=>{
        setLoading(true);
    }
    
    if(!search || (!loading && typeof list.products==='undefined')) return (<><NotFound/></>);
    return (
        <>
            {(loading && typeof list.products==='undefined') ? <Loading/> : <></>}
            {typeof list.products==='undefined' ? <></> : (
                list.quantity==0 ? <NoResults/>
                :
                <InfiniteScroll className="productGridContainer" dataLength={list.products.length} next={moreProducts} hasMore={list.max ? false : true} loader={<ProductGridLoading/>}>
                    { list.products.map(p=> <ProductGrid key={p.id} {...p} />) }
                </InfiniteScroll>
            )}
        </>
    );
}