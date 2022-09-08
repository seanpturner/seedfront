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
    const [allPlants, setAllPlants] = useState([]);
    const listPlants = allPlants && allPlants !== undefined && allPlants.length > 0 ? true : false;
    const [selectedSeed, setSelectedSeed] = useState(null);
    const singleModal = selectedSeed ? 'singleModal' : 'hidden';
    const [itemAdded, setItemAdded] = useState('hidden');
    const [toastInfo, setToastInfo] = useState({});

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

    const getAllPlants = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
          fetch(baseUrl + 'plants', requestOptions)
            .then(response => response.json())
            .then(result => {
                setAllPlants(result);
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
        let nonZero = false;
        currentOrder.forEach(item => {
            if (id === item.itemId) {
                let additional = crossReference(quantities, 'itemId', item.itemId, 'quantity');
                if (additional > 0) {
                    nonZero = true;
                    item.quantity = item.quantity + additional;
                    itemAdded = true;
                }
            }
        });
        if (!itemAdded) {
            let newQuantity = crossReference(quantities, 'itemId', id, 'quantity');
            if (newQuantity > 0) {
                nonZero = true;
                let newItem = {
                itemId: id,
                quantity: newQuantity
                }
                currentOrder.push(newItem);
            }
            
        }
        if (nonZero) {
            toastAdded(id);
            setOrderItems(currentOrder);
            sessionStorage.setItem('userOrder', JSON.stringify(currentOrder));
        }
        
    }

    const toastAdded = (id) => {
        setToastInfo({
            item: crossReference(availableSeeds, 'id', id, 'name'),
            quantity: crossReference(quantities, 'itemId', id, 'quantity')
        })
        setItemAdded('itemAdded');
        setTimeout(() => {
            setItemAdded('hidden');
        }, 1000);
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
        getAllPlants();
        checkLoggedIn();
        checkForOrder();
        // eslint-disable-next-line
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
                <div className='itemsDiv'>
                    <p className={alertLogIn}><Link to='/login'>Log in or create an account (it's easy) to view your cart.</Link></p>
                    <p className={viewCart}><Link to='/shoppingcart'>View your cart</Link></p>
                    <table className='detailText'>
                        <tr className='boldText grayText centerText publicColumnHeading'>
                            <td className='itemPadding alertRedText'>Seed</td>
                            <td className='itemPadding alertRedText'>Mother</td>
                            <td/>
                            <td className='itemPadding alertRedText'>Father</td>
                        </tr>
                        {listSeeds && listPlants ? availableSeeds.map((seed) => {
                            return (
                                <tr className='itemRow'>
                                    {/* seed */}
                                    <td className='itemPadding topAlignItemTableRow centerText'>
                                        <Link to='' onClick={()=>{setSelectedSeed(seed)}}><p className='publicSeedName'>{seed ? seed.name : ''}</p></Link>
                                        <p className='publicPriceText'>{seed.price ? showAsCurrency(seed.price) : ''}</p>
                                        <Link to='' onClick={()=>updateQuantity(seed.id, -1)}>- </Link>
                                        <input id={'qty' + seed.id} className='qtyInput' 
                                            defaultValue={crossReference(quantities, 'itemId', seed.id, 'quantity')}
                                            onChange={(e)=>{updateByEntry(seed.id, e.target.value)}}/>
                                        <Link to='' onClick={()=>updateQuantity(seed.id, 1)}> +</Link><br/>
                                        <Link className='addItem' to='' onClick={()=>{addItem(seed.id)}}>Add to Cart</Link>
                                    </td>
                                    {/* mother */}
                                    <td className='itemPadding leftAlignColumn topAlignItemTableRow'>
                                        <tr>
                                            <td className='leftAlignColumn centerText'>{crossReference(allPlants, 'id', seed.mother, 'name')}</td>
                                        </tr>
                                        <tr>
                                            <td className='leftAlignColumn'>
                                                <Link to='' onClick={()=>{setSelectedSeed(seed)}}>
                                                    <img className='itemThumb' alt='Mother plant' src={(crossReference(allPlants, 'id', seed.mother, 'image'))}/>
                                                </Link><br/>
                                            </td>
                                        </tr>
                                    </td>
                                    {/* <td className='itemPadding'><span>Mother:</span><br/>{crossReference(allPlants, 'id', seed.mother, 'name')}</td> */}
                                    <td className='itemPadding col6vw'>{crossReference(allPlants, 'id', seed.mother, 'notes').toString().replaceAll(',', ', ')}</td>
                                    {/* father */}
                                    <td className='itemPadding leftAlignColumn'>
                                        <tr>
                                            <td className='leftAlignColumn centerText'>{crossReference(allPlants, 'id', seed.father, 'name')}</td>
                                        </tr>
                                        <tr>
                                            <td className='leftAlignColumn'>
                                                <Link to='' onClick={()=>{setSelectedSeed(seed)}}>
                                                    <img className='itemThumb' alt='Father plant' src={(crossReference(allPlants, 'id', seed.father, 'image'))}/>
                                                </Link><br/>
                                            </td>
                                        </tr>
                                    </td>
                                    <td className='itemPadding col6vw'>{crossReference(allPlants, 'id', seed.father, 'notes').toString().replaceAll(',', ', ')}</td>
                                    {/* <td className='itemPadding'>{crossReference(allPlants, 'id', seed.father, 'notes').toString()}</td> */}
                                    {/* <td className='itemPadding'><Link to='' onClick={()=>{setSelectedSeed(seed)}}><h2>{seed ? seed.name : ''}</h2></Link></td> */}
                                    {/* <td className='itemPadding'><h2 className='grayText'>{seed.price ? showAsCurrency(seed.price) : ''}</h2></td> */}
                                    {/* <td className='itemPadding centerText'>
                                        <h2 className='grayText'>{seed.price ? showAsCurrency(seed.price) : ''}</h2>
                                        <Link to='' onClick={()=>updateQuantity(seed.id, -1)}>- </Link>
                                        <input id={'qty' + seed.id} className='qtyInput' 
                                            defaultValue={crossReference(quantities, 'itemId', seed.id, 'quantity')}
                                            onChange={(e)=>{updateByEntry(seed.id, e.target.value)}}/>
                                        <Link to='' onClick={()=>updateQuantity(seed.id, 1)}> +</Link><br/>
                                        <Link to='' onClick={()=>{addItem(seed.id)}}>Add to Cart</Link>
                                    </td> */}
                                </tr>
                            )
                        }): ''}
                    </table>
                </div>
                <div className={singleModal}>
                    <p className='publicSeedName centerText'>{selectedSeed?.name}</p>
                    {!selectedSeed || selectedSeed === undefined ? <br/> : (
                    <table>
                        <tr className='topAlignTableRow'>
                        <td className='itemPadding'>
                            <img className='itemImage' alt='Mother plant' src={(crossReference(allPlants, 'id', selectedSeed.mother, 'image'))}/><br/>
                            Mother:<br/>
                            {(crossReference(allPlants, 'id', selectedSeed.mother, 'name'))}
                        </td>
                        <td className='itemPadding'>
                            <img className='itemImage' alt='Father plant' src={(crossReference(allPlants, 'id', selectedSeed.father, 'image'))}/><br/>
                            Father:<br/>
                            {(crossReference(allPlants, 'id', selectedSeed.father, 'name'))}
                        </td>
                        <td className='itemPadding col20vw'>
                            <p>{crossReference(allPlants, 'id', selectedSeed.mother, 'name') + ':'}</p>
                            <p>{crossReference(allPlants, 'id', selectedSeed.mother, 'notes').toString().replaceAll(',', ', ')}</p>
                        </td>
                        <td className='itemPadding col20vw'>
                        <p>{crossReference(allPlants, 'id', selectedSeed.father, 'name') + ':'}</p>
                            <p>{crossReference(allPlants, 'id', selectedSeed.father, 'notes').toString().replaceAll(',', ', ')}</p>
                        </td>
                        </tr>
                    </table>)
                    }
                    {/* <Link to='' onClick={()=>updateQuantity(selectedSeed.id, -1)}>- </Link>
                                        <input id={'qty' + selectedSeed.id + 2} className='qtyInput' 
                                            defaultValue={1}
                                            onChange={(e)=>{updateByEntry(selectedSeed.id, e.target.value)}}/>
                                        <Link to='' onClick={()=>updateQuantity(selectedSeed.id, 1)}> +</Link><br/>
                                        <Link to='' onClick={()=>{addItem(selectedSeed.id)}}>Add to Cart</Link> */}
                    <p><Link to='' onClick={()=>setSelectedSeed(null)}>Close</Link> </p>
                </div>
            </div>
            <div className={itemAdded}>
                <span>{toastInfo.quantity && toastInfo.item ? toastInfo.quantity + ' x ' + toastInfo.item + ' added to your cart' : ''}</span>
            </div>
        </div>
    )
}

export default FindSeeds