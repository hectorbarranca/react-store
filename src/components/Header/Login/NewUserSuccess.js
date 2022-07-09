import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Alert} from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import parse from 'html-react-parser';
import { replaceAll } from "services/functions";


export default function NewUserSuccess({handleClose, email}){
    const lang = useLanguage().language.components.header.login;

    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    <h4>{lang.title.new_user_success}</h4>
                </Modal.Title>
                <div className="modal-close" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/></div>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="success" className="text-center">{parse(replaceAll('_=email=_',email,lang.new_user_success))}</Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}><FontAwesomeIcon icon={faTimes}/> {lang.btn.close}</Button>
            </Modal.Footer>
        </>
    );
}