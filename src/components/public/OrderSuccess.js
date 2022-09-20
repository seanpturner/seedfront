import React from 'react'
import { useParams } from 'react-router-dom';
import NavBar from '../common/NavBar';
import OrderConfirmation from './OrderConfirmation';

export default function OrderSuccess() {
    const { locator } = useParams();
    // const order = JSON.parse(purchase);
    // const baseUrl = 'https://www.boutiqueseedsnm.com/';


  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='centerText'>
            <h3>Thank you for your order. It was placed successfully.</h3>
            <p>Print this page for your records</p>
            {/* {locator} */}
        </div>
        <div>
          <OrderConfirmation locator={locator}/>
        </div>
    </div>
    
  )
}
