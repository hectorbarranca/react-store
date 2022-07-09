import React from "react";
import { Alert} from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import parse from 'html-react-parser';
import { replaceAll } from "services/functions";

export default function NewUserSuccess({styles, email}){
    const lang = useLanguage().language.components.header.login;

    return (
        <>
            <h4>{lang.title.new_user_success}</h4>
            <Alert variant="success" className={styles.alert+" text-center"}>{parse(replaceAll('_=email=_',email,lang.new_user_success))}</Alert>
        </>
    );
}