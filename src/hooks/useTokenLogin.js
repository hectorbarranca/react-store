import { useState, useEffect } from "react";

export const useTokenLogin = () => {
    const [data,setData] = useState(null);

    useEffect(()=>{
        const checkToken = async(token)=>{
            let r = await fetch(`http://localhost/MegaStore/Public/sys/tk.php`,{
                method: 'POST',
                body: JSON.stringify({
                    t: token
                })
            });
            r = await r.json();
            setData(r);
        };

        if(!localStorage.getItem('token')) setData(-1);
        else checkToken(localStorage.getItem('token'));
    },[]);

    return data;
}