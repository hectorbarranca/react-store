import React, { useState } from "react";
import styles from "./Header.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import Login from './Login/Login';
import SearchBar from "./SearchBar";
//import Logo from "./Logo";
import { useConfig } from "context/ConfigContext";
import { useLocation } from "wouter";
import { setPage } from "services/page";
import { useUser } from "context/UserContext";
import { useLanguage } from "context/LanguageContext";
import { capitalize } from "services/functions";
import Dropdown from 'react-bootstrap/Dropdown';
import parse from 'html-react-parser';

export default function Header(props){
    const [showLogin,setShowLogin] = useState('');
    const handleCloseLogin = () => setShowLogin('');
    const {logo,logo_min,store_path} = useConfig();
    const [,setLocation] = useLocation();
    const { user, setLogout } = useUser();
    const lang = useLanguage().language.components.header;
    const userName = user.session ? capitalize(user.name.split(' ')[0],true) : lang.user.login;
    
    
    const handleShowLogin = () => setShowLogin('login');
    const pageHome = setPage(store_path,'');
    const pageAccount = setPage(store_path,'account');
    const pageCart = setPage(store_path,'cart');
    const pageOrders = setPage(store_path,'orders');
    const pageAddresses = setPage(store_path,'addresses');

    const btnAll = React.forwardRef(({ children, onClick }, ref) => (
        <button ref={ref} onClick={(e) => onClick(e) }>
            {children}
        </button>
    ));
    

    const btnLogin = React.forwardRef(({ children, onClick }, ref) => (
        <button ref={ref} onClick={(e) => { user.session ? onClick(e) : handleShowLogin(); }}>
            {children}
        </button>
    ));


    return (
        <>
            <header>
                <div className={styles.background}>
                    <div className={styles.grid}>
                        <div className={styles.grid_left}>
                            <a href={pageHome} onClick={e=>{ e.preventDefault(); setLocation(pageHome); }}>
                                <div className={styles.logo}>
                                    {parse(logo)}
                                </div>
                                <div className={styles.logo_min}>
                                    {parse(logo_min)}
                                </div>
                            </a>
                        </div>
                        <div className={styles.grid_middle}>
                            <div>
                                <SearchBar/>
                            </div>
                        </div>
                        <div className={styles.grid_right}>
                            <Dropdown className={styles.btn_all_continer}>
                                <Dropdown.Toggle as={btnAll}>
                                    <div className={styles.options}>
                                        <div><FontAwesomeIcon icon={faBars} style={{fontSize:"28px", color:"white", marginTop:"3px"}}/></div>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className={styles.dropdown}>
                                    { user.session ? <></> : <>
                                        <Dropdown.Item onClick={e=>{ e.preventDefault(); handleShowLogin(); }}>{lang.user.login}</Dropdown.Item>
                                    </> }
                                    <Dropdown.Item href={pageCart} onClick={e=>{ e.preventDefault(); setLocation(pageCart); window.dispatchEvent(new Event('cart.update')); }}>{lang.user.cart}</Dropdown.Item>
                                    { user.session ? <>
                                        <Dropdown.Item href={pageOrders} onClick={e=>{ e.preventDefault(); setLocation(pageOrders); }}>{lang.user.orders}</Dropdown.Item>
                                        <Dropdown.Item href={pageAddresses} onClick={e=>{ e.preventDefault(); setLocation(pageAddresses); }}>{lang.user.addresses}</Dropdown.Item>
                                        <Dropdown.Item href={pageAccount} onClick={e=>{ e.preventDefault(); setLocation(pageAccount); }}>{lang.user.account}</Dropdown.Item>
                                        <Dropdown.Item onClick={e=>{ e.preventDefault(); setLogout(); }}>{lang.user.logout}</Dropdown.Item>
                                    </> : <></> }
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown className={styles.login_container}>
                                <Dropdown.Toggle as={ btnLogin }>
                                    <div className={styles.login}>
                                        <div><FontAwesomeIcon icon={ faUser } style={{fontSize:"16px", color:"white"}}/></div>
                                        <div>{userName}</div>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className={ styles.dropdown }>
                                    <Dropdown.Item href={pageOrders} onClick={e=>{ e.preventDefault(); setLocation(pageOrders); }}>{lang.user.orders}</Dropdown.Item>
                                    <Dropdown.Item href={pageAddresses} onClick={e=>{ e.preventDefault(); setLocation(pageAddresses); }}>{lang.user.addresses}</Dropdown.Item>
                                    <Dropdown.Item href={pageAccount} onClick={e=>{ e.preventDefault(); setLocation(pageAccount); }}>{lang.user.account}</Dropdown.Item>
                                    <Dropdown.Item onClick={e=>{ e.preventDefault(); setLogout(); }}>{lang.user.logout}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <a href={pageCart} className={styles.cart_container} onClick={e=>{ e.preventDefault(); setLocation(pageCart); window.dispatchEvent(new Event('cart.update')); }}>
                                <div className={styles.cart}>
                                    <div><FontAwesomeIcon icon={faShoppingCart} style={{fontSize:"28px", color:"white", marginTop:"6px"}}/></div>
                                    <div className={styles.cart_num}>{user.cart.length ? user.cart.length : ''}</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <Login show={showLogin} handleClose={handleCloseLogin} handleShow={setShowLogin} styles={styles}/>
        </>
    );
}