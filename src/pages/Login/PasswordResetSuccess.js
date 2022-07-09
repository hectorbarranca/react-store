import React from "react";
import { Alert} from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import parse from 'html-react-parser';
import { replaceAll } from "services/functions";

export default ({styles, email}) => {
    const lang = useLanguage().language.components.header.login;

    return (
        <>
            <h4>{lang.title.password_reset_success}</h4>
            <Alert variant="success" className={styles.alert+" text-center"}>{parse(replaceAll('_=email=_',email,lang.password_reset_success))}</Alert>
        </>
    );
}