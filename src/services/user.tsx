import { line_to_array } from "./functions";



type argsNewUser = {
    api_url: string;
    lang: string;
    email: string;
    password: string;
    name: string;
    last_name: string;
    captcha: string;
}
export async function newUser({api_url, lang, email, password, name, last_name, captcha}: argsNewUser):Promise<boolean|string[]>{
    let r:any;
    password = window.btoa(password);
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'new',
                lang,
                email,
                password,
                name,
                last_name,
                captcha
            })
        });
        r = await r.json();
        return (r.data===true) ? true : r.error;
    }
    catch{
        return ['conexion'];
    }
}



export async function completeRegister(api_url:String, code:String){
    let r:any;
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'complete_register',
                code
            })
        });
        r = await r.json();
        return (r.data===true) ? true : r.error;
    }
    catch{
        return ['conexion'];
    }
}



type argsLogin = {
    api_url: string;
    email: string;
    password: string;
    keep: boolean;
    captcha: string;
    cart: any[];
    for_later: any[];
}
export async function login({api_url, email, password, keep, captcha, cart, for_later}: argsLogin):Promise<any>{
    let r:any;
    password = window.btoa(password);
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'login',
                email,
                password,
                keep,
                captcha,
                cart,
                for_later
            })
        });
        r = await r.json();
        for(let k of ['cart','forLater']){
            if(typeof r['user'][k] != 'undefined') r['user'][k] = line_to_array(r['user'][k]);
        }
        return r;
    }
    catch{
        return {
            'error': ['conection']
        };
    }
}



type argsLogout = {
    api_url: string;
    token: string;
    session: string;
}
export async function logout({ api_url, token, session }: argsLogout):Promise<any>{
    let r:any;
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'logout',
                token,
                session
            })
        });
        r = await r.json();
        return r;
    }
    catch{
        return {
            'error': ['conection']
        };
    }
}



type argsLoginByToken = {
    api_url: string;
    token: string;
}
export async function loginByToken({api_url, token}: argsLoginByToken):Promise<any>{
    let r:any;
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'login_by_token',
                token
            })
        });
        r = await r.json();
        for(let k of ['cart','forLater']){
            if(typeof r['user'][k] != 'undefined') r['user'][k] = line_to_array(r['user'][k]);
        }
        r.response = true;
        return r;
    }
    catch{
        return {
            'response': false
        };
    }
}



type argsPasswordReset = {
    api_url: string;
    lang: string;
    email: string;
    captcha: string;
}
export async function passwordReset({api_url, lang, email, captcha}: argsPasswordReset):Promise<any>{
    let r:any;
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'password_reset',
                lang,
                email,
                captcha
            })
        });
        r = await r.json();
        return (r.data===true) ? true : r.error;
    }
    catch{
        return ['conexion'];
    }
}



type argsPasswordResetCode = {
    api_url: string;
    password: string;
    code: string;
    captcha: string;
}
export async function passwordResetCode({api_url, password, code, captcha}: argsPasswordResetCode):Promise<any>{
    let r:any;
    password = window.btoa(password);
    try{
        r = await fetch(api_url+'user.php',{
            method: 'POST',
            body: JSON.stringify({
                m: 'password_reset_code',
                password,
                code,
                captcha
            })
        });
        r = await r.json();
        return (r.data===true) ? true : false;
    }
    catch{
        return ['conexion'];
    }
}