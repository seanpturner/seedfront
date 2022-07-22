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
    const [lineItemsTotal, setLineItemsTotal] = useState(0);
    const [pricingStructureDiscount, setPricingStructureDiscount] = useState(0);
    const [totalWithoutPricingDiscount, setTotalWithoutPricingDiscount] = useState(0);
    const [alertDiscountedPrice, setAlertDiscountedPrice] = useState('');
    const [okToAlertDiscount, setOkToAlertDiscount] = useState(false);
    const [showModal, setShowModal] = useState('toAddDiscountCode');
    const toAddDiscountCode = showModal === 'toAddDiscountCode' ? 'toAddDiscountCode' : 'hidden';
    const addDiscountCode = showModal === 'addDiscountCode' ? 'addDiscountCode' : 'hidden';
    const toChooseShipping = showModal === 'toChooseShipping' ? 'toChooseShipping' : 'hidden';
    const chooseShipping = showModal === 'chooseShipping' ? 'chooseShipping' : 'hidden';
    const toVerifyAddress = showModal === 'toVerifyAddress' ? 'toVerifyAddress' : 'hidden';
    const verifyAddress = showModal === 'verifyAddress' ? 'verifyAddress' : 'hidden';
    const toSubmitOrder = showModal === 'toSubmitOrder' ? 'toSubmitOrder' : 'hidden';
    const submitOrder = showModal === 'submitOrder' ? 'submitOrder' : 'hidden';
    const selectPayment = showModal === 'selectPayment' ? 'selectPayment' : 'hidden';
    const toSelectPayment = showModal === 'toSelectPayment' ? 'toSelectPayment' : 'hidden';
    const [paymentOption, setPaymentOption] = useState('');
    const venmo = paymentOption === 'venmo' ? 'venmo' : 'hidden';
    const cashApp = paymentOption === 'cashApp' ? 'cashApp' : 'hidden';
    const card = paymentOption === 'card' ? 'card' : 'hidden';

    

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
        let userOrder = sessionStorage.getItem('userOrder');
        if (userOrder) {
            let userOrderJson = JSON.parse(userOrder);
            let itemList = [];
            let totalWithoutPricingStructureDiscount = 0;
            userOrderJson.forEach(item => {
                itemList.push({
                    'itemId': item.itemId,
                    'quantity': item.quantity,
                    'price': (parseFloat((item.quantity * crossReference(seeds, 'id', item.itemId, 'price')) * (1 - pricingStructureDiscount)).toFixed(2))
                    // let price =      ((Item.quantity * crossReference(seeds, 'id', Item.itemId, 'price')) * (1 - pricingStructureDiscount));
                })
                totalWithoutPricingStructureDiscount += item.quantity * crossReference(seeds, 'id', item.itemId, 'price');
            });
            setLineItems(itemList);
            setTotalWithoutPricingDiscount(totalWithoutPricingStructureDiscount);
        }
        // checkAlertDiscountedPrice();
    }

    // const checkAlertDiscountedPrice = () => {
    //     setTimeout(() => {
    //         if (totalWithoutPricingDiscount > lineItemsTotal) {
    //             setAlertDiscountedPrice('Discounted Price')
    //         }else{
    //             setAlertDiscountedPrice('');
    //         }
    //     }, 10);
    // }

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

    const updateLineItemsTotal = () => {
        let li = lineItems;
        let total = 0;
        li.forEach(lineItem => {
            let ext = lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price') * (1-pricingStructureDiscount);
            total += ext;
        });
        if (isNaN(total) || total === 0) {
            setTimeout(() => {
                updateLineItemsTotal()
            }, 10);
        }else{
            setLineItemsTotal(total );// * (1-pricingStructureDiscount));
            if (applySalesTax) {
                let t = total * taxRate;
                t = parseFloat(t.toFixed(2));
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
            .then(result => setUserPricing(result))
            .then(()=>setOkToAlertDiscount(true))
    }

    const applyDiscounts = () => {
        setDiscountAmount(0);
        setDiscountApplied(false);
        if (userPricing.active) {
            if (userPricing.minimumOrder <= totalWithoutPricingDiscount) {
                if (okToAlertDiscount && userPricing.discount !== 0) {
                    setAlertDiscountedPrice('Discount Pricing');
                }
                setPricingStructureDiscount(userPricing.discount / 100);
                // refreshLineItems();
            }else{
                setPricingStructureDiscount(0);
                setAlertDiscountedPrice('');
            }
            getOrder();
        }

        if (userPricing.allowDiscount){
            if (discountCode){
                let dc = discountCodeObject;
                let today = getDateTime(false);
                if ((dc.customerSpecific && dc.customerId === userId) || !dc.customerSpecific) {
                    if (lineItemsTotal >= dc.minimumOrderAmount) {
                        if (dateAsInt(today) >= dateAsInt(dc.startDate) && dateAsInt(today) <= dateAsInt(dc.endDate)) {
                            if (dc.discountRate) {
                                setDiscountAmount(lineItemsTotal * (dc.discountRate / 100));
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
                    let price = ((lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price')) * (1 - pricingStructureDiscount));
                    lineItem.price = price;
                }
            });
            setLineItems(li);
        }
    }

    // const chooseModal = (modal) => {
    //     switch (modal) {
    //         case '':
    //             //do a thing
    //             break;
            
    //     }
    // }

    useEffect(() => {
        fetchSeeds();
        getOrder();
        setPurchaseDate(getDateTime(true));
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        refreshLineItems();
    },[seeds, updateQuantity, pricingStructureDiscount])

    useEffect(() => {
        getPricing();
    },[pricingStructure])

    useEffect(() => {
        applyDiscounts();
        // eslint-disable-next-line
    }, [checkCouponCode, lineItems, lineItemsTotal, userId, userPricing])

    useEffect(() => {
        updateLineItemsTotal();
        // eslint-disable-next-line
    }, [lineItems, seeds, pricingStructureDiscount])

  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
            <br/>{JSON.stringify(order)}<br/>
        </div>
        <div className='pubContent'>
            <p>
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
                                    <td>{seeds.length ===0 ? '' : showAsCurrency(crossReference(seeds, 'id', lineItem.itemId, 'price') * (1-pricingStructureDiscount))}</td>
                                    <td>{seeds.length ===0 ? '' : showAsCurrency(lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price') * (1-pricingStructureDiscount))}</td>
                                </tr>
                            )})}
                    <tr>
                        <td/>
                        <td className='alertRedText'>{alertDiscountedPrice}</td>
                        <td/>
                        <td/>
                        <td className='lineItemsTotal'>{showAsCurrency(lineItemsTotal)}</td>
                    </tr>
                    <tr>
                        <td/>
                        <td className='alertRedText'>Discount Code: ____ </td>
                        <td/>
                        <td/>
                        <td className='lineItemsTotal'>$5.00</td>
                    </tr>
                    <tr>
                        <td/>
                        <td>{applySalesTax ? 'Tax' : ''}</td>
                        <td/>
                        <td/>
                        <td >{applySalesTax ? showAsCurrency(tax) : ''}</td>
                    </tr>
                    <tr>
                        <td/>
                        <td>Standard shipping</td>
                        <td/>
                        <td/>
                        <td >$8.00</td>
                    </tr>
                    <tr>
                        <td/>
                        <td>Total</td>
                        <td/>
                        <td/>
                        <td >$188.00</td>
                    </tr>
                </table>
            </p>
            <div className={toAddDiscountCode}>
                <Link to='/findseeds'>Add more to my order</Link><br/>
                Do you have a discount code?<br/>
                <Link to='' onClick={()=>setShowModal('addDiscountCode')}>Yes</Link> or <Link to='' onClick={()=>setShowModal('toChooseShipping')}>No</Link>
            </div>
            <div className={addDiscountCode}>
                Discount Code<br/>
                <Link to='' onClick={()=>setShowModal('chooseShipping')}>Next: Choose shipping</Link> or <Link to='' onClick={()=>setShowModal('toAddDiscountCode')} >Back to order</Link>
            </div>
            <div className={toChooseShipping}>
                <Link to='' onClick={()=>setShowModal('chooseShipping')}>Next: Choose shipping</Link> or <Link to='' onClick={()=>setShowModal('toAddDiscountCode')}>Back to discount code</Link>
            </div>
            <div className={chooseShipping}>
                Select a shipping method to proceed to the next step<br/>
                <Link to='' onClick={()=>setShowModal('verifyAddress')}>Next: Verify Address</Link> or <Link to='' onClick={()=>setShowModal('toChooseShipping')} >Back to order</Link>
            </div>
            <div className={toVerifyAddress}>
                <Link to='' onClick={()=>setShowModal('verifyAddress')}>Next: Verify address</Link> or <Link to='' onClick={()=>setShowModal('toChooseShipping')}>Back to choose shipping</Link>
            </div>
            <div className={verifyAddress}>
                Verify the shipping address to select your payment option<br/>
                <Link to='' onClick={()=>setShowModal('selectPayment')}>Next: Select payment</Link> or <Link to='' onClick={()=>setShowModal('toVerifyAddress')} >Back to order</Link>
            </div>
            <div className={toSelectPayment}>
                <Link to='' onClick={()=>setShowModal('selectPayment')}>Next: Select payment</Link> or <Link to='' onClick={()=>setShowModal('toVerifyAddress')}>Back to choose shipping</Link>
            </div>
            <div className={selectPayment}>
                Choose a payment option to be able to submit your order<br/>
                <ul>
                    <li><Link to='' onClick={()=>setPaymentOption('venmo')}>Pay with Venmo</Link><br/></li>
                    <li><Link to='' onClick={()=>setPaymentOption('cashApp')}>Pay with Cash App</Link><br/></li>
                    <li><Link to='' onClick={()=>setPaymentOption('card')}>Pay securely online with a credit or debit card</Link><br/></li>
                </ul>
                <div className='paymentInstructions'>
                    <div className='paymentOptionDetails'>{paymentOption === 'venmo' ? <p><b>Venmo</b></p> : ''}<span className='paymentOptionSpan'>{paymentOption === 'venmo' ? 'You will have 2 days to send ' + total + ' via Venmo to XXXXXXX or your order will be cancelled. You must reference "' + deliveryAddress1.substring(0,7) + '" or your order is likely to be delayed. No orders will be shipped until payment is received in full. You will then receive an order confirmation at the email you provided.' : ''}</span></div>
                    <div className='paymentOptionDetails'>{paymentOption === 'cashApp' ? <p><b>Cash App</b></p> : ''}<span className='paymentOptionSpan'>{paymentOption === 'cashApp' ? 'You will have 2 days to send ' + total + ' via Cash App to XXXXXXX or your order will be cancelled. You must reference "' + deliveryAddress1.substring(0,7) + '" or your order is likely to be delayed. No orders will be shipped until payment is received in full. You will then receive an order confirmation at the email you provided.' : ''}</span></div>
                    <div className='paymentOptionDetails'>{paymentOption === 'card' ? <p><b>Credit/Debit Card</b></p> : ''}<span className='paymentOptionSpan'>{paymentOption === 'card' ? 'You will be connected to the Stripe credit/debit card processing system when you submit your order. We will be notified immediately when payment is successfully processed, and you will receive an order confirmation at the email you provided.' : ''}</span></div>
                </div>
                <Link to='' onClick={()=>setShowModal('submitOrder')}>Next: Submit order</Link> or <Link to='' onClick={()=>setShowModal('toSelectPayment')} >Back to order</Link>
            </div>
            <div className={toSubmitOrder}>
                <Link to='' onClick={()=>setShowModal('submitOrder')}>Next: Submit order</Link> or <Link to='' onClick={()=>setShowModal('toSelectPayment')}>Back to verify address</Link>
            </div>
            <div className={submitOrder}>
                Submit Order<br/>
                <Link to=''>Submit</Link> or <Link to='' onClick={()=>setShowModal('toSubmitOrder')} >Back to order</Link>
            </div>
        </div>
    </div>
  )
}

export default ShoppingCart