import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import LoginForm from "../../Login/LoginForm";
import parse from 'html-react-parser';

export default ({ handleClose, handleShow, styles }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.header.login;

    return (
        <>
                <Modal.Header>
                    <Modal.Title>
                        <h4>{lang.title.login}</h4>
                    </Modal.Title>
                    <div className="modal-close" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/></div>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm fnSuccess={handleClose} refBtnSubmit={refBtnSubmit}/>
                    <div className="text-right">
                        <a className="form-explain link-block" onClick={()=>{ handleShow('password_reset') }}>{lang.show.password_reset}</a><br/>
                        <a className="form-explain link-block" onClick={()=>{ handleShow('new_user') }}>{lang.show.new_user}</a>
                    </div>
                    <div className={styles.recaptcha+" recaptcha-terms"}>{parse(lang.captcha)}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" ref={refBtnSubmit}><FontAwesomeIcon icon={faUser}/> {lang.btn.login}</Button>
                    <Button variant="secondary" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/> {lang.btn.close}</Button>
                </Modal.Footer>
        </>
    );
}