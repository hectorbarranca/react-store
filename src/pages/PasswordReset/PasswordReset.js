import React, { useState, useEffect, useRef } from "react";
import { passwordResetCode } from "services/user";
import { getPage } from "services/page";
import { useConfig } from 'context/ConfigContext';
import { useLanguage } from "context/LanguageContext";
import { useLocation } from "wouter";
import Loading from "pages/Loading";
import { Form, Alert, Button } from "react-bootstrap";
import styles from './PasswordReset.module.scss';
import ReCAPTCHA from "react-google-recaptcha";
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'


export default () => {
    const form = useRef();
    const password = useRef();
    const captcha = useRef();
    const loadingRef = useRef();
    const [step,setStep] = useState(1);
    const {store_path, api_url, google_captcha, google_captcha_invisible, loading } = useConfig();
    const code = getPage(store_path, useLocation()[0]).data[0] || '';
    const lang = useLanguage().language.pages.password_reset;
    const {languageType} = useLanguage();
    const captchaInvisible = true;


    const tryChange = async () => {
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));

        const d = {
            api_url,
            code,
            lang: languageType,
            password: password.current.value.trim()
        };

        let error = [];

        if(d.password.length<8) error.push('password');
        if(error.length==0){
            d.captcha = captchaInvisible ? await captcha.current.executeAsync() : captcha.current.getValue()
            if(d.captcha===null || d.captcha.length==0){
                error.push('captcha');
                captcha.current.reset();
            }
        }

        if(error.length) error.forEach(e=>form.current.querySelector('.error_'+e).classList.remove('hidden'));
        else{
            loadingRef.current.classList.remove('hidden');
            
            const ok = await passwordResetCode(d);
            
            captcha.current.reset();
            
            if(ok===true) setStep(3);
            else if(ok===false) setStep(2);
            else{
                let unknownError = false;
                ok.forEach(e=>{
                    if(form.current.querySelector('.error_'+e)) form.current.querySelector('.error_'+e).classList.remove('hidden');
                    else unknownError = true;
                });
                if(unknownError) form.current.querySelector('.error_unknown').classList.remove('hidden');
                loadingRef.current.classList.add('hidden');
            }
        }
    }


    switch(step){
        case 1:
            return (<>
                <div className="text-center">
                    <Form ref={form} className={styles.form}>
                        <Form.Group className="mb-3">
                            <Form.Label>{lang.form.password}</Form.Label>
                            <Form.Control ref={password} type="password" autoComplete="login-password"/>
                            <Alert variant="danger" className="mensaje_error error_password hidden">{lang.error.password}</Alert>
                        </Form.Group>
                        <ReCAPTCHA
                            ref={captcha}
                            size={captchaInvisible ? 'invisible' : 'normal'}
                            sitekey={captchaInvisible ? google_captcha_invisible : google_captcha}
                        />
                        <Alert variant="danger" className="mensaje_error error_captcha hidden">{lang.error.captcha}</Alert>
                        <Alert variant="danger" className="mensaje_error error_unknown hidden">{lang.error.unknown}</Alert>
                        <div className="text-right">
                            <Button variant="warning" onClick={tryChange}><FontAwesomeIcon icon={faKey}/> {lang.btn.send}</Button>
                        </div>
                        <div className="recaptcha-terms">{parse(lang.captcha)}</div>
                        <div className={styles.loading_container+' hidden'} ref={loadingRef}><div><img src={loading}/></div></div>
                    </Form>
                </div>
            </>);
        
        case 2:
            return (<>
                <div className={styles.alert_container}>
                    <Alert variant="danger">
                        {lang.fail}
                    </Alert>
                </div>
            </>);
        
        case 3:
            return (<>
                <div className={styles.alert_container}>
                    <Alert variant="success">
                        {lang.success}
                    </Alert>
                </div>
            </>);
    }
}