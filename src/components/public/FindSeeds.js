import React, { useEffect, useState } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function FindSeeds() {
    const baseUrl = 'http://localhost:8080/';
    const [availableSeeds, setAvailableSeeds] = useState([]);
    const listSeeds = availableSeeds && availableSeeds !== undefined && availableSeeds.length > 0 ? true : false;
    const [quantities, setQuantities] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [notifyLogIn, setNotifyLogIn] = useState(false);
    const hasCartItems = orderItems && orderItems.length > 0 ? true : false;
    const alertLogIn = notifyLogIn && hasCartItems ? 'alertLogIn' : 'hidden';
    const viewCart = !notifyLogIn && hasCartItems ? 'viewCart' : 'hidden';

    const getAllSeeds = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch(baseUrl + 'seeds', requestOptions)
            .then(response => response.json())
            .then(result => {
                filterSeeds(result);
            })
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const filterSeeds = (allSeeds) => {
        let filteredSeeds = allSeeds.filter(data => data.active && data.quantityAvailable > 50);
        setAvailableSeeds(filteredSeeds);
        setBaseQuantities(filteredSeeds);
    }

    const showAsCurrency = (amount) => {
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        return formatter.format(amount);
    }

    const setBaseQuantities = (filteredSeeds) => {
        let qtyArray = [];
        filteredSeeds.forEach(seed => {
            const baseQty = {
                itemId: seed.id,
                quantity: 1
            }
            qtyArray.push(baseQty);
        });
        setQuantities(qtyArray);
    }

    const updateQuantity = (id, iterator) => {
        let qtyArray = [];
        quantities.forEach(item => {
            if (id === item.itemId) {
                item.quantity = item.quantity + iterator;
                if (item.quantity < 0) {
                    item.quantity = 0;
                }
            }
            qtyArray.push(item);
        });
        setQuantities(qtyArray);
        qtyArray.forEach(element => {
            document.getElementById('qty' + element.itemId).value = element.quantity;
        });
    }

    const updateByEntry = (id, quantity) => {
        let qtyArray = [];
        quantities.forEach(item => {
            if (id === item.itemId) {
                item.quantity = parseInt(quantity);
                if (item.quantity < 0 || item.quantity === undefined || isNaN(item.quantity)) {
                    item.quantity = 0;
                }
            }
            qtyArray.push(item);
        });
        setQuantities(qtyArray);
        qtyArray.forEach(element => {
            document.getElementById('qty' + element.itemId).value = element.quantity;
        });
    }

    const getOrder = () => {
        let userOrder = sessionStorage.getItem('userOrder');
        if (userOrder) {
            let userOrderJson = JSON.parse(userOrder);
            let itemList = [];
            userOrderJson.forEach(item => {
                itemList.push({
                    'itemId': item.itemId,
                    'quantity': item.quantity,
                })
            });
            return itemList;
        }else{
            return [];
        }
    }

    const checkForOrder = () => {
        let order = getOrder();
        if (order.length > 0) {
            setOrderItems(order);
        }
    }

    const addItem = (id) => {
        let currentOrder = getOrder();
        let itemAdded = false;
        currentOrder.forEach(item => {
            if (id === item.itemId) {
                let additional = crossReference(quantities, 'itemId', item.itemId, 'quantity');
                item.quantity = item.quantity + additional;
                itemAdded = true;
            }
        });
        if (!itemAdded) {
            let newQuantity = crossReference(quantities, 'itemId', id, 'quantity');
            let newItem = {
                itemId: id,
                quantity: newQuantity
            }
            currentOrder.push(newItem);
        }
        setOrderItems(currentOrder);
        sessionStorage.setItem('userOrder', JSON.stringify(currentOrder));
    } 

    const crossReference = (list, sentKey, sentValue, returnKey) => {
        let returnItem;
        list.forEach(item => {
            if (sentValue && sentValue !== undefined) {
                if (item[sentKey].toString().toLowerCase() === sentValue.toString().toLowerCase()) {
                returnItem =  item[returnKey];
                }
            }
        });
        return returnItem;
    }

    const checkLoggedIn = () => {
        let requestOptions;
        let un = localStorage.getItem('userName');
        let token = localStorage.getItem('bearerToken');

        if (!un || un === '' || !token || token === '') {
            setNotifyLogIn(true);
        }else{
        let myHeaders = new Headers();
        myHeaders.append("bearerToken", token);

        requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        }

        fetch("http://localhost:8080/users/checkUserLevel/" + un, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.grantAccess !== true) {
                setNotifyLogIn(true);
            }
        })

    }

    useEffect(() => {
        getAllSeeds();
        checkLoggedIn();
        checkForOrder();
    }, [])

    return (
        <div className='pubPage'>
            <div className='navBar'>
                <NavBar/>
            </div>
            <div className='pubContent'>
            {/* <p>{JSON.stringify(availableSeeds)}</p> */}
            {/* <p>{JSON.stringify(quantities)}</p> */}
            {/* <p>{listSeeds.toString()}</p> */}
            <p className={alertLogIn}><Link to='/login'>Log in or create an account (it's easy) to view your cart.</Link></p>
            <p className={viewCart}><Link to='/shoppingcart'>View your cart</Link></p>
                <table>
                    {listSeeds ? availableSeeds.map((seed) => {
                        return (
                            <tr>
                                <td className='itemPadding'>[image]</td>
                                <td className='itemPadding'>{seed ? seed.name : ''}</td>
                                <td className='itemPadding'>{seed.price ? showAsCurrency(seed.price) : ''}</td>
                                <td className='itemPadding'><Link to='' onClick={()=>updateQuantity(seed.id, -1)}>-</Link>
                                    <input id={'qty' + seed.id} className='qtyInput' 
                                        defaultValue={crossReference(quantities, 'itemId', seed.id, 'quantity')}
                                        onChange={(e)=>{updateByEntry(seed.id, e.target.value)}}/>
                                    <Link to='' onClick={()=>updateQuantity(seed.id, 1)}>+</Link></td>
                                <td><Link to='' onClick={()=>{addItem(seed.id)}}>Add to Cart</Link></td>
                            </tr>
                        )
                    }): ''}
                </table>
            </div>
        </div>
    )
}

export default FindSeeds