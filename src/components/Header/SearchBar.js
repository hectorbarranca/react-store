import React, { useRef, useEffect } from "react";
import useGetSearch from "hooks/useGetSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useConfig } from "context/ConfigContext";
import { useLocation } from "wouter";
import { setPage } from "services/page";
import { useLanguage } from "context/LanguageContext";

export default function SearchBar(){
    let inputRef = new useRef();
    const {store_path} = useConfig();
    const [,setLocation] = useLocation();
    const lang = useLanguage().language.components.header.searchbar;

    const searchVal = useGetSearch();

    const search = ()=>{
        let s = inputRef.current.value.trim();
        if(s && s!=searchVal.search) setLocation(setPage(store_path,'search',s));
    }

    const keyPress = (e) => { if(e.charCode===13) search(); }

    useEffect(()=>{ if(inputRef.current) inputRef.current.value = searchVal.search; },[searchVal.search]);

    return (
        <>
            <div className="input-group">
                <input type="search" placeholder={lang.placeholder} maxLength="126" className="form-control shadow-none" id="header_search" onKeyPress={keyPress} ref={inputRef} defaultValue={searchVal.search}/>
                <button className="btn btn-light btn_search" onClick={search}><FontAwesomeIcon icon={faSearch}/></button>
            </div>
        </>
    );
}