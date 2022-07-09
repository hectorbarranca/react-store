import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook as btnSave, faTimes as btnCancel } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from "react-bootstrap";
import { useLanguage } from "context/LanguageContext";
import AddressForm from "./AddressForm";
import styles from "./Address.module.scss";
//import parse from 'html-react-parser';

export default ({ fnSuccess, handleClose, id=0 }) => {
    const refBtnSubmit = useRef();
    const lang = useLanguage().language.components.address;

    return (
        <>        
            <Modal show={true} size="md" className={styles.modal}>
                <Modal.Header>
                    <Modal.Title>
                        <h4>{id==0 ? lang.title.new : lang.title.edit}</h4>
                    </Modal.Title>
                    <div className="modal-close" onClick={handleClose}><FontAwesomeIcon icon={btnCancel}/></div>
                </Modal.Header>
                <Modal.Body>
                    <AddressForm fnSuccess={fnSuccess} refBtnSubmit={refBtnSubmit} id={id}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" ref={refBtnSubmit}><FontAwesomeIcon icon={btnSave}/> {lang.btn.new}</Button>
                    <Button variant="secondary" onClick={handleClose}><FontAwesomeIcon icon={btnCancel}/> {lang.btn.close}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}