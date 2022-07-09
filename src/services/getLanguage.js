export default async (lang='') => {
    const url = window.location.hostname=='localhost' ? 'http://localhost/MegaStore/Public/store/api/language.php?lang='+lang : '/store/api/language.php?lang='+lang;
    let r = await fetch(url);
    r = await r.json();
    return r;
}