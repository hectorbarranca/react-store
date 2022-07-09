class BrowserSession{
    constructor(name){
        this.name = name;

        this.#makeChanges();
 
        this.onChange = addEventListener("storage",()=>this.#makeChanges());
        addEventListener("beforeunload",()=>{
            removeEventListener("storage",this.onChange);
            localStorage.removeItem(this.name);
        });
    }

    get = () => localStorage.getItem(this.name);
    set = value => {
        localStorage.setItem(this.name,value);
        this.#makeChanges();
    }

    #makeChanges = () => {
        let local = localStorage.getItem(this.name);
        let session = sessionStorage.getItem(this.name);
        if(local===null && session!==null) localStorage.setItem(this.name,session);
        else if(local !== session) sessionStorage.setItem(this.name,local);
    }
}