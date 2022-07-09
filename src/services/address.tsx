import { line_to_array } from "./functions";


const dftAddress = {
    id: 0,
    full_name: '',
    telephone: '',
    address_line1: '',
    address_line2: '',
    address_line3: '',
    cp: '00000',
    preferred: false
};
//setAddress



type argsGetAddress = {
    api_url: string;
    token: string;
    session: string;
    id: number;
}
export async function getAddress({api_url, token, session, id}: argsGetAddress):Promise<any>{
    let r:any;
    try{
        r = await fetch(api_url+'address.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'getAddress',
                token,
                session,
                id
            })
        });
        r = await r.json();
        return {...dftAddress, ...r};
    }
    catch{
        return {...dftAddress};
    }
}



type argsSetAddress = {
    api_url: string;
    token: string;
    session: string;
    id: number;
    full_name: string;
    telephone: string;
    address_line1: string;
    address_line2: string;
    address_line3: string;
    cp: string;
    preferred: boolean;
}
export async function setAddress({api_url, token, session, id, full_name, telephone, address_line1, address_line2, address_line3, cp, preferred}: argsSetAddress):Promise<any>{
    let r:any;
    try{
        r = await fetch(api_url+'address.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'setAddress',
                token,
                session,
                id,
                full_name,
                telephone,
                address_line1,
                address_line2,
                address_line3,
                cp,
                preferred
            })
        });
        r = await r.json();
        return r.length>0 ? r : true;
    }
    catch{
        return ['unknown'];
    }
}