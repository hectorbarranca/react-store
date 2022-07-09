import React, {useState, useEffect} from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

export default function SelectQuantity({min=1, max=1, dft=null, className="", setQuantity}){
    const [value,setValue] = useState(dft===null ? min : dft);

    if(value<min) setValue(min);
    else if(value>max) setValue(max);

    useEffect(()=>{
        setQuantity(value);
    },[value]);

    const items = [];
    for(let i = min; i<=max; i++) items.push( <Dropdown.Item key={i} onClick={()=>{ setValue(i); }}>{ i }</Dropdown.Item> );

    return (
        <DropdownButton className={className} variant="default" title={value}>
            { items }
        </DropdownButton>
    )
}