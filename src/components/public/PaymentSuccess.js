import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import NavBar from '../common/NavBar';

export default function PaymentSuccess() {
    const location = useLocation();
    const order = JSON.parse(location.state.purchase);
    const baseUrl = 'http://www.boutiqueseedsnm.com/backend/';
    const getDateTime = () => {
        let today = new Date();
        let dash1 = '-';
        let dash2 = '-';
            let day = today.getDate();
            let month = today.getMonth() +1;
            let year = today.getFullYear();
        if (month < 10) {
            dash1 = '-0';
        }
        if (day < 10) {
            dash2 = '-0';
        }
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
        paymentType: 4,
        orderNotes: []
    }

        const placeOrder = () => {
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
            .then(result => {
                sendMessageConfirmation();
            })
    }

    const sendMessageConfirmation = () => {
        const confMessage = {
            id: null,
            senderId: 6,
            receiverId: updPurchase.userId,
            messageBody: 'Order ' + updPurchase.recordLocator + ' in the amount of $' + updPurchase.total + ' was placed on ' + updPurchase.purchaseDate + '.\n\nwww.boutiqueseedsnm.com/ordersuccess/' + updPurchase.recordLocator,
            messageSubject: 'Order Confirmation: ' + updPurchase.recordLocator,
            read: false,
            archived: false
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(confMessage);
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        fetch("http://www.boutiqueseedsnm.com/backend/messages", requestOptions)
        .then(response => response.text())
        .then(result => window.location.replace('/orderSuccess/' + updPurchase.recordLocator))
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
    }

    useEffect(() => {
            sessionStorage.removeItem('userOrder');
            if (updPurchase.recordLocator) {
                placeOrder();
            }
            // eslint-disable-next-line
    }, [updPurchase])

  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='loader'>
            <h2>Placing Order</h2>
            <div className='spinner'/>
        </div>
    </div>
  )
}
