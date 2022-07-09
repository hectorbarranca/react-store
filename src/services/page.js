export function getPage(store_path='', page=''){
    page = page.replace(store_path,'');
    let data = '';
    let get = {};

    let search = window.location.search;
    if(search.indexOf('?')!==-1){
        let getString = search.substring(search.indexOf('?')+1);
        getString.split('&').forEach(ar=>{
            ar = ar.split('=');
            get[decodeURIComponent(ar.shift())] = decodeURIComponent(ar.join('='));
        });
    } 

    if(page.indexOf('/')!==-1){
        data = page.substring(page.indexOf('/',1)+1);
        page = page.substring(0,page.indexOf('/',1));
        data = data.length>0 ? data.split('/') : [];
        data.forEach(d=>d=decodeURIComponent(d));
    }

    return {page,data,get};
}



export function setPage(store_path='', path='', data=[], get={}){
    if(data.length==0) data = '';
    else{
        if(!Array.isArray(data)) data = [data];
        data.forEach(d=>d=encodeURIComponent(d));
        data = data.join('/');
    }

    let url = store_path+(path ? path+'/' : '')+data;
    
    if(Object.keys(get).length>0) url += '?'+Object.keys(get).map((key) => encodeURIComponent(key)+'='+encodeURIComponent(get[key])).join('&');
    
    return url;
}