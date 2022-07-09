import React, {useState, useRef} from "react";
import styles from './Addresses.module.scss';
import AddressFormModal from "components/Address/AddressFormModal";

export default () => {
    return (
        <>
            <div>Direcciones</div>
            <AddressFormModal id={1}/>
        </>
    );
}