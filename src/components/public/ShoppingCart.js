import React, { useState, useEffect } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function ShoppingCart() {
    const taxRate = .0784;
    const [applySalesTax, setApplySalesTax] = useState(true);
    const [userId, setUserID] = useState(6);
    const [lineItems, setLineItems] = useState([]);
    const [seeds, setSeeds] = useState([]);
    const [discountCodeObject, setDiscountCodeObject] = useState({});
    const [preTax, setPreTaxTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [purchaseDate, setPurchaseDate] = useState();
    const [shippingFee, setShippingFee] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0); 
    const [discountCode, setDiscountCode] = useState(null); 
    const [total, setTotal] = useState(null);
    const [deliveryAddress1, setDeliveryAddress1] = useState(null);
    const [deliveryAddress2, setDeliveryAddress2] = useState(null);
    const [deliveryNotes, setDeliveryNotes] = useState(null);
    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);
    const [zip, setZip] = useState(null);
    const [pricingStructure, setPricingStructure] = useState(1);
    const [orderUser, setOrderUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [userPricing, setUserPricing] = useState({});
    

    const order = {
        id: null,
        userId: userId,
        purchaseDate: purchaseDate,
        lineItems: lineItems,
        shippingFee: shippingFee,
        preTax: preTax,
        tax: tax,
        discountApplied: discountApplied,
        discountAmount: discountAmount,
        discountCode: discountCode,
        total: total,
        orderStatus: 100,
        deliveryAddress1: deliveryAddress1,
        deliveryAddress2: deliveryAddress2,
        deliveryNotes: deliveryNotes,
        city: city,
        state: state,
        zip: zip,
        pricingStructure: pricingStructure,
        orderUser: orderUser,
        email: email
    }

    const fetchSeeds = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch('http://localhost:8080/seeds', requestOptions)
            .then(response => response.json())
            .then(result => {
                setSeeds(result);
                checkCredentials();
            })
    }

    const checkCredentials = () => {
        let requestOptions;
        let un = sessionStorage.getItem('userName');
        let token = sessionStorage.getItem('bearerToken');

        if (un && token) {
            let myHeaders = new Headers();
            myHeaders.append('bearerToken', token);
            requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
            fetch('http://localhost:8080/users/checkCredentials/' + un, requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === true || result === 'true') {
                    getUser();
                }
            })
        }
    }

    const getUser = () => {
        let un = sessionStorage.getItem('userName');
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }

        fetch('http://localhost:8080/users/user/' + un, requestOptions)
        .then(response => response.json())
        .then(result => {
            setUserID(result.id);
            setOrderUser(result.fName + ' ' + result.lName);
            setEmail(result.email);
            setDeliveryAddress1(result.address1);
            setDeliveryAddress2(result.address2);
            setCity(result.city);
            setState(result.state);
            setZip(result.zip);
            setPricingStructure(result.pricingStructure);
            setApplySalesTax(result.salesTax);
        })
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
        // setLineItems([]);
        let userOrder = sessionStorage.getItem('userOrder');
        if (userOrder) {
            let userOrderJson = JSON.parse(userOrder);
            let itemList = [];
            // let itemList = [...lineItems];
            userOrderJson.forEach(item => {
                itemList.push({
                    'itemId': item.itemId,
                    'quantity': item.quantity,
                    'price': (item.quantity * crossReference(seeds, 'id', item.itemId, 'price')).toFixed(2)
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
            sessionStorage.removeItem('userOrder');
            if (filteredArray && filteredArray.length > 0) {
                sessionStorage.setItem('userOrder', JSON.stringify(filteredArray));
                getOrder();
            }else{
                window.location.assign('./findseeds');
            }
    }

    const updatePreTaxTotal = () => {
        let li = lineItems;
        let total = 0;
        li.forEach(lineItem => {
            let ext = lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price');
            total += ext;
        });
        if (isNaN(total) || total === 0) {
            setTimeout(() => {
                updatePreTaxTotal()
            }, 10);
        }else{
            // refreshLineItems();
            setPreTaxTotal(total);
            if (applySalesTax) {
                let t = total * taxRate;
                t = t.toFixed(2);
                setTax(t);
            }else{
                setTax(0);
            }
        }
    }

    const getDateTime = (includeTime) => {
        let today = new Date();
        let dash1 = '-';
        let dash2 = '-';
            let day = today.getDate();
            let month = today.getMonth() +1;
            let year = today.getFullYear();
            let hours = today.getHours();
            let minutes = today.getMinutes();
            let seconds = today.getSeconds();
        if (month < 10) {
            dash1 = '-0';
        }
        if (day < 10) {
            dash2 = '-0';
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (includeTime) {
            return year + dash1 + month + dash2 + day + 'T' + hours + ':' + minutes + ':' + seconds + '.000000';
        }else{
            return year + dash1 + month + dash2 + day;
        }
    }

    const checkCouponCode = (e) => {
        let code = e.target.value;
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch('http://localhost:8080/discounts/code/' + code, requestOptions)
        .then(response => response.json())
        .then(result => {
            setDiscountCodeObject(result);
        })
    }

    const dateAsInt = (localDate) => {
        let trimmedDate = localDate.substring(0,4);
        trimmedDate = trimmedDate + localDate.substring(5,7);
        trimmedDate = trimmedDate + localDate.substring(8);
        return parseInt(trimmedDate);
    }

    const getPricing = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch('http://localhost:8080/pricing/' + pricingStructure, requestOptions)
            .then(response => response.json())
    }

    const applyDiscount = () => {
        setDiscountAmount(0);
        setDiscountApplied(false);
        if (userPricing.allowDiscount){
            if (discountCode){
                let dc = discountCodeObject;
                let today = getDateTime(false);
                if ((dc.customerSpecific && dc.customerId === userId) || !dc.customerSpecific) {
                    if (preTax >= dc.minimumOrderAmount) {
                        if (dateAsInt(today) >= dateAsInt(dc.startDate) && dateAsInt(today) <= dateAsInt(dc.endDate)) {
                            if (dc.discountRate) {
                                setDiscountAmount(preTax * (dc.discountRate / 100));
                            }
                            if (dc.discountAmount) {
                                setDiscountAmount(dc.discountAmount);
                            }
                        }
                    }
                }
            }
        }
    }

    const refreshLineItems = () => {
        let li = lineItems;
        if (li && li.length > 0) {
            li.forEach(lineItem => {
                if (isNaN(lineItem.price)) {
                    let price = lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price');
                    lineItem.price = price;
                }
            });
            setLineItems(li);
        }
    }

    useEffect(() => {
        fetchSeeds();
        getOrder();
        setPurchaseDate(getDateTime(true));
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        refreshLineItems();
    },[seeds, updateQuantity])

    useEffect(() => {
        getPricing();
    },[pricingStructure])

    useEffect(() => {
        applyDiscount();
        // eslint-disable-next-line
    }, [checkCouponCode, lineItems, preTax, userId, userPricing])

    useEffect(() => {
        updatePreTaxTotal();
        // eslint-disable-next-line
    }, [lineItems, seeds])

  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
            <br/>{JSON.stringify(order)}<br/>
        </div>
        <div className='pubContent'>
            <table className='adminTable'>
            <tr className='adminRow'>
                <td/>
                <td className='padCell'>Seed</td>
                <td className='padCell'>Quantity</td>
                <td className='padCell'>Price</td>
                <td className='padCell'>Ext.</td>
            </tr>
                {lineItems.map((lineItem)=>{
                    return (
                    <tr className='adminRow'>
                        <td className='separateLinkRight'><Link to='' onClick={()=>updateQuantity(lineItem.itemId, (-1 * lineItem.quantity))}>Remove</Link></td>
                        <td className='seedCol'>{seeds.length ===0 ? '' : crossReference(seeds, 'id', lineItem.itemId, 'name')}</td>
                        <td className='centerText'>
                            <Link className='miniText' to='' onClick={()=>updateQuantity(lineItem.itemId, -1)}>{'<'}</Link>&nbsp;&nbsp;
                            {lineItem.quantity}&nbsp;&nbsp;
                            <Link className='miniText' to='' onClick={()=>updateQuantity(lineItem.itemId, 1)}>{'>'}</Link>
                        </td>
                        <td>{seeds.length ===0 ? '' : showAsCurrency(crossReference(seeds, 'id', lineItem.itemId, 'price'))}</td>
                        <td>{seeds.length ===0 ? '' : showAsCurrency(lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price'))}</td>
                    </tr>
                )})}
                <tr>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td className='preTax'>{showAsCurrency(preTax)}</td>
                </tr>
            </table>
        </div>
    </div>
  )
}

export default ShoppingCart