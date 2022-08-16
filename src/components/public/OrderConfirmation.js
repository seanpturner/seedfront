import React, { useEffect, useState } from 'react';
// import Logo from '../photos/Logo.png';

function OrderConfirmation(props) {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const locator = props.locator;

    const todaysDate = () => {
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth() +1;
        let year = d.getFullYear();
        return month + '-' + day + '-' + year;
    }

    // const showAsUSDate = (d) => {
    //     let year;
    //     let monthDay;
    //     if (d) {
    //         year = d.substring(0,4);
    //         monthDay = d.substring(5);
    //         if (monthDay[0] === '0') {
    //             monthDay = monthDay.substring(1);
    //         }
    //         return monthDay + '-' + year;
    //     }
    // }

    // const showAsCurrency = (amount) => {
    //     let formatter = new Intl.NumberFormat('en-US', {
    //         style: 'currency',
    //         currency: 'USD',
    //     });
    //     return formatter.format(amount);
    // }

    useEffect(() => {
        if (locator) {
            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
              
              fetch('http://localhost:8080/purchases/locator/' + locator, requestOptions)
                .then(response => response.json())
                .then(response => setSelectedOrder(response))
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }, [locator])

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
                {'Ref: ' + selectedOrder.recordLocator}
            </td>
        </tr>
        {/* <tr>
            <td>
                {selectedOrder.orderUser}<br/>
                {selectedOrder.deliveryAddress1}<br/>
                {selectedOrder.deliveryAddress2}{selectedOrder.deliveryAddress2 === null ? '' : <br/>}
                {selectedOrder.city + ', ' + selectedOrder.state}&nbsp;{selectedOrder.zip}<br/>
                {selectedOrder.phone}{selectedOrder.phone === null ? '' : <br/>}
                {selectedOrder.email}
                {selectedOrder.purchaserName === null ? '' : 'Purchaser: '}{selectedOrder.purchaserName}{selectedOrder.purchaserName === null ? '' : <br/>}
            </td>
        </tr> */}
        {/* <tr>
            <td className='rightCell'>
                <table className='shipperDeliveryNotes rightCell'>
                <td>
                    {selectedOrder.deliveryNotes}
                </td>
            </table>
            </td>
        </tr> */}
        {/* <tr>
            <td>
                {'Order Date: ' + showAsUSDate(selectedOrder.purchaseDate)}
            </td>
        </tr> */}
    </table>
    <table className='printItemsTable'>
        <h2>Items</h2>
        <tr className='topAlignTableRow printItemsTable'>
            <td className='topAlignTable'>Quantity</td>
            <td className='topAlignTable'>Item</td>
            <td className='topAlignTable rightCell'>Price</td>
            <td className='topAlignTable rightCell'>Extended</td>
        </tr>
        {/* {selectedOrder.lineItems?.map((lineItem)=>{
            return (
            <tr className='topAlignTableRow printItemsTable'>
                <td className='topAlignTable'>{lineItem.quantity}</td>
                <td className='topAlignTable'>{lineItem.seedName}</td>
                <td className='topAlignTable rightCell'>{showAsCurrency(lineItem.price)}</td>
                <td className='topAlignTable rightCell'>{showAsCurrency(lineItem.price * lineItem.quantity)}</td>
            </tr>
            )
        })} */}
        <br/>
        {/* {selectedOrder.discountCode === null ? '' : 
        <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'>Discount Code:&nbsp;{selectedOrder.discountCode}</td>
            <td className='topAlignTable rightCell'>Discount Amount:&nbsp;{showAsCurrency(selectedOrder.discountAmount)}</td>
        </tr>
        } */}

        {/* <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Pre-tax:&nbsp;{showAsCurrency(selectedOrder.preTax)}</td>
        </tr> */}

        {/* <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Tax:&nbsp;{showAsCurrency(selectedOrder.tax)}</td>
        </tr> */}

        {/* <tr className='topAlignTableRow'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Shipping:&nbsp;{showAsCurrency(selectedOrder.shippingFee)}</td>
        </tr> */}

        {/* <tr className='topAlignTableRow printItemsTable noBottomBorder'>
            <td className='topAlignTable'/>
            <td className='topAlignTable'/>
            <td className='topAlignTable rightCell'/>
            <td className='topAlignTable rightCell'>Total:&nbsp;{showAsCurrency(selectedOrder.total)}<br/>
            </td>
        </tr> */}
    </table>
    {/* <div className='shipperLogo'>
        <img src={Logo} alt='Logo' width='500px'/>
    </div> */}

</div>
);
}

export default OrderConfirmation