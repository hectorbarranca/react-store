import { line_to_array } from "./functions";

export async function getProduct( api_url='', product:string|number){
    let r:any = await fetch(api_url+'products.php',{
        method: 'POST',
        body: JSON.stringify({
            m: 'get',
            product
        })
    });
    r = await r.json();

    if(typeof r.notFound === 'undefined'){
        r.id = parseInt(r.id);
        r.stock = parseInt(r.stock);
        if(r.stock<0) r.stock = 0;
        r.status = parseInt(r.status);
        r.img.sort();
    }
    
    return r;
}



type argsSearchProducts = {
    api_url: string;
    search: string;
    filter?: any;
    products?: any;
    offset?: number;
    limit?: number;
    quantity?: number;
}
export async function searchProducts({ api_url, search, filter={}, products=[], offset=0, limit=100, quantity=-1 }: argsSearchProducts){    
    let r:any = await fetch(api_url+'products.php',{
        method: 'POST',
        body: JSON.stringify({
            m: 'search',
            search,
            offset,
            limit,
            filter
        })
    });
    r = await r.json();

    r.products = line_to_array(r.products);
    r.prices = line_to_array(r.prices);

    for(let k = r.products.length-1 ; k>=0 ; k--){
        let v = r.products[k];
        v.price = 0;
        for(let k2 in r.prices){
            if(r.prices[k2].id!=v.id) continue;
            v.price = parseFloat(r.prices[k2].price);
            r.prices.splice(k2,1);
            break;
        }
        if(v.price==0) r.products.splice(k,1);
    }
    delete r.prices;

    return r;
}


//NOTE that the products, offset, limit and quantity is the previus data send by this sistem
export async function searchProductsInfiniteScroll(d){
    d = {...{ products:[], offset:-1, limit:100, quantity:-1 },...d};

    d.offset = (d.offset==-1) ? 0 : d.offset+d.limit;
    if(d.quantity!=-1 && d.offset>d.quantity){
        d.max = true;
        return d;
    }

    let r = await searchProducts(d);
    
    let actual = d.products.map(p=>p.id);
    for(let p of r.products){
        if(actual.includes(p.id)) continue;
        d.products.push(p);
    }
    delete(r.products);
    d = {...d,...r};

    d.page = Math.round(r.offset/r.limit)+1;
    d.ofPages = Math.ceil(r.quantity/r.limit);
    d.max = (d.quantity<=d.offset+d.limit) ? true : false;

    return d;
}



export function getSearchProductsInfiniteScrollStorage(){
    let ls:any;
    try{ ls = JSON.parse(window.sessionStorage.getItem('search')); }
    catch{ ls = { search:'', filter:{}, list:{}, scroll:0 } }
    if(ls==null) ls = {};
    ls = {...{ search:'', filter:{}, list:{}, scroll:0 },...ls};
    return ls;
}



export function setSearchProductsInfiniteScrollStorage(d={}){
    let ls:any = getSearchProductsInfiniteScrollStorage();
    ls = {...ls,...d};
    window.sessionStorage.setItem('search',JSON.stringify(ls));
}