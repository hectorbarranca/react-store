import React, {useState,useEffect} from "react";
import { completeRegister } from "services/user";
import { getPage } from "services/page";
import { useConfig } from 'context/ConfigContext';
import { useLanguage } from "context/LanguageContext";
import { useLocation } from "wouter";
import Loading from "pages/Loading";
import { Alert} from "react-bootstrap";
import styles from './Register.module.scss';


export default () => {
    const [loading,setLoading] = useState(true);
    const [success,setSuccess] = useState(false);
    const {store_path, api_url} = useConfig();
    const code = getPage(store_path, useLocation()[0]).data[0] || '';
    const lang = useLanguage().language.pages.register;

    useEffect(()=>{
        completeRegister(api_url,code).then(e=>{
            setSuccess(e===true ? true : false);
            setLoading(false);
        });
    },[]);

    return loading ? <Loading/> : <>
        <div className={styles.alert_container}>
            <Alert variant={success ? "success" : "danger"}>
                {success ? lang.success : lang.fail}
            </Alert>
        </div>
    </>;
}