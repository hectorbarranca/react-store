import React, {useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button} from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import NewUser from "components/Login/NewUser";
import parse from 'html-react-parser';

export default ({ handleClose, handleShow, styles, setEmail }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.header.login;
     
    const fnSuccess = () => handleShow('new_user_success');

    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    <h4>{lang.title.new_user}</h4>
                </Modal.Title>
                <div className="modal-close" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/></div>
            </Modal.Header>
            <Modal.Body className="login_newUser">
                <NewUser fnSuccess={fnSuccess} refBtnSubmit={refBtnSubmit} setEmail={setEmail} />
                <div className="text-right">
                    <a className="form-explain link-block" onClick={()=>{ handleShow('login') }}>{lang.show.login}</a><br/>
                    <a className="form-explain link-block" onClick={()=>{ handleShow('password_reset') }}>{lang.show.password_reset}</a>
                </div>
                <div className={styles.recaptcha+" recaptcha-terms"}>{parse(lang.captcha)}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="warning" ref={refBtnSubmit}><FontAwesomeIcon icon={faUser}/> {lang.btn.new_user}</Button>
                <Button variant="secondary" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/> {lang.btn.close}</Button>
            </Modal.Footer>
        </>
    );
}