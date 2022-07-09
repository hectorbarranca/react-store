import React, {useState, useEffect, createContext, useMemo} from "react";


import getLanguage from 'services/getLanguage.js';

const LanguageContext = createContext();

export const LanguageProvider = ({children, api_url}) => {
    const [lang,setLang] = useState(localStorage.getItem('language') || '');
    const [language,setLanguage] = useState({});
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        if(loading){
            getLanguage(api_url,lang).then(c=>{
                localStorage.setItem('language',c.lang);
                setLang(c.lang);
                setLanguage(c.data);
                setLoading(false);
            });
        }
    },[loading]);

    const changeLanguage = (newLang) => {
        if(newLang!=lang){
            setLang(newLang);
            setLoading(true);
        }
    }

    //Con esto evitamos que cuando el config se cambie se recarge, solo cuando loading se cambie se va a recargar
    const value = useMemo(()=>{
        return ({
            language,
            languageType: lang,
            isLoading: loading,
            changeLanguage
        });
    },[loading]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = ()=>{
    const context = React.useContext(LanguageContext);
    if(!context) throw new Error('no access to useLanguage');
    return context;
}

export default LanguageContext;