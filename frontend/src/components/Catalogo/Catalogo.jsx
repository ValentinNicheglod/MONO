import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//Components imports | Importación de componentes
import {Filter} from "./Filter/Filter.jsx";
import {Footer} from "../Footer/Footer.jsx";
import {NavBar} from "./NavBar/NavBar.jsx";
import {Results} from "./SearchResults/Results.jsx";
import {Pagination} from "./Pagination/Pagination.jsx"

import "./Catalogo.css";

export const Catalogo = ({match}) => {

    const [products, setProducts] = useState();

    const location = useLocation();
    let prop = products; //Variable will be replaced depending on URL | La variable se reemplazará según la URL

    useEffect(() => {
        fetch(`http://localhost:3001/api/search${location.search}`)
        .then(res => res.json())
        .then(res => setProducts(res))
    }, []);

    //Copy of products | Copia de products
    const productsCopy = products && products.map(e => e);

    //Sort method | Metodo de ordenamiento
    productsCopy && productsCopy.sort((a, b) => { 
        if (a.total_price > b.total_price) return 1;
        if (a.total_price < b.total_price) return -1;
        return 0
    });

    //Prop value assignment by sort| Asignación de valor a prop por orden
    switch (match.params.sort) {
        case "menor": prop = productsCopy;
            break;

        case "mayor": prop = productsCopy && productsCopy.reverse();
            break;
    };

    //Filter by condition | Filtro por condición
    const newProduct = prop && prop.filter(e => e.condition === "new");
    const usedProduct = prop && prop.filter(e => e.condition === "used");
    
    //Filter by Shipping | Filtro por envío
    const freeShipping = prop && prop.filter(e => e.shipping.free === true);
    const pickUp = prop && prop.filter(e => e.shipping.pick_up === true);

    //Prop value assignment by filter | Asignación de valor a prop por filtro
    switch (match.params.filter) {
        case "nuevo": prop = newProduct;
            break;

        case "usado": prop = usedProduct;
            break;

        case "envio gratis": prop = freeShipping;
            break;
            
        case "pick up": prop = pickUp;
            break;
    };

    //Pagination | Paginación
    let  key, length, limit, pagination, propCopy;
    [key, limit, pagination] = [1, 30, {}];
    Object.defineProperty(pagination, key, {value: []});
    propCopy = prop && prop.map(e => e);
    length = propCopy && propCopy.length;
    
    for (let i = 0; i < length; i++) {
        if(i === limit) {
            key += 1;
            limit += 30;
            Object.defineProperty(pagination, key, {value: []})
        };
        pagination[key].push(propCopy[i]);
    };

    if (location.pathname === `/search/${match.params.sort}/${match.params.page}`) {
        prop = pagination[match.params.page]
    };

    console.log(window.location)
        
    //Price format | Formato de precio
    products && products.forEach(e => {
        const dot = e.price.toString().split(".");
        e.price = dot[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dot[1] ? "." + dot[1] : "");    
    });

    return(

        <div id="catalogo">
            <div className="row maxwidth">
                <NavBar />
            </div>
            <div
                className="row"
                id="resultpage"
            >
                <div className="col-md-3">
                    <Filter 
                        query={location.search}
                        name={products && products[0].title}
                    />
                </div>
                <div className="col-md-8">
                    <Results
                        products={prop}
                    />
                </div>
            </div>
            <div className="row d-flex justify-content-center">
                <Pagination 
                    pagination={pagination}
                />
            </div>
            <div className="row footer">
                <Footer />
            </div>
        </div>

    );
};