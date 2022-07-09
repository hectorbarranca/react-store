import React, { useRef, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { useConfig } from "context/ConfigContext";
import ReCAPTCHA from "react-google-recaptcha";
import { isEmail } from "services/functions.js";
import { useLanguage } from "context/LanguageContext";
import { passwordReset } from "services/user";
import styles from "./Login.module.scss";

export default function PasswordReset({ fnSuccess, refBtnSubmit, setEmail }){
    const form = useRef();
    const email = useRef();
    const captcha = useRef();
    const loadingRef = useRef();
    const { api_url, google_captcha, google_captcha_invisible, loading } = useConfig();
    const captchaInvisible = true;
    const lang = useLanguage().language.components.login;
    const {languageType} = useLanguage();

    useEffect(()=>{
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));
    },[]);

    useEffect(()=>{
        const doTryReset = document.addEventListener('click',async e =>{
            if(e.target!=refBtnSubmit.current || e.target.classList.contains('disabled')) return;
            e.target.classList.add('disabled');
            await tryReset();
            e.target.classList.remove('disabled');
        });
        return () => document.removeEventListener('click',doTryReset);
    });

    const tryReset = async () => {
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));

        const d = {
            api_url,
            lang: languageType,
            email: email.current.value.trim()
        };

        let error = [];

        if(!isEmail(d.email)) error.push('email');
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
            
            const ok = await passwordReset(d);

            captcha.current.reset();

            if(ok===true){
                setEmail(d.email);
                fnSuccess();
            }
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

    const emailKeyPress = async (e) => {
        if(e.charCode!==13) return;
        refBtnSubmit.current.classList.add('disabled');
        tryReset();
        refBtnSubmit.current.classList.remove('disabled');
    }

    return (
        <>
            <Form ref={form}>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.email}</Form.Label>
                    <Form.Control ref={email} type="email" autoComplete="login-email" onKeyPress={emailKeyPress}/>
                </Form.Group>
                <ReCAPTCHA
                    ref={captcha}
                    size={captchaInvisible ? 'invisible' : 'normal'}
                    sitekey={captchaInvisible ? google_captcha_invisible : google_captcha}
                />
                <Alert variant="danger" className="mensaje_error error_captcha hidden">{lang.error.captcha}</Alert>
                <Alert variant="danger" className="mensaje_error error_unknown hidden">{lang.error.unknown}</Alert>
            </Form>
            <div className={styles.loading_container+' hidden'} ref={loadingRef}><div><img src={loading}/></div></div>
        </>
    );
}