import React, {useState} from "react";
import styles from './Home.module.scss';
import parse from 'html-react-parser';
import { useConfig } from 'context/ConfigContext';
import { useLanguage } from 'context/LanguageContext';
import { replaceAll } from "services/functions";

export default () => {
    const { banners, logo_png, logo_min_png } = useConfig();
    const lang = useLanguage().language.banners;

    let $banners = [];
    for(let k of Object.keys(banners)){
        let v = banners[k];
        v = replaceAll('_=logo=_',logo_png,v);
        v = replaceAll('_=logo_min=_',logo_min_png,v);
        if(typeof lang[k] != 'undefined'){
            for(let k2 of Object.keys(lang[k]))
                v = replaceAll(k2,lang[k][k2],v);
        }
        $banners.push(<div key={"banner_"+k}>{parse(v)}</div>);
    }

    return (
        <>
            <div className="banners">
                { $banners }
            </div>
        </>
    );
}