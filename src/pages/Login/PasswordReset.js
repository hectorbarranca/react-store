import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import parse from 'html-react-parser';
import PasswordReset from "components/Login/PasswordReset";

export default ({ setShow, styles, setEmail }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.header.login;

    const fnSuccess = () => setShow('password_reset_success');

    return (
        <>
            <h4>{lang.title.password_reset}</h4>
            <div className={styles.form_sub_container}>
                <PasswordReset fnSuccess={fnSuccess} refBtnSubmit={refBtnSubmit} setEmail={setEmail} />
                <a className="form-explain link-block" onClick={()=>{ setShow('login') }}>{lang.show.login}</a><br/>
                <a className="form-explain link-block" onClick={()=>{ setShow('new_user') }}>{lang.show.new_user}</a>
            </div>
            <div className="text-right">
                <Button variant="warning" ref={refBtnSubmit} className={styles.btnSubmit}><FontAwesomeIcon icon={faEnvelope}/> {lang.btn.password_reset}</Button>
            </div>
            <div className={"recaptcha-terms"}>{parse(lang.captcha)}</div>
        </>
    );
}