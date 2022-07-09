import { pmoney } from "services/functions";
import "./Price.scss";

export default function Price({price=0, className=""}){
    price = pmoney(price);
    let decimal = price.substring(price.length-2);
    let int = price.substring(0,price.length-3);

    return (
        <>
            <div className={"price-containter "+className}>
                <div className="price-int">{int}</div>
                <div className="price-decimal">{decimal}</div>
            </div>
        </>
    );
}