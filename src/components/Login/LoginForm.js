import React, { useRef, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { useConfig } from "context/ConfigContext";
import ReCAPTCHA from "react-google-recaptcha";
import { isEmail } from "services/functions.js";
import { useLanguage } from "context/LanguageContext";
import { login } from "services/user";
import styles from "./Login.module.scss";
import { useUser } from "context/UserContext";

export default function LoginForm({ fnSuccess, refBtnSubmit }){
    const form = useRef();
    const email = useRef();
    const password = useRef();
    const keep = useRef();
    const captcha = useRef();
    const loadingRef = useRef();
    const { api_url, google_captcha, google_captcha_invisible, loading } = useConfig();
    const captchaInvisible = true;
    const lang = useLanguage().language.components.login;
    const { user, setUser, setToken } = useUser();

    useEffect(()=>{
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));
    },[]);

    useEffect(()=>{
        const doTryLogin = document.addEventListener('click',async e =>{
            if(e.target!=refBtnSubmit.current || e.target.classList.contains('disabled')) return;
            e.target.classList.add('disabled');
            await tryLogin();
            e.target.classList.remove('disabled');
        });
        return () => document.removeEventListener('click',doTryLogin);
    });

    const tryLogin = async () => {
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));

        const d = {
            api_url,
            cart: user.cart,
            for_later: user.forLater,
            email: email.current.value.trim(),
            password: password.current.value.trim(),
            keep: keep.current.checked
        };

        let error = [];

        if(!isEmail(d.email)) error.push('email');
        if(d.password.length==0) error.push('password');
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
            
            const data = await login(d);

            captcha.current.reset();

            if(data.error.length==0){
                setToken(data.token);
                setUser(data.user);
                window.dispatchEvent(new Event('cart.update'));
                if(typeof fnSuccess !== 'undefined') fnSuccess();
            }
            else{
                let unknownError = false;
                data.error.forEach(e=>{
                    if(form.current.querySelector('.error_'+e)) form.current.querySelector('.error_'+e).classList.remove('hidden');
                    else unknownError = true;
                });
                if(unknownError) form.current.querySelector('.error_unknown').classList.remove('hidden');
                loadingRef.current.classList.add('hidden');
            }
        }
    }

    const emailKeyPress = (e) => { if(e.charCode===13) password.current.focus(); }
    const passwordKeyPress = async (e) => {
        if(e.charCode!==13) return;
        refBtnSubmit.current.classList.add('disabled');
        tryLogin();
        refBtnSubmit.current.classList.remove('disabled');
    }

    return (
        <>
            <Form ref={form}>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.email}</Form.Label>
                    <Form.Control ref={email} type="email" autoComplete="login-email" onKeyPress={emailKeyPress}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.password}</Form.Label>
                    <Form.Control ref={password} type="password" autoComplete="login-password" onKeyPress={passwordKeyPress}/>
                </Form.Group>
                <Alert variant="danger" className="mensaje_error error_login hidden">{lang.error.login}</Alert>
                <Form.Group className="mb-3">
                    <Form.Check 
                        type="checkbox"
                        label={lang.form.keep_login}
                        ref={keep}
                    />
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