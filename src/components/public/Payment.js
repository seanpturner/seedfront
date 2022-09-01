import React, { useState, useEffect } from 'react'
import PayPal from './PayPal';
import NavBar from '../common/NavBar';

function Payment() {
    const [order, setOrder] = useState({});
    const getTemp = () => {
        setOrder(JSON.parse(sessionStorage.getItem('tempO')));
        sessionStorage.removeItem('tempO');
    }
    const showAsCurrency = (amount) => {
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        return formatter.format(amount);
    }
    useEffect(() => {
        getTemp();
    }, [])
  return (
    <div>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='pubContent'>
            {/* {'Order: ' + JSON.stringify(order)}<br/> */}
            <div className='payPalButtonDiv centeredDiv'>
                <p className='alertRedText'>{'Authorize ' + showAsCurrency(order.total) + ' payment'}</p>
                <p>{'Order: ' + order.recordLocator}</p>
                <PayPal totalCost={order.total} orderRef={order.recordLocator} purchase={JSON.stringify(order)}/><br/>
            </div>
        </div>
    </div>
  )
}

export default Payment