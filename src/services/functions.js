export function line_to_array(ar){
    if(ar.length==0) return [];
    let r = [];
    let keys = ar.shift();
    for(let v of ar){
        let d = {};
        for(let i in keys) d[keys[i]] = v[i];
        r.push(d);
    }
    return r;
}


export function capitalize(text, toLowerCase=false){
    if(toLowerCase) text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}



export function textarea_to_html(text=''){
    return text.replace(/\n/g, '<br>\n');
}



export function fmoney(monto=0){
    if(!monto) return 0;
    monto = replaceAll(['$',' ',',','\''],['','','',''],monto);
    let c = monto.length;
    let punto = false;
    let r = '';
    for(let i=0 ; i<c ; i++){
        let ch = monto.charAt(i);
        if(ch=='-' && !r) r+=ch;
        else if(ch=='.' && !punto){ punto=true; r+=ch; }
        else if(ch=='0' || ch=='1' || ch=='2' || ch=='3' || ch=='4' || ch=='5' || ch=='6' || ch=='7' || ch=='8' || ch=='9') r+=ch;
        else return false;
    }
    if(!r || r=='-' || r=='.' || r=='-.') return 0;
    return parseFloat(r);
}



export function pmoney(monto=0,decimales=2,comas=true){
    monto = fmoney(monto);
    if(monto===false) return '';
    return '$ '+number_format(monto,decimales,'.',comas ? ',' : '');
}



export function replaceAll(search, replacement,text){
    text = String(text);
    if(Array.isArray(search)){
        for(let k in search) text = text.split(String(search[k])).join(String(replacement[k]));
        return text;
    }
    return text.split(String(search)).join(String(replacement));
}



export function number_format(number, decimals, dec_point, thousands_sep){
    number = String(number);

    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            let k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}



export function rnnumber(v){
    if(typeof v == 'object'){
        const current = v.value;
        const compare = String(current).replace(/\D/g,'');
        if(current!=compare) v.value = compare;
    }
    else return String(v).replace(/\D/g,'');
}



export function isEmail(email){
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-_]{2,4}$/;
    return (email.match(validEmail)==null) ? false : true;
}



export async function slideHide(target, duration=500){
    target.style.transitionProperty = 'height, margin, padding, opacity';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    const t = target.offsetHeight;
    target.style.opacity = '1';
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.style.opacity = 0;
    
    await sleep(duration);
    
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('opacity');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
}

export async function slideShow(target, duration=500){
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.style.opacity = 0;
    let t = target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding, opacity";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.opacity = 1;
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');

    await sleep(duration);

    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('opacity');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
}


export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}