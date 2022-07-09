import React, { useRef, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { useConfig } from "context/ConfigContext";
import { useLanguage } from "context/LanguageContext";
import styles from "./Address.module.scss";
import { useUser } from "context/UserContext";
import { rnnumber } from "services/functions";
import { setAddress, getAddress } from "services/address";


export default function LoginForm({ fnSuccess, refBtnSubmit, id=0 }){
    const form = useRef();
    const loadingRef = useRef();
    
    const input = {
        id: useRef(),
        full_name: useRef(),
        telephone: useRef(),
        address_line1: useRef(),
        address_line2: useRef(),
        address_line3: useRef(),
        cp: useRef(),
        preferred: useRef(),
    };

    const { api_url, loading } = useConfig();
    const { user, token } = useUser();
    const lang = useLanguage().language.components.address;

    useEffect(()=>{
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));
        if(id!=0){
            loadingRef.current.classList.remove('hidden');
            getAddress({
                api_url,
                token,
                session: user.session,
                id
            }).then(d=>{
                Object.keys(input).forEach(k=>{
                    if(k=='preferred') input[k].current.checked = d[k];
                    else input[k].current.value = d[k];
                })
                loadingRef.current.classList.add('hidden');
            });
        }
    },[]);

    useEffect(()=>{
        const inputCheck = document.addEventListener('input',async e =>{
            const i = e.target;
            if(i === input.cp.current) rnnumber(i);
        });

        const doTrySubmit = document.addEventListener('click',async e =>{
            if(e.target!=refBtnSubmit.current || e.target.classList.contains('disabled')) return;
            e.target.classList.add('disabled');
            await trySubmit();
            e.target.classList.remove('disabled');
        });

        return () =>{
            document.removeEventListener('click',inputCheck);
            document.removeEventListener('click',doTrySubmit);
        }
    });

    const trySubmit = async () => {
        form.current.querySelectorAll('.mensaje_error').forEach(e=>e.classList.add('hidden'));

        const d = {
            api_url,
            token,
            session: user.session,
        };
        Object.keys(input).forEach(k=>{
            if(k=='preferred') d[k] = input[k].current.checked;
            else if(k=='cp') d[k] = rnnumber(input[k].current.value.trim());
            else d[k] = input[k].current.value.trim();
        });

        let error = [];

        ['full_name','telephone','address_line1','address_line3'].forEach(i=>{
            if(d[i].length==0) error.push(i);
        });
        if(d.cp.length!=5) error.push('cp');
        
        if(error.length) error.forEach(e=>form.current.querySelector('.error_'+e).classList.remove('hidden'));
        else{
            loadingRef.current.classList.remove('hidden');
            
            const data = await setAddress(d);

            if(data===true){
                if(typeof fnSuccess !== 'undefined') fnSuccess();
            }
            else{
                let unknownError = false;
                data.forEach(e=>{
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
                <input type="hidden" value={id} ref={input.id}/>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.full_name}</Form.Label>
                    <Form.Control ref={input.full_name} type="text" autoComplete="name"/>
                    <Alert variant="danger" className="mensaje_error error_full_name hidden">{lang.error.full_name}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.telephone}</Form.Label>
                    <Form.Control ref={input.telephone} type="text" autoComplete="tel-national"/>
                    <Alert variant="danger" className="mensaje_error error_telephone hidden">{lang.error.telephone}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.address_line1}</Form.Label>
                    <Form.Control ref={input.address_line1} type="text" autoComplete="address-line1"/>
                    <Alert variant="danger" className="mensaje_error error_address_line1 hidden">{lang.error.address_line1}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.address_line2}</Form.Label>
                    <Form.Control ref={input.address_line2} type="text" autoComplete="address-line2"/>
                    <Alert variant="danger" className="mensaje_error error_address_line2 hidden">{lang.error.address_line2}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.cp}</Form.Label>
                    <Form.Control ref={input.cp} type="text" autoComplete="postal-code"/>
                    <Alert variant="danger" className="mensaje_error error_cp hidden">{lang.error.cp}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.form.address_line3}</Form.Label>
                    <Form.Control ref={input.address_line3} type="text" autoComplete="address-line3"/>
                    <Alert variant="danger" className="mensaje_error error_address_line3 hidden">{lang.error.address_line3}</Alert>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check 
                        type="checkbox"
                        label={lang.form.preferred}
                        ref={input.preferred}
                    />
                </Form.Group>
                <Alert variant="danger" className="mensaje_error error_unknown hidden">{lang.error.unknown}</Alert>
            </Form>
            <div className={styles.loading_container+' hidden'} ref={loadingRef}><div><img src={loading}/></div></div>
        </>
    );
}