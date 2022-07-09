import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import parse from 'html-react-parser';
import PasswordReset from "../../Login/PasswordReset";

export default ({ handleClose, handleShow, styles, setEmail }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.header.login;

    const fnSuccess = () => handleShow('password_reset_success');

    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    <h4>{lang.title.password_reset}</h4>
                </Modal.Title>
                <div className="modal-close" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/></div>
            </Modal.Header>
            <Modal.Body>
                <PasswordReset fnSuccess={fnSuccess} refBtnSubmit={refBtnSubmit} setEmail={setEmail} />
                <div className="text-right">
                    <a className="form-explain link-block" onClick={()=>{ handleShow('login') }}>{lang.show.login}</a><br/>
                    <a className="form-explain link-block" onClick={()=>{ handleShow('new_user') }}>{lang.show.new_user}</a>
                </div>
                <div className={styles.recaptcha+" recaptcha-terms"}>{parse(lang.captcha)}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="warning" ref={refBtnSubmit}><FontAwesomeIcon icon={faEnvelope}/> {lang.btn.password_reset}</Button>
                <Button variant="secondary" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/> {lang.btn.close}</Button>
            </Modal.Footer>
        </>
    );
}