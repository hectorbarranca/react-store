import React from "react";

export default function NoResult(){
    return (
        <div className="text-center" style={{marginTop:'20px'}}>
            <div className="alert alert-warning" style={{display:'inline-block'}}>No hay resultados de busqueda</div>
        </div>
    );
}