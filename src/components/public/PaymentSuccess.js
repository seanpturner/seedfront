import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import NavBar from '../common/NavBar';

export default function PaymentSuccess() {
    console.log('pms');
    const { purchase } = useParams();
    const location = useLocation();
    console.log(location.state);
    const order = JSON.parse(location.state.purchase);
    // const order = JSON.parse(sessionStorage.getItem('paidPurchase'));
    // const order = JSON.parse(purchase);
    const baseUrl = 'http://localhost:8080/';
    // const [fetchCount, setFetchCount] = (0);
    const getDateTime = () => {
        let today = new Date();
        let dash1 = '-';
        let dash2 = '-';
            let day = today.getDate();
            let month = today.getMonth() +1;
            let year = today.getFullYear();
            // let hours = today.getHours();
            // let minutes = today.getMinutes();
            // let seconds = today.getSeconds();
        if (month < 10) {
            dash1 = '-0';
        }
        if (day < 10) {
            dash2 = '-0';
        }
        // if (hours < 10) {
        //     hours = '0' + hours;
        // }
        // if (minutes < 10) {
        //     minutes = '0' + minutes;
        // }
        // if (seconds < 10) {
        //     seconds = '0' + seconds;
        // }
        return year + dash1 + month + dash2 + day;
        
    }
    const updPurchase = {
        id: null,
        userId: order.userId,
        purchaseDate: order.purchaseDate,
        lineItems: order.lineItems,
        shippingFee: order.shippingFee,
        shippingMethod: order.shippingMethod,
        preTax: order.preTax,
        tax: order.tax,
        discountApplied: order.discountApplied,
        discountAmount: order.discountAmount,
        discountCode: order.discountCode,
        total: order.total,
        orderStatus: 101,
        deliveryAddress1: order.deliveryAddress1,
        deliveryAddress2: order.deliveryAddress2,
        deliveryNotes: order.deliveryNotes,
        city: order.city,
        state: order.state,
        zip: order.zip,
        pricingStructure: order.pricingStructure,
        orderUser: order.orderUser,
        email: order.email,
        recordLocator: order.recordLocator,
        paymentDate: getDateTime(),
        paymentType: 4
    }

        const placeOrder = () => {
            // setFetchCount(fetchCount +1);
            // if (fetchCount <= 1) {
            console.log('place order');
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify(updPurchase);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(baseUrl + 'purchases', requestOptions)
            .then(response => response.text())
            // .then(result => window.location.href = '/orderSuccess/' + updPurchase.recordLocator)
            .then(result => {
                // sessionStorage.removeItem('paidPurchase');
                window.location.replace('/orderSuccess/' + updPurchase.recordLocator);
            })
            // .catch(error => console.log('error', error));
        // }
    }

    // useEffect(() => {
    //     sessionStorage.removeItem('userOrder');
    // })

    useEffect(() => {
        // if (updPurchase.userId) {
            // console.log(order);
            // alert(JSON.stringify(order));
            sessionStorage.removeItem('userOrder');
            if (updPurchase.recordLocator) {
                console.log(updPurchase.recordLocator);
                placeOrder();
                // sessionStorage.removeItem('paidPurchase');
            }
            // else{
            //     alert('no order');
            // }
            
            
        // }
        // eslint-disable-next-line
    }, [updPurchase])

  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='loader'>
        <h2>Placing Order</h2>
        {/* {JSON.stringify(updPurchase)} */}
        <div className='spinner'/>
        </div>
        
    </div>
    
  )
}
