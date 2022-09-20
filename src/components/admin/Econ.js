import React, { Component } from 'react';
import Logo from '../photos/Logo.png';

class Econ extends Component {
    state = { 
        selectedOrder: {},
        userId: null,
        hasAccess: false
     }

    componentDidMount = () => {
        this.checkAuth();
    }

    checkAuth = () => {
        let requestOptions;
        let un = localStorage.getItem('userName');
        let token = localStorage.getItem('bearerToken');

        if (!un || un === '' || !token || token === '') {
            this.kickToLogin();
        }else{

        requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
        }

        fetch("https://www.boutiqueseedsnm.com/users/user/" + un, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result || result.id === '' || result.id === undefined) {
                this.kickToLogin();
            }else{
                this.getShipperInfo(result.id);
                if (result.accountType === 'admin') {
                    this.setState({ hasAccess: true });
                }
            }

        })
    }

    kickToLogin = () => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('./login');
    }

    getShipperInfo = (userId) => {
        setTimeout(() => {
            let so = JSON.parse(sessionStorage.getItem('shipperInfo'));
            this.setState({ selectedOrder: so });
            this.clearStorage();
            if (so.userId === userId) {
                this.setState({ hasAccess: true });
            }else{
                if (this.state.hasAccess === false) {
                    this.kickToLogin();
                }
            }
        }, 200);
        
    }

    clearStorage = () => {
        setTimeout(() => {
            sessionStorage.removeItem('shipperInfo');
        }, 200);
    }

    showAsUSDate = (d) => {
        let year;
        let monthDay;
        if (d) {
            year = d.substring(0,4);
            monthDay = d.substring(5);
            if (monthDay[0] === '0') {
                monthDay = monthDay.substring(1);
            }
            return monthDay + '-' + year;
        }
    }

    todaysDate = () => {
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth() +1;
        let year = d.getFullYear();
        return month + '-' + day + '-' + year;
    }

    showAsCurrency = (amount) => {
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        return formatter.format(amount);
      }

    render() { 
        const selectedOrder = this.state.selectedOrder;
        const hasAccess = this.state.hasAccess ? 'shipperPage' : 'hidden';
        return (
            <div className={hasAccess}>
                <table className='printTable rightCell'>
                    <tr>
                        <td>
                            {this.todaysDate()}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {'Ref: ' + selectedOrder.recordLocator}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {selectedOrder.orderUser}<br/>
                            {selectedOrder.deliveryAddress1}<br/>
                            {selectedOrder.deliveryAddress2}{selectedOrder.deliveryAddress2 === null ? '' : <br/>}
                            {selectedOrder.city + ', ' + selectedOrder.state}&nbsp;{selectedOrder.zip}<br/>
                            {selectedOrder.phone}{selectedOrder.phone === null ? '' : <br/>}
                            {selectedOrder.email}
                            {selectedOrder.purchaserName === null ? '' : 'Purchaser: '}{selectedOrder.purchaserName}{selectedOrder.purchaserName === null ? '' : <br/>}
                        </td>
                    </tr>
                    <tr>
                        <td className='rightCell'>
                            <table className='shipperDeliveryNotes rightCell'>
                            <td>
                                {selectedOrder.deliveryNotes}
                            </td>
                        </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {'Order Date: ' + this.showAsUSDate(selectedOrder.purchaseDate)}
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
                    {selectedOrder.lineItems?.map((lineItem)=>{
                        return (
                        <tr className='topAlignTableRow printItemsTable'>
                            <td className='topAlignTable'>{lineItem.quantity}</td>
                            <td className='topAlignTable'>{lineItem.seedName}</td>
                            <td className='topAlignTable rightCell'>{this.showAsCurrency(lineItem.price)}</td>
                            <td className='topAlignTable rightCell'>{this.showAsCurrency(lineItem.price * lineItem.quantity)}</td>
                        </tr>
                        )
                    })}
                    <br/>
                    {selectedOrder.discountCode === null ? '' : 
                    <tr className='topAlignTableRow'>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable rightCell'>Discount Code:&nbsp;{selectedOrder.discountCode}</td>
                        <td className='topAlignTable rightCell'>Discount Amount:&nbsp;{this.showAsCurrency(selectedOrder.discountAmount)}</td>
                    </tr>
                    }

                    <tr className='topAlignTableRow'>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable rightCell'/>
                        <td className='topAlignTable rightCell'>Pre-tax:&nbsp;{this.showAsCurrency(selectedOrder.preTax)}</td>
                    </tr>

                    <tr className='topAlignTableRow'>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable rightCell'/>
                        <td className='topAlignTable rightCell'>Tax:&nbsp;{this.showAsCurrency(selectedOrder.tax)}</td>
                    </tr>

                    <tr className='topAlignTableRow'>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable rightCell'/>
                        <td className='topAlignTable rightCell'>Shipping:&nbsp;{this.showAsCurrency(selectedOrder.shippingFee)}</td>
                    </tr>

                    <tr className='topAlignTableRow printItemsTable noBottomBorder'>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable'/>
                        <td className='topAlignTable rightCell'/>
                        <td className='topAlignTable rightCell'>Total:&nbsp;{this.showAsCurrency(selectedOrder.total)}<br/>
                        </td>
                    </tr>
                </table>
                <div className='shipperLogo'>
                    <img src={Logo} alt='Logo' width='500px'/>
                </div>

            </div>
        );
    }
}
 
export default Econ;