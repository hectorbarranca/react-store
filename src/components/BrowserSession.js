import React, {useState, useEffect, createContext, useMemo} from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const [lang,setLang] = useState(localStorage.getItem('language') || '');
    const [language,setLanguage] = useState({});
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        if(loading){
            getLanguage(lang).then(c=>{
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


/*import React, { useEffect } from "react";

function makeChanges(name, value, setValue){
    let local = localStorage.getItem(name);
    let session = sessionStorage.getItem(name);
    
    if(local===null && session!==null) localStorage.setItem(name,session);
    else if(local!==null && local!==session){
        session = local;
        sessionStorage.setItem(name,local);
    }

    if(local===null && session===null && typeof value == 'string'){
        localStorage.setItem(name,value);
        sessionStorage.setItem(name,value);
    }
    else if(session!==null && value!==session) setValue(session);
}

export default function BrowserSession([ name, value, setValue ]){
    useEffect()
}


class BrowserSession{
    constructor(name){
        this.name = name;

        this.#makeChanges();
 
        this.onChange = addEventListener("storage",()=>this.#makeChanges());
        addEventListener("beforeunload",()=>{
            removeEventListener("storage",this.onChange);
            localStorage.removeItem(this.name);
        });
    }

    get = () => localStorage.getItem(this.name);
    set = value => {
        localStorage.setItem(this.name,value);
        this.#makeChanges();
    }
}*/