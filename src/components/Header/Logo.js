import React, { useState } from "react";
import getSvg from "services/getSvg";
import parse from 'html-react-parser';

export default ({url}={}) => {
    const [logo,setLogo] = useState('');
    getSvg(url).then(r=>setLogo(r));
    return (<>
        {parse(logo)}
    </>);
}