import React, {useState, useEffect, createContext, useMemo} from "react";
import getSvg from "services/getSvg";
import getConfig from 'services/getConfig.js';

const ConfigContext = createContext();

export const ConfigProvider = ({children}) => {
    let lc = localStorage.getItem('storeConfig');
    try{ lc = JSON.parse(lc); } catch (e) { lc = {version:0}; }
    if(lc==null) lc = {version:0};

    const [config,setConfig] = useState(lc);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        getConfig(config.version).then(c=>{
            let newConfig = {...config, ...c};
            
            let icon = document.querySelector("link[rel~='icon']");
            if (!icon) {
                icon = document.createElement('link');
                icon.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(icon);
            }
            icon.href = newConfig.icon;

            let title = document.querySelector("title");
            if (!title) {
                title = document.createElement('title');
                document.getElementsByTagName('head')[0].appendChild(title);
            }
            title.innerText = newConfig.store_name;

            getSvg(newConfig.logo).then(c=>{
                newConfig.logo = c;
                getSvg(newConfig.logo_min).then(c=>{
                    newConfig.logo_min = c;
                    localStorage.setItem('storeConfig',JSON.stringify(newConfig));
                    setConfig(newConfig);
                    setLoading(false);
                });
            });
        });
    },[]);

    //Con esto evitamos que cuando el config se cambie se recarge, solo cuando loading se cambie se va a recargar
    const value = useMemo(()=>{
        return ({
            ...config,
            isLoading: loading
        });
    },[loading]);

    return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export const useConfig = ()=>{
    const context = React.useContext(ConfigContext);
    if(!context) throw new Error('no access to useConfig');
    return context;
}

export default ConfigContext;