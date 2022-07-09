import React, { useRef, useEffect } from "react";
import { Form, Alert} from "react-bootstrap";
import { newUser } from "services/user";
import { useConfig } from "context/ConfigContext";
import ReCAPTCHA from "react-google-recaptcha";
import { isEmail } from "services/functions.js";
import { useLanguage } from "context/LanguageContext";
import styles from "./Login.module.scss";

export default function NewUser({fnSuccess, refBtnSubmit, setEmail}){
    const form = useRef();
    const email = useRef();
    const password = useRef();
    const name = useRef();
    const last_name = useRef();
    const captcha = useRef();
    const loadingRef = useRef();
    const {api_url, google_captcha, google_captcha_invisible,loading} = useConfig();
    const captchaInvisible = true;
    const lang = useLanguage().language.components.login;
    const {languageType} = useLanguage();

    useEffect(()=>{
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));
    },[]);

    useEffect(()=>{
        const doTryRegister = document.addEventListener('click',async e =>{
            if(e.target!=refBtnSubmit.current || e.target.classList.contains('disabled')) return;
            e.target.classList.add('disabled');
            await tryRegister();
            e.target.classList.remove('disabled');
        });
        return () => document.removeEventListener('click',doTryRegister);
    });

    const tryRegister = async () => {
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));

        const d = {
            api_url,
            lang: languageType,
            email: email.current.value.trim(),
            password: password.current.value.trim(),
            name: name.current.value.trim(),
            last_name: last_name.current.value.trim(),
        };
            
        let error = [];

        if(!isEmail(d.email)) error.push('email');
        if(d.password.length<8) error.push('password');
        if(d.name.length==0) error.push('name');
        if(d.last_name.length==0) error.push('last_name');
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
            
            const ok = await newUser(d);

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

    return (
        <>
            <Form ref={form}>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.email}</Form.Label>
                    <Form.Control ref={email} type="email" autoComplete="login-email"/>
                    <Alert variant="danger" className="mensaje_error error_email hidden">{lang.error.email}</Alert>
                    <Alert variant="danger" className="mensaje_error error_email_existing hidden">{lang.error.email_existing}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.password}</Form.Label>
                    <Form.Control ref={password} type="password" autoComplete="login-password"/>
                    <Alert variant="danger" className="mensaje_error error_password hidden">{lang.error.password}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.name}</Form.Label>
                    <Form.Control ref={name} type="text" autoComplete="given-name"/>
                    <Alert variant="danger" className="mensaje_error error_name hidden">{lang.error.name}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.last_name}</Form.Label>
                    <Form.Control ref={last_name} type="text" autoComplete="family-name"/>
                    <Alert variant="danger" className="mensaje_error error_last_name hidden">{lang.error.last_name}</Alert>
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