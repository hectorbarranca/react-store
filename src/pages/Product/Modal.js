import { Modal, Button } from "react-bootstrap";
import styles from './Modal.module.scss';
import { useLanguage } from "context/LanguageContext";
import { useConfig } from "context/ConfigContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faMagnifyingGlass, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { setPage } from "services/page";
import { useLocation } from "wouter";


export default ({pid, img, showModal}) => {
    const lang = useLanguage().language.pages.product;
    const {store_path,img_url} = useConfig();
    const pageCart = setPage(store_path,'cart');
    const [,setLocation] = useLocation();
    const url = img_url + 'pimg.php?i=';

    const modalClose = () => showModal(false);
    const goCart = () => setLocation(pageCart);

    return ( 
        <Modal show={true} size="md" className={styles.modal}>
            <Modal.Header>
                <Modal.Title>
                    <h4>{lang.title.cart_success}</h4>
                </Modal.Title>
                <div className="modal-close" onClick={modalClose}><FontAwesomeIcon icon={faTimes}/></div>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center"><img src={url+img} className={styles.img}/></div>
                <div className={styles.success}>{lang.cart_success}</div>
            </Modal.Body>
            <Modal.Footer>
                <div className={styles.modal_btns}>
                    <Button variant="warning" onClick={goCart}><FontAwesomeIcon icon={faCartShopping}/> {lang.btn.cart}</Button>
                    <Button variant="secondary" onClick={modalClose}><FontAwesomeIcon icon={faMagnifyingGlass}/> {lang.btn.search}</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}