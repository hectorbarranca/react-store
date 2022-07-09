export default async (token='') => {
    const url = window.location.hostname=='localhost' ? 'http://localhost/MegaStore/Public/store/api/store.php' : '/store/api/store.php';
    let r = await fetch(url,{
        method: 'POST',
        body: JSON.stringify({
            t: token
        })
    });
    r = await r.json();
    return r;
}