export default async (token='') => {
    const url = window.location.hostname=='localhost' ? 'https://sheeppie.com/store/api/store.php' : '/store/api/store.php';
    let r = await fetch(url,{
        method: 'POST',
        body: JSON.stringify({
            t: token
        })
    });
    r = await r.json();
    console.log(r);
    return r;
}