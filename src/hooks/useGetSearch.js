import { useLocation } from "wouter";
import { useConfig } from "context/ConfigContext";
import { getPage } from "services/page";

export default function useGetSearch(){
    let {page, data:search, get} = getPage(useConfig().store_path, useLocation()[0]);

    search = (page!='search' || search.length!=1) ? '' : search[0];

    const getDft = {
        'sort': 'relevant',
        'category': '0'
    };
    Object.keys(get).forEach(k=>{
        if(typeof getDft[k] == 'undefined') delete get.k;
    });
    get = {...getDft,...get};

    return {search, filter:get};
}