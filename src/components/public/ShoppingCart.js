import React, { useState, useEffect } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function ShoppingCart() {
    const [lineItems, setLineItems] = useState([]);
    const [seeds, setSeeds] = useState([]);

    const fetchSeeds = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://localhost:8080/seeds", requestOptions)
            .then(response => response.json())
            .then(result => {setSeeds(result)})
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error))
    }

    const crossReference = (list, sentKey, sentValue, returnKey) => {
        let returnItem;
        list.forEach(item => {
          if (item[sentKey].toString() === sentValue.toString()) {
            returnItem =  item[returnKey];
          }
        });
        return returnItem;
      }

    const getOrder = () => {
        let userOrder = localStorage.getItem('userOrder');
        if (userOrder) {
            let userOrderJson = JSON.parse(userOrder);
            let itemList = [...lineItems];
            userOrderJson.forEach(item => {
                itemList.push({
                    'itemId': item.itemId,
                    'quantity': item.quantity
                })
            });
            setLineItems(itemList);
        }
    }

    const showAsCurrency = (amount) => {
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        return formatter.format(amount);
      }

    const updateQuantity = (id, v) => {
        let li = lineItems;
        li.forEach(lineItem => {
            if (lineItem.itemId === id) {
                lineItem.quantity = lineItem.quantity + v;
            }
        });
        let filteredArray = li.filter(data => data.quantity > 0);
            setLineItems(filteredArray);
            localStorage.removeItem('userOrder');
            if (filteredArray && filteredArray.length > 0) {
                localStorage.setItem('userOrder', JSON.stringify(filteredArray));
            }else{
                window.location.assign('./findseeds');
            }
    }

    useEffect(() => {
        fetchSeeds();
    }, [])

    useEffect(() => {
        getOrder();
    }, [])

  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
            {/* <br/>{JSON.stringify(lineItems)}<br/>
            <br/>{JSON.stringify(seeds)}<br/> */}
        </div>
        <div className='pubContent'>
            <table>
            <tr>
                <td/>
                <td>Seed</td>
                <td>Quantity</td>
                <td>Price</td>
                <td>Extended</td>
            </tr>
                {lineItems.map((lineItem)=>{
                    return (
                    <tr>
                        <td><Link to='' onClick={()=>updateQuantity(lineItem.itemId, (-1 * lineItem.quantity))}>Remove</Link></td>
                        <td>{seeds.length ===0 ? '' : crossReference(seeds, 'id', lineItem.itemId, 'name')}</td>
                        <td>
                            <Link className='miniText' to='' onClick={()=>updateQuantity(lineItem.itemId, -1)}>-1</Link>&nbsp;
                            {lineItem.quantity}&nbsp;
                            <Link className='miniText' to='' onClick={()=>updateQuantity(lineItem.itemId, 1)}>+1</Link>
                        </td>
                        <td>{seeds.length ===0 ? '' : showAsCurrency(crossReference(seeds, 'id', lineItem.itemId, 'price'))}</td>
                        <td>{seeds.length ===0 ? '' : showAsCurrency(lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price'))}</td>
                    </tr>
                )})}
            </table>
        </div>
    </div>
  )
}

export default ShoppingCart