import React, {useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import NewUser from "components/Login/NewUser";
import parse from 'html-react-parser';

export default ({ setShow, styles, setEmail }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.header.login;
     
    const fnSuccess = () => setShow('new_user_success');

    return (
        <>
            <h4>{lang.title.new_user}</h4>
            <div className={styles.form_sub_container}>
                <NewUser fnSuccess={fnSuccess} refBtnSubmit={refBtnSubmit} setEmail={setEmail} />
                <a className="form-explain link-block" onClick={()=>{ setShow('login') }}>{lang.show.login}</a><br/>
                <a className="form-explain link-block" onClick={()=>{ setShow('password_reset') }}>{lang.show.password_reset}</a>
            </div>
            <div className="text-right">
                <Button variant="warning" ref={refBtnSubmit} className={styles.btnSubmit}><FontAwesomeIcon icon={faUser}/> {lang.btn.new_user}</Button>
            </div>
            <div className={"recaptcha-terms"}>{parse(lang.captcha)}</div>
        </>
    );
}