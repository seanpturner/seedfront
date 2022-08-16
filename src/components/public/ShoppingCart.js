import React, { useState, useEffect } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";
import PayPal from './PayPal';

function ShoppingCart() {
    const baseUrl = 'http://localhost:8080/';
    const taxRate = .0784;
    const [applySalesTax, setApplySalesTax] = useState(true);
    const [userId, setUserID] = useState(6);
    const [lineItems, setLineItems] = useState([]);
    const [seeds, setSeeds] = useState([]);
    const [discountCodeObject, setDiscountCodeObject] = useState({});
    const [preTax, setPreTax] = useState(0);
    // const [shippingSelected] = useState(false);
    const [tax, setTax] = useState(0);
    const [purchaseDate, setPurchaseDate] = useState();
    const [shippingFee, setShippingFee] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0); 
    const [discountCode, setDiscountCode] = useState(null);
    const [discountCodeValid, setDiscountCodeValid] = useState(false);
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
    // const [lineItemsTotal, setLineItemsTotal] = useState(0);
    const [pricingStructureDiscount, setPricingStructureDiscount] = useState(0);
    const [totalWithoutPricingDiscount, setTotalWithoutPricingDiscount] = useState(0);
    const [alertDiscountedPrice, setAlertDiscountedPrice] = useState('');
    const [okToAlertDiscount, setOkToAlertDiscount] = useState(false);
    const [showModal, setShowModal] = useState('completeOrder');
    const completeOrder = showModal === 'completeOrder' ? 'completeOrder' : 'hidden';
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
    // const venmo = paymentOption === 'venmo' ? 'venmo' : 'hidden';
    // const cashApp = paymentOption === 'cashApp' ? 'cashApp' : 'hidden';
    // const card = paymentOption === 'card' ? 'card' : 'hidden';
    const showDiscountRow = discountCodeValid && userPricing.allowDiscount ? 'showdiscountRow' : 'hidden';
    const standardShipping = userPricing.freeShipping === true ? 0 : 6;
    const expeditedShipping = userPricing.freeShipping === true ? 5: 12;
    const [selectedShipping, setSelectedShipping] = useState(null);
    const shippingRow = selectedShipping ? 'shippingRow' : 'hidden';
    const [badCode, setBadCode] = useState(false);
    const [badCodeText, setBadCodeText] = useState('');
    const [chooseShippingLink, setChooseShippingLink] = useState(false);
    const showChooseShippingLink = chooseShippingLink ? 'showChooseShippingLink' : 'hidden';
    const showVerifyAddressLink = shippingFee !== null ? 'showVerifyAddressLink' : 'hidden';
    const [shippingVerified, setShippingVerified] = useState(false);
    const showSelectPaymentLink = shippingVerified ? 'showSelectPaymentLink' : 'hidden';
    const [validateFields, setValidateFields] = useState([]);
    const vOrderUser = validateFields.includes('orderUser') && (!orderUser || orderUser.replace(/\s/g, '').length < 3) ? 'Name is required and must be at least 3 characters' : '';
    const vAddress1 = validateFields.includes('address1') && (!deliveryAddress1 || deliveryAddress1.replace(/\s/g, '').length < 5) ? 'Address is required and must be at least 5 characters' : '';
    const vCity = validateFields.includes('city') && (!city || city.replace(/\s/g, '').length < 3) ? 'City is required and must be at least 3 characters' : '';
    const vState = validateFields.includes('state') && (!state || state.replace(/\s/g, '').length < 2) ? 'State is required and must be at least 2 characters' : '';
    const vZip = validateFields.includes('zip') && (!zip || zip.replace(/\s/g, '').length < 5) ? 'ZIP is required and must be 5 consecutive numbers' : '';
    const dnLength = deliveryNotes && deliveryNotes !== undefined ? deliveryNotes.length.toString() : '0';
    const hlShipping = showModal === 'chooseShipping' ? 'hlGreen' : '';
    const hlDiscountCode = showModal === 'addDiscountCode' ? 'hlGreen' : '';
    const showPricingDiscountRow = alertDiscountedPrice !== '' ? 'showPricingDiscountRow' : 'hidden';
    const showBadCode = badCode ? 'alertRedText' : 'hidden';
    const [recordLocator, setRecordLocator] = useState(null);

    const order = {
        id: null,
        userId: userId,
        purchaseDate: purchaseDate,
        lineItems: lineItems,
        shippingFee: shippingFee,
        shippingMethod: selectedShipping,
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
        email: email,
        recordLocator: recordLocator
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
        let un = localStorage.getItem('userName');
        let token = localStorage.getItem('bearerToken');

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
        let un = localStorage.getItem('userName');
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
                    'price': (parseFloat((crossReference(seeds, 'id', item.itemId, 'price')) * (1 - pricingStructureDiscount)).toFixed(2))
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
            // let ext = lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price') * (1-pricingStructureDiscount);
            total += ext;
        });
        if (isNaN(total) || total === 0) {
            setTimeout(() => {
                updateLineItemsTotal()
            }, 10);
        }else{
            setPreTax(total );// * (1-pricingStructureDiscount));
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

    const checkCouponCode = () => {
        let code = discountCode;
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        setDiscountCodeValid(false);
        setDiscountAmount(0);
        setBadCodeText('This code is not valid');
        setBadCode(true);
        fetch('http://localhost:8080/discounts/code/' + code, requestOptions)
        .then(response => response.json())
        .then(result => {
            setDiscountCodeObject(result);
            if (result.discountCode && result.discountCode === code) {
                setDiscountCodeValid(true);
                // setShowModal('chooseShipping');
                setBadCode(false);
                setChooseShippingLink(true);
            }
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
                    setAlertDiscountedPrice('Discounted Pricing');
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
                if (discountCodeValid){
                let dc = discountCodeObject;
                    let today = getDateTime(false);
                    if ((dc.customerSpecific && dc.customerId === userId) || !dc.customerSpecific) {
                        if (preTax >= dc.minimumOrderAmount) {
                            if (dateAsInt(today) >= dateAsInt(dc.startDate) && dateAsInt(today) <= dateAsInt(dc.endDate)) {
                                if (dc.discountRate) {
                                    setDiscountAmount((preTax * (dc.discountRate / 100)).toFixed(2));
                                    setDiscountApplied(true);
                                }
                                if (dc.discountAmount) {
                                    setDiscountAmount(dc.discountAmount.toFixed(2));
                                    setDiscountApplied(true);
                                }
                                setBadCode(false);
                                setBadCodeText('');
                            }else{
                                setBadCode(true);
                                setBadCodeText(`The code ${discountCode} is not applicable at this time`);
                            }
                        }else{
                            setBadCode(true);
                            setBadCodeText(`The code "${discountCode}" requires a ${showAsCurrency(dc.minimumOrderAmount)} minimum order amount`);
                        }
                    }else{
                        setBadCode(true);
                        setBadCodeText('This code cannot be applied to your account');
                    }
                }else{
                    setBadCode(true);
                    setBadCodeText(`"${discountCode}" is not a valid code`);
                }
            }else{
                setBadCode(false);
                setBadCodeText('');
            }
        }else{
            if (discountCode) {
                setBadCode(true);
                setBadCodeText('Your pricing structure does not allow discount codes');
            }else{
                setBadCode(false);
                setBadCodeText('');
            }
        }
    }

    const refreshLineItems = () => {
        let li = lineItems;
        if (li && li.length > 0) {
            li.forEach(lineItem => {
                if (isNaN(lineItem.price)) {
                    // let price = ((lineItem.quantity * crossReference(seeds, 'id', lineItem.itemId, 'price')) * (1 - pricingStructureDiscount));
                    let price = ((crossReference(seeds, 'id', lineItem.itemId, 'price')) * (1 - pricingStructureDiscount));
                    lineItem.price = price;
                }
            });
            setLineItems(li);
        }
    }

    const setFieldsToValidate = (field) => {
        let vf = [...validateFields];
        if (!vf.includes(field)) {
            vf.push(field);
            setValidateFields(vf);
        }
    }

    const validateZipInput = (zipChars) => {
        if (zipChars === '') {
            setZip('');
        }
        if (isNaN(zipChars) || zipChars.length > 5 || zipChars.includes('.') || zipChars.includes('-') || zipChars[0].toString() === '0') {
            document.getElementById('inputZip').value = zip;
        }
        else{
            setZip(zipChars);
        }
    }

    const validateDeliveryNotes = (dn) => {
        if ((dn && dn.length <= 80) || (dn === '')) {
            setDeliveryNotes(dn.toString());
        }else{
            document.getElementById('inputDeliveryNotes').value = deliveryNotes;
        }
    }

    const validateShipping = () => {
        setValidateFields(['orderUser', 'deliveryAddress1', 'city', 'state', 'zip']);
        if (orderUser
            && deliveryAddress1
            && city
            && state
            && zip
            && orderUser !== undefined
            && deliveryAddress1 !== undefined
            && city !== undefined
            && state !== undefined
            && zip !== undefined
            && orderUser.length >= 3
            && deliveryAddress1.length >= 5
            && city.length >= 3
            && state.length >= 2
            && zip.length === 5
        ) {
            // setShowModal('selectPayment');
            setShippingVerified(true);
        }
    }

    // const placeOrder = () => {
    //     let myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     let raw = JSON.stringify(order);

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch(baseUrl + 'purchases', requestOptions)
    //     .then(response => response.text())
    //     .then(result => {
    //         console.log(result);
    //         window.location.replace('/home');
    //     })
    //     // .catch(error => console.log('error', error));
    // }

    const getLocator = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("http://localhost:8080/purchases/createLocator", requestOptions)
            .then(response => response.text())
            .then(result => setRecordLocator(result))
            // .catch(error => console.log('error', error));
        }

    useEffect(() => {
        fetchSeeds();
        getOrder();
        setPurchaseDate(getDateTime(true));
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        refreshLineItems();
        // eslint-disable-next-line
    },[seeds, updateQuantity, pricingStructureDiscount])

    useEffect(() => {
        getPricing();
        // eslint-disable-next-line
    },[pricingStructure])

    useEffect(() => {
        applyDiscounts();
    // }, [checkCouponCode, lineItems, lineItemsTotal, userId, userPricing, discountCodeObject])
    // eslint-disable-next-line
}, [preTax, userId, userPricing, discountCodeObject])


    useEffect(() => {
        updateLineItemsTotal();
        // eslint-disable-next-line
    }, [lineItems, seeds, pricingStructureDiscount])

    useEffect(() => {
        let t = preTax - discountAmount + tax + shippingFee;
        setTotal(t);
        //eslint-disable-next-line
    },[preTax, discountAmount, shippingFee])

    useEffect(() => {
        getLocator();
        //eslint-disable-next-line
    },[])

  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
            <br/>{JSON.stringify(order)}<br/>
            <br/>{selectedShipping}<br/>
            {/* <br/>{validateFields.toString()}<br/> */}
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
                    <tr className={showPricingDiscountRow}>
                        <td/>
                        <td className='hlRed'>{alertDiscountedPrice}</td>
                        <td/>
                        <td/>
                        <td className='strikeThrough'>{showAsCurrency(totalWithoutPricingDiscount)}</td>
                    </tr>
                    <tr>
                        <td/>
                        <td>Subtotal</td>
                        <td/>
                        <td/>
                        <td className='preTax'>{showAsCurrency(preTax)}</td>
                    </tr>
                    <tr className={showDiscountRow}>
                        <td/>
                        <td className={hlDiscountCode}>Discount Code: {discountCode}</td>
                        {/* <td>Discount Code: <span className='alertRedText'>{discountCode}</span> </td> */}
                        <td/>
                        <td/>
                        <td className={hlDiscountCode + ' preTax'}>{showAsCurrency(-1 * discountAmount)}</td>
                    </tr>
                    <tr>
                        <td/>
                        <td>{applySalesTax ? 'Tax' : ''}</td>
                        <td/>
                        <td/>
                        <td >{applySalesTax ? showAsCurrency(tax) : ''}</td>
                    </tr>
                    <tr className={shippingRow}>
                        <td/>
                        <td className={hlShipping}>Standard shipping</td>
                        <td/>
                        <td/>
                        <td className={hlShipping}>{showAsCurrency(shippingFee)}</td>
                    </tr>
                    <tr>
                        <td/>
                        <td>Total</td>
                        <td/>
                        <td/>
                        <td>{showAsCurrency(total)}</td>
                    </tr>
                </table>
            </p>
            <div className={completeOrder}>
                {/* <p className='alertRedText'>What would you like to do next?</p> */}
                <Link to='/findseeds'>Add more seeds</Link> or <Link to='' onClick={()=>setShowModal('toAddDiscountCode')}>Wrap up my order</Link><br/>
            </div>
            <div className={toAddDiscountCode}>
                <p className='alertRedText'>Do you have a discount code?</p>
                <Link to='' onClick={()=>setShowModal('addDiscountCode')}>Yes</Link> or <Link to='' onClick={()=>setShowModal('toChooseShipping')}>No</Link>
            </div>
            <div className={addDiscountCode}>
                <p className='alertRedText'>Enter your discount code</p>
                <input id='inputDiscountCode' type='text' onBlur={(e)=>setDiscountCode(e.target.value)}/><br/>
                <Link to='' onClick={()=>{checkCouponCode()}}> Try this code</Link> or <Link to='' onClick={()=>{setShowModal('toChooseShipping'); setDiscountCode(null); setDiscountAmount(0); setDiscountCodeValid(false); document.getElementById('inputDiscountCode').value=''}}>Continue without a discount code</Link><br/>
                    <span className={showBadCode}>{badCodeText}</span>
                <br/>
                <span className={showChooseShippingLink}><Link className='nextText' to = '' onClick={()=>setShowModal('chooseShipping')}>Next: Choose shipping</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toAddDiscountCode')} >Back: My order</Link></span>
            </div>
            <div className={toChooseShipping}>
                <Link className='nextText' to='' onClick={()=>setShowModal('chooseShipping')}>Next: Choose shipping</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toAddDiscountCode')}>Back: Discount code</Link>
            </div>
            <div className={chooseShipping}>
                <p className='alertRedText'>Select a shipping method</p>
                <Link to='' onClick={()=>{setSelectedShipping('Standard'); setShippingFee(standardShipping)}}>Standard shipping: {showAsCurrency(standardShipping)}</Link> or <Link to='' onClick={()=>{setSelectedShipping('Expedited'); setShippingFee(expeditedShipping)}}>Expedited shipping: {showAsCurrency(expeditedShipping)}</Link><br/><br/>
                <span className={showVerifyAddressLink}>
                    <Link className='nextText' to='' onClick={()=>setShowModal('verifyAddress')}>Next: Verify Address</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toChooseShipping')} >Back: My order</Link>
                </span>
            </div>
            <div className={toVerifyAddress}>
                <Link className='nextText' to='' onClick={()=>setShowModal('verifyAddress')}>Next: Verify address</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toChooseShipping')}>Back: Choose shipping</Link>
            </div>
            <div className={verifyAddress}>
                <p className='alertRedText'>Verify or edit the shipping information to select your payment option</p>
                <p>
                    <table>
                        <tr>
                            <td>Name:</td>
                            <td><input type='text' defaultValue={orderUser} onChange={(e)=>{setOrderUser(e.target.value); setFieldsToValidate('orderUser')}} onBlur={(e)=>{setOrderUser(e.target.value); setFieldsToValidate('orderUser')}}/></td>
                            
                        </tr>
                        <tr className={vOrderUser === '' ? 'hidden' : 'validationText'}>
                            <td/>
                            <td>{vOrderUser}</td>
                        </tr>
                        <tr>
                            <td>Address:</td>
                            <td><input type='text' defaultValue={deliveryAddress1} onChange={(e)=>{setDeliveryAddress1(e.target.value); setFieldsToValidate('address1')}} onBlur={(e)=>{setDeliveryAddress1(e.target.value); setFieldsToValidate('address1')}}/></td>
                        </tr>
                        <tr>
                            <td/>
                            <td><input type='text' defaultValue={deliveryAddress2} onBlur={(e)=>{setDeliveryAddress2(e.target.value)}}/></td>
                        </tr>
                        <tr className={vAddress1 === '' ? 'hidden' : 'validationText'}>
                            <td/>
                            <td>{vAddress1}</td>
                        </tr>
                        <tr>
                            <td>City:</td>
                            <td><input type='text' defaultValue={city} onChange={(e)=>{setCity(e.target.value); setFieldsToValidate('city')}} onBlur={(e)=>{setCity(e.target.value); setFieldsToValidate('city')}}/></td>
                        </tr>
                        <tr className={vCity === '' ? 'hidden' : 'validationText'}>
                            <td/>
                            <td>{vCity}</td>
                        </tr>
                        <tr>
                            <td>State:</td>
                            <input list='stateList' id='selectState' defaultValue={state} onChange={(e)=>{setState(e.target.value); setFieldsToValidate('state')}} onBlur={(e)=>{setState(e.target.value); setFieldsToValidate('state')}}/>
                                        <datalist id='stateList'>
                                        <option value = 'NM'/>
                                        <option value = 'AK'/>
                                        <option value = 'AL'/>
                                        <option value = 'AR'/>
                                        <option value = 'AZ'/>
                                        <option value = 'CA'/>
                                        <option value = 'CO'/>
                                        <option value = 'CT'/>
                                        <option value = 'DE'/>
                                        <option value = 'FL'/>
                                        <option value = 'GA'/>
                                        <option value = 'HI'/>
                                        <option value = 'IA'/>
                                        <option value = 'ID'/>
                                        <option value = 'IL'/>
                                        <option value = 'IN'/>
                                        <option value = 'KS'/>
                                        <option value = 'KY'/>
                                        <option value = 'LA'/>
                                        <option value = 'MA'/>
                                        <option value = 'MD'/>
                                        <option value = 'ME'/>
                                        <option value = 'MI'/>
                                        <option value = 'MN'/>
                                        <option value = 'MO'/>
                                        <option value = 'MS'/>
                                        <option value = 'MT'/>
                                        <option value = 'NC'/>
                                        <option value = 'ND'/>
                                        <option value = 'NE'/>
                                        <option value = 'NH'/>
                                        <option value = 'NJ'/>
                                        <option value = 'NM'/>
                                        <option value = 'NV'/>
                                        <option value = 'NY'/>
                                        <option value = 'OH'/>
                                        <option value = 'OK'/>
                                        <option value = 'OR'/>
                                        <option value = 'PA'/>
                                        <option value = 'RI'/>
                                        <option value = 'SC'/>
                                        <option value = 'SD'/>
                                        <option value = 'TN'/>
                                        <option value = 'TX'/>
                                        <option value = 'UT'/>
                                        <option value = 'VA'/>
                                        <option value = 'VT'/>
                                        <option value = 'WA'/>
                                        <option value = 'WI'/>
                                        <option value = 'WV'/>
                                        <option value = 'WY'/>
                                        </datalist>
                            {/* <td><input type='text' defaultValue={state} onBlur={(e)=>{setState(e.target.value)}}/></td> */}
                        </tr>
                        <tr className={vState === '' ? 'hidden' : 'validationText'}>
                            <td/>
                            <td>{vState}</td>
                        </tr>
                        <tr>
                            <td>ZIP:</td>
                            <td><input id='inputZip' type='text' defaultValue={zip} onChange={(e)=>{validateZipInput(e.target.value); setFieldsToValidate('zip')}} onBlur={(e)=>{validateZipInput(e.target.value); setFieldsToValidate('zip')}}/></td>
                        </tr>
                        <tr className={vZip === '' ? 'hidden' : 'validationText'}>
                            <td/>
                            <td>{vZip}</td>
                        </tr>
                        <tr className='topAlignTableRow'>
                            <td>Delivery Notes:</td>
                            <td><textarea id='inputDeliveryNotes' type='text' rows='3' defaultValue={deliveryNotes} onChange={(e)=>{validateDeliveryNotes(e.target.value)}}/></td>
                            <td className={deliveryNotes === '' || deliveryNotes === undefined ? 'hidden' : 'validationText'}>{deliveryNotes && deliveryNotes !== undefined ? dnLength + '/80' : ''}</td>
                        </tr>
                        {/* <tr className={deliveryNotes === '' || deliveryNotes == undefined ? 'hidden' : 'validationText'}>
                            <td/>
                            <td>
                                {deliveryNotes}
                            </td>
                        </tr> */}
                    </table>
                </p>
                <Link to='' onClick={()=>validateShipping()}>This shipping information is correct</Link>
                {/* 'selectPayment' */}
                <span className={showSelectPaymentLink}><br/>
                    <Link className='nextText' to='' onClick={()=>setShowModal('selectPayment')}>Next: Select payment</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toVerifyAddress')} >Back: My order</Link>
                </span>
            </div>
            <div className={toSelectPayment}>
                <Link className='nextText' to='' onClick={()=>setShowModal('selectPayment')}>Next: Select payment</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toVerifyAddress')}>Back: Verify address</Link>
            </div>
            <div className={selectPayment}>
                <span className='alertRedText'>Choose a payment option to be able to submit your order</span><br/>
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
                <Link className='nextText' to='' onClick={()=>setShowModal('submitOrder')}>Next: Submit order</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toSelectPayment')} >Back: My order</Link>
            </div>
            <div className={toSubmitOrder}>
                <Link className='nextText' to='' onClick={()=>setShowModal('submitOrder')}>Next: Submit order</Link> or <Link className='nextText' to='' onClick={()=>setShowModal('toSelectPayment')}>Back: Verify address</Link>
            </div>
            <div className={submitOrder}>
                Submit Order<br/>
                {/* <Link to='' onClick={()=>placeOrder()}>Submit</Link> or <Link to='' onClick={()=>setShowModal('toSubmitOrder')} >Back: My order</Link> */}
                <PayPal totalCost={total} orderRef={recordLocator} purchase={JSON.stringify(order)}/>
            </div>
        </div>
    </div>
  )
}

export default ShoppingCart