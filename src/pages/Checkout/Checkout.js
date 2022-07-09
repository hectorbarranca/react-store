import React, {useState} from "react";
import styles from './Checkout.module.scss';

export default () => {
    const [list,setList] = useState(JSON.parse(sessionStorage.getItem('checkout') || '[]'));
    const [loading,setLoading] = useState(true);
    
    return (
        <>
            <span>Checkout</span>
        </>
    );
}