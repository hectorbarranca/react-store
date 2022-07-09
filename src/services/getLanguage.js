export default async (api_url,lang='') => {
    const url = api_url+'language.php?lang='+lang;
    let r = await fetch(url);
    r = await r.json();
    return r;
}