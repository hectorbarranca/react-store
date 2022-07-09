import { useConfig } from "context/ConfigContext";
import React from "react";

export default ()=>{
    const {loading} = useConfig();
    return (
        <>
            <div className="pageLoading">
                <div>
                    <img src={loading}/>
                </div>
            </div>
        </>
    );
}