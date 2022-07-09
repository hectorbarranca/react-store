import styles from './Login.module.scss';
import { useState } from "react";
import LoginForm from "./LoginForm";
import NewUser from "./NewUser";
import NewUserSuccess from "./NewUserSuccess";
import PasswordReset from "./PasswordReset";
import PasswordResetSuccess from "./PasswordResetSuccess";
import { useLocation } from "wouter";
import { useConfig } from "context/ConfigContext";
import { getPage, setPage } from "services/page";
import { useUser } from "context/UserContext";



function route({ show, setShow, styles, email, setEmail }){
    switch(show){
        case 'new_user': return <NewUser setShow={setShow}  styles={styles} setEmail={setEmail} />
        case 'new_user_success': return <NewUserSuccess setShow={setShow} styles={styles} email={email} />
        case 'password_reset': return <PasswordReset setShow={setShow} styles={styles} setEmail={setEmail} />
        case 'password_reset_success': return <PasswordResetSuccess setShow={setShow} styles={styles} email={email} />
        case 'login':
        default:
            return <LoginForm setShow={setShow} styles={styles} />
    }
}

export default function Login(){
    const [email,setEmail] = useState('');
    const [show,setShow] = useState('login');
    const {store_path} = useConfig();
    const {user} = useUser();
    const [location,setLocation] = useLocation();
    if(user.session && getPage(store_path,location).page=='login') setLocation(setPage(store_path,''));

    return (
        <div className="text-center">
            <div className={styles.form_container}>
                { route({ show, setShow, styles, email, setEmail }) }
            </div>
        </div>
    );
}