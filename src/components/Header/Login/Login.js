import React, {useState} from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import NewUser from "./NewUser";
import NewUserSuccess from "./NewUserSuccess";
import PasswordReset from "./PasswordReset";
import PasswordResetSuccess from "./PasswordResetSuccess";

function route({ show, handleShow, handleClose, styles, email, setEmail }){
    switch(show){
        case 'login': return <LoginForm handleShow={handleShow} handleClose={handleClose} styles={styles} />
        case 'password_reset': return <PasswordReset handleShow={handleShow} handleClose={handleClose} styles={styles} setEmail={setEmail} />
        case 'new_user': return <NewUser handleShow={handleShow} handleClose={handleClose} styles={styles} setEmail={setEmail} />
        case 'new_user_success': return <NewUserSuccess handleShow={handleShow} handleClose={handleClose} styles={styles} email={email} />
        case 'password_reset_success': return <PasswordResetSuccess handleShow={handleShow} handleClose={handleClose} styles={styles} email={email} />
    }
}

export default function Login({ show, handleShow, handleClose, styles}){
    const [email,setEmail] = useState('');
    
    return show ? (
        <Modal show={true} size="sm" className={styles.modal}>
            { route({ show, handleShow, handleClose, styles, email, setEmail }) }
        </Modal>
    ) : <></>;
}