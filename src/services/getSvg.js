export default async function getSvg (url){
    let r = await fetch(url);
    return await r.text();
}