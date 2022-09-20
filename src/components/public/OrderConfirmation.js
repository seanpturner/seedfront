import React, { useEffect, useState } from 'react';
// import Logo from '../photos/Logo.png';

function OrderConfirmation(props) {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [allSeeds, setAllSeeds] = useState(null);
    const locator = props.locator;

    const todaysDate = () => {
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth() +1;
        let year = d.getFullYear();
        return month + '-' + day + '-' + year;
    }

    const showAsUSDate = (d) => {
        let year;
        let monthDay;
        if (d) {
            year = d.substring(0,4);
            monthDay = d.substring(5,10);
            if (monthDay[0] === '0') {
                monthDay = monthDay.substring(1);
            }
            return monthDay + '-' + year;
        }
    }

    const showAsCurrency = (amount) => {
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return formatter.format(amount);
    }

    
    const crossReference = (list, sentKey, sentValue, returnKey) => {
    let returnItem;
    list.forEach(item => {
        if (sentValue && sentValue !== undefined) {
            if (item[sentKey].toString() === sentValue.toString()) {
            returnItem =  item[returnKey];
            }
        }
    });
    return returnItem;
  }

    useEffect(() => {
        if (locator) {
            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
              
            fetch('https://www.boutiqueseedsnm.com/purchases/locator/' + locator, requestOptions)
                .then(response => response.json())
                .then(response => setSelectedOrder(response))
            }
    }, [locator])

    useEffect(() => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("https://www.boutiqueseedsnm.com/seeds", requestOptions)
            .then(response => response.json())
            .then(result => setAllSeeds(result))
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }, [])

  return (
    
    <div>
    <table className='printTable rightCell'>
        <tr>
            <td>
                {todaysDate()}
            </td>
        </tr>
        <tr>
            <td>
                {selectedOrder ? 'Ref: ' + selectedOrder.recordLocator : ''}
            </td>
        </tr>
        <tr>
            <td>
                {selectedOrder ? selectedOrder.orderUser : ''}<br/>
                {selectedOrder ? selectedOrder.deliveryAddress1 : ''}<br/>
                {selectedOrder ? selectedOrder.deliveryAddress2 : ''}{selectedOrder && selectedOrder.deliveryAddress2 === null ? '' : <br/>}
                {selectedOrder && selectedOrder.city && selectedOrder.state ? selectedOrder.city + ', ' + selectedOrder.state : ''}&nbsp;{selectedOrder && selectedOrder.zip ? selectedOrder.zip : ''}<br/>
                {selectedOrder ? selectedOrder.phone : ''}{selectedOrder && selectedOrder.phone === null ? '' : <br/>}
                {selectedOrder ? selectedOrder.email : ''}<br/>
                {selectedOrder && selectedOrder.purchaserName ? 'Purchaser: ' : ''}{selectedOrder ? selectedOrder.purchaserName : ''}{selectedOrder && selectedOrder.purchaserName === null ? '' : <br/>}
            </td>
        </tr>
        <tr>
            <td className='rightCell'>
                <table className='shipperDeliveryNotes rightCell'>
                <td>
                    {selectedOrder && selectedOrder.deliveryNotes ? selectedOrder.deliveryNotes : ''}
                </td>
            </table>
            </td>
        </tr>
        <tr>
            <td>
                {selectedOrder && selectedOrder.purchaseDate ? 'Order Date: ' + showAsUSDate(selectedOrder.purchaseDate) : ''}
            </td>
        </tr>
    </table>
    <table className='printItemsTable'>
        <h2>Items</h2>
        <tr className='topAlignTableRow printItemsTable'>
            <td className='topAlignTable'>Quantity</td>
            <td className='topAlignTable'>Item</td>
            <td className='topAlignTable rightCell'>Price</td>
            <td className='topAlignTable rightCell'>Extended</td>
        </tr>
        {selectedOrder && allSeeds && selectedOrder.lineItems?.map((lineItem)=>{
            return (
            <tr className='topAlignTableRow printItemsTable'>
                <td className='topAlignTable'>{lineItem.quantity}</td>
                {/* <td className='topAlignTable'>{lineItem.itemId}</td> */}
                <td className='topAlignTable'>{crossReference(allSeeds, 'id', lineItem.itemId, 'name')}</td> 
                <td className='topAlignTable rightCell'>{showAsCurrency(lineItem.price)}</td>
                <td className='topAlignTable rightCell'>{showAsCurrency(lineItem.price * lineItem.quantity)}</td>
            </tr>
            )
        })}
        {/* <br/> */}
        {/* {!selectedOrder || selectedOrder.discountCode === null ? '' : 
        <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'>Discount Code:&nbsp;{selectedOrder.discountCode}</td>
            <td className='topAlignTable rightCell'>Discount Amount:&nbsp;{showAsCurrency(selectedOrder.discountAmount)}</td>
        </tr>
        } */}

        <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Pre-tax:&nbsp;{selectedOrder ? showAsCurrency(selectedOrder.preTax) : ''}</td>
        </tr>

        {!selectedOrder || selectedOrder.discountCode === null ? '' : 
        <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'>Discount Code:&nbsp;{selectedOrder.discountCode}</td>
            <td className='topAlignTable rightCell'>Discount Amount:&nbsp;{showAsCurrency(selectedOrder.discountAmount)}</td>
        </tr>
        }

        <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Tax:&nbsp;{selectedOrder ? showAsCurrency(selectedOrder.tax) : ''}</td>
        </tr>

        <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Shipping:&nbsp;{selectedOrder ? showAsCurrency(selectedOrder.shippingFee) : ''}</td>
        </tr>

        <tr className='topAlignTableRow printItemsTable noBottomBorder'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Total:&nbsp;{ selectedOrder ? showAsCurrency(selectedOrder.total) : ''}<br/>
            </td>
        </tr>
    </table>

</div>
);
}

export default OrderConfirmation