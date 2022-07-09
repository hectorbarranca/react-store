import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import LoginForm from "components/Login/LoginForm";
import parse from 'html-react-parser';


export default ({ setShow, styles }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.header.login;

    return (
        <>
            <h4>{lang.title.login}</h4>
            <div className={styles.form_sub_container}>
                <LoginForm refBtnSubmit={refBtnSubmit}/>
                <a className="form-explain link-block" onClick={()=>{ setShow('password_reset') }}>{lang.show.password_reset}</a><br/>
                <a className="form-explain link-block" onClick={()=>{ setShow('new_user') }}>{lang.show.new_user}</a>
            </div>
            <div className="text-right">
                <Button variant="warning" ref={refBtnSubmit} className={styles.btnSubmit}><FontAwesomeIcon icon={faUser}/> {lang.btn.login}</Button>
            </div>
            <div className={"recaptcha-terms"}>{parse(lang.captcha)}</div>
        </>
    );
}