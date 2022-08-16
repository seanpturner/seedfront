import React from 'react'
import { useParams } from 'react-router-dom';
import NavBar from '../common/NavBar';
// import OrderConfirmation from './OrderConfirmation';

export default function OrderSuccess() {
    const { locator } = useParams();
    // const order = JSON.parse(purchase);
    // const baseUrl = 'http://localhost:8080/';


  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div>
            Thank you for your order. It was placed successfully.<br/>
            {locator}
        </div>
        <div>
          {/* <OrderConfirmation locator={locator}/> */}
        </div>
    </div>
    
  )
}
