import { line_to_array } from "./functions";



type argsRemoveCart = {
    api_url: string;
    token: string;
    session: string;
    product: number;
}
export async function removeCart({ api_url, token, session, product }: argsRemoveCart):Promise<boolean>{
    let r:any;
    try{
        await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'remove_cart',
                token,
                session,
                product
            })
        });
        return true;
    }
    catch{
        return false;
    }
}



type argsAddCart = {
    api_url: string;
    token: string;
    session: string;
    product: number;
    quantity: number;
    date: number;
}
export async function addCart({ api_url, token, session, product, quantity, date }: argsAddCart):Promise<boolean>{
    let r:any;
    try{
        await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'add_cart',
                token,
                session,
                product,
                quantity,
                date
            })
        });
        return true;
    }
    catch{
        return false;
    }
}



type argsGetCart = {
    api_url: string;
    token: string;
    session: string;
}
export async function getCart({ api_url, token, session }: argsGetCart):Promise<any>{
    let r:any;
    try{
        let r = await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'get_cart',
                token,
                session
            })
        });
        r = await r.json();
        if(typeof r !== 'object') return false;

        Object.keys(r).forEach(k=>r[k]=line_to_array(r[k]));

        const product = {};
        for(let p of r['product']) product[p.id] = p;
        for(let p of r['price']) product[p.id].price = parseFloat(p.price);

        r['product'] = product;
        delete r['price'];

        return r;
    }
    catch{
        return false;
    }
}



type argsGetCartNoSession = {
    api_url: string;
    cart: any[];
    forLater: any[];
}
export async function getCartNoSession({ api_url, cart, forLater }: argsGetCartNoSession):Promise<any>{
    let r:any;
    try{
        let r = await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'get_cart_no_session',
                cart,
                forLater
            })
        });
        r = await r.json();
        if(typeof r !== 'object') return false;

        Object.keys(r).forEach(k=>r[k]=line_to_array(r[k]));
        
        const product = {};
        for(let p of r['product']) product[p.id] = p;
        for(let p of r['price']) product[p.id].price = parseFloat(p.price);

        r['product'] = product;
        delete r['price'];

        return r;
    }
    catch{
        return false;
    }
}



type argsAddForLater = {
    api_url: string;
    token: string;
    session: string;
    product: number;
    date: number;
}
export async function addForLater({ api_url, token, session, product, date }: argsAddForLater):Promise<boolean>{
    let r:any;
    try{
        await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'add_for_later',
                token,
                session,
                product,
                date
            })
        });
        return true;
    }
    catch{
        return false;
    }
}



type argsRemoveForLater = {
    api_url: string;
    token: string;
    session: string;
    product: number;
    date: number;
}
export async function removeForLater({ api_url, token, session, product, date }: argsRemoveForLater):Promise<boolean>{
    let r:any;
    try{
        await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'remove_for_later',
                token,
                session,
                product,
                date
            })
        });
        return true;
    }
    catch{
        return false;
    }
}



type argsRestoreForLater = {
    api_url: string;
    token: string;
    session: string;
    product: number;
    date: number;
}
export async function restoreForLater({ api_url, token, session, product, date }: argsRestoreForLater):Promise<boolean>{
    let r:any;
    try{
        await fetch(api_url+'cart.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'restore_for_later',
                token,
                session,
                product,
                date
            })
        });
        return true;
    }
    catch{
        return false;
    }
}