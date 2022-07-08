import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class CreateOrder extends Component {
    state = { 
        dataLoaded: false,
        secondsRemaining: '',
        baseUrl: "http://localhost:8080/",
        sessionUser: 1,
        activeUsers: [],
        allPurchaseStatuses: [],
        allPricingStructures: [],
        allDiscounts: [],
        allSeeds: [],
        searchResults: [],
        selectedUser: {"id":6,"userName":"BoutiqueSeeds","password":"3d0e83ff98bd26e79a2243e91247f055","fName":"Boutique Seeds","lName":"House Account","email":"seanpturner@gmail.com","dateCreated":"2022-07-06","birthDate":"2022-10-20","active":true,"accountType":"admin","address1":"1119 Cielo Vista Del Norte","address2":null,"city":"Corrales","state":"NM","zip":"87048","phone":"616-516-0446","businessName":"Boutique Seeds","businessPhone":null,"businessPhoneExt":null,"pricingStructure":1,"salesTax":true},
        searchString: '',
        dataSet: '',
        newOrder: {},
        buildLineItem: {},
        buildExtra: {},
        preDiscountSubTotal: 0,
        discountAmount: 0,
        discountCode: ''

     } 

    componentDidMount = () => {
        this.nextThing('activeUsers');
    }

    getFetch = (endpoint, path, statePosition, sortKey, sortOrder, nextPass) => {
        let pathUrl = this.state.baseUrl + endpoint;
        if (path != null) {
            pathUrl = pathUrl + '/' + path;
        }
        this.doGetFetch(pathUrl, statePosition, sortKey, sortOrder);
        this.nextThing(nextPass);
    }

    doGetFetch = (fetchUrl, statePosition, sortKey, sortOrder) => {

        let requestOptions = {
            method: 'GET'
        };
        
        fetch(fetchUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                this.objectSort(result, sortKey, statePosition, sortOrder);
                this.sortList(result, sortKey);
            })
    }

    objectSort = (obj, sortKey, statePosition, sortOrder) => {
        let sortedObject = [];
        obj.forEach(element => {
            sortedObject.push(element);
        });
        if (sortOrder === "descending") {
            sortedObject.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1));
        }else{
            sortedObject.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
        }
        this.setState({ [statePosition]: sortedObject });
    }

    sortList = (list, by) => {
        this.setState({ dataSet: by });
        let sortDirection = this.state.sortDirection;
        let sortBy = this.state.sortBy;
        if (by === sortBy) {
            if (sortDirection === "ascending") {
                sortDirection = "descending";
            } else {
            sortDirection = "ascending";
            }
            this.setState({ sortDirection: sortDirection });
        }
        if (sortDirection === "ascending") {
          list.sort((a, b) => (a[by] > b[by] ? 1 : -1));
          this.setState({
            sortedList: list,
            sortBy: by,
          });
        }
        if (sortDirection === "descending") {
            list.sort((a, b) => (a[by] < b[by] ? 1 : -1));
            this.setState({
                sortedList: list,
                sortBy: by,
            });
        }
    };

    nextThing = (nextPass) => {
        switch(nextPass) {
            case 'activeUsers':
                this.getFetch('users', 'active', 'activeUsers', 'lName', 'ascending', 'purchaseStatuses');
                break;
            case 'purchaseStatuses':
                this.getFetch('purchasestatuses', null, 'allPurchaseStatuses', 'statusCode', 'ascending', 'pricingStructures');
                break;
            case 'pricingStructures':
                this.getFetch('pricing', null, 'allPricingStructures', 'label', 'ascending', 'discounts');
                break;
            case 'discounts':
                this.getFetch('discounts', null, 'allDiscounts', 'discountCode', 'ascending', 'seeds');
                break;
            case 'seeds':
                this.getFetch('seeds', null, 'allSeeds', 'name', 'ascending', 'checkFetchResolved');
                break;
            case 'checkFetchResolved':
                this.checkFetchResolved(1500);
                break;
            case 'setSearchEntity':
                this.setSearchEntity(this.state.selectedUser.id);
                break;
            case 'populateDropdowns':
                this.populateDropdowns();
                break;
            default:
                break;
        }
    }

    crossReference = (list, sentKey, sentValue, returnKey) => {
        let returnItem;
        list.forEach(item => {
            if (item[sentKey].toString() === sentValue.toString()) {
                returnItem =  item[returnKey];
            }
        });
        return returnItem;
    }

    searchFor = () => (event) => {
        let noSpace = event.target.value.replace(/\s/g, '').toLowerCase();
        let users = this.state.activeUsers;
        let returnArray = [];
        this.setState({ searchString: noSpace });
        users.forEach(user => {
          let searchString1 = user.userName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
          let searchString2 = user.fName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
          let searchString3 = user.lName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
          let searchString4 = user.email.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
          if (noSpace === searchString1 || noSpace === searchString2 || noSpace === searchString3 || noSpace === searchString4) {
            let userList = {'id': user.id, 'userName': user.userName, 'fName': user.fName, 'lName': user.lName, 'email': user.email};
            if (!returnArray.includes(userList)) {
              returnArray.push(userList);
            }
          }
        });
        this.setState({ searchResults: returnArray });
    }

    checkFetchResolved = (n) => {
        let users = this.state.activeUsers.length;
        let statuses = this.state.allPurchaseStatuses.length;
        let pricing = this.state.allPricingStructures.length;
        let discounts = this.state.allDiscounts.length;
        let seeds = this.state.allSeeds.length;
        if (n > 0) {
            if (users === 0 || statuses === 0 || pricing === 0 || discounts === 0 || seeds === 0) {
                this.setState({ secondsRemaining: (Math.floor(n/100)) });
                n--;
                setTimeout(() => {
                    this.checkFetchResolved(n);
                }, 10);
            }else{
                this.nextThing('setSearchEntity');
                this.setState({ dataLoaded: true });
            }
        }else{
            alert('Unable to fetch data. Try reloading this page.');
        }
    }

    setSearchEntity = (id) => {
        let users = this.state.activeUsers;
        let no = this.state.newOrder;
        users.forEach(user => {
            if (user.id === id) {
                let ou = user.fName + ' ' + user.lName;
                no.orderUser = ou
                no.userId = user.id;
                if (user.id !== 6) {
                    no.deliveryAddress1 = user.address1;
                    no.deliveryAddress2 = user.address2;
                    no.city = user.city;
                    no.state = user.state;
                    no.zip = user.zip;
                }
                this.setState({
                selectedUser: user,
                searchResults: [],
                newOrder: no
                });
                document.getElementById('searchInput').value = '';
                this.nextThing('populateDropdowns');
            }
        });
    }

    populateDropdowns = () => {
        let dropdowns = ['liSeedSelectList', 'extraSeedSelectList', 'orderStatus'];
        let seedList = this.state.allSeeds;
        let statusList = this.state.allPurchaseStatuses;
        let selectBox;
        dropdowns.forEach(dropdown => {
            selectBox = document.getElementById(dropdown);
            selectBox.setAttribute('id', dropdown);
            selectBox.innerHTML = "";
            selectBox.options.add(new Option("", "", true));
            if (dropdown.includes('SeedSelectList')) {
                seedList.forEach(seed => {
                    selectBox.options.add(new Option(seed.name + ' (' + seed.quantityAvailable + ')', seed.id, false));
                });
            }
            if (dropdown === 'orderStatus') {
                statusList.forEach(status => {
                    selectBox.options.add(new Option(status.label, status.statusCode));
                });
            }
        });
    }

    updateOrder = (key) => (event) => {
        let no = this.state.newOrder;
        if (key === 'orderStatus' ) {
            no[key] = event.target.value;
            if (event.target.value < 300 && event.target.value !== 190) {
                if (event.target.value > 100) {
                    no.paymentDate = this.getDateTime(false);
                }else{
                    no.paymentDate = null;
                }
                if (event.target.value > 101) {
                    no.orderPickedDate = this.getDateTime(false);
                }else{
                    no.orderPickedDate = null;
                }
                if (event.target.value > 102) {
                    no.shippedDate = this.getDateTime(false);
                }else{
                    no.shippedDate = null;
                }
            }
            if (event.target.value === '190') {
                no.paymentDate = null;
                no.orderPickedDate = null;
                no.shippedDate = null;
            }
            this.setState({ newOrder: no });
            document.getElementById(key).value = '';
        }else if (event.target.value.replace(/\s/g, '') !== "") {
            no[key] = event.target.value;
            this.setState({ newOrder: no });
            document.getElementById(key).value = '';
        }
    }

    addOrderArray = (key) => (event) => {
        if (event.target.value.replace(/\s/g, '') !== "") {
            let no = this.state.newOrder;
            let itemArray = no[key];
            if (itemArray === undefined || itemArray === null) {
                itemArray = [];
            }
            let newItem = {};
            if (key === 'orderNotes') {
                newItem.date = this.getDateTime(false);
                newItem.note = event.target.value;
                newItem.userId = this.state.sessionUser;
            }
            itemArray.push(newItem);
            no[key] = itemArray;
            this.setState({ newOrder: no });
        }
        document.getElementById(key).value = '';
    }

    clearItem = (key, value) => {
        let no = this.state.newOrder;
        let pdst = 0;
        if (key === 'lineItems' || key === 'extras' || key === 'orderNotes') {
            let itemArray = no[key];
            let filteredArray = itemArray.filter(data => data !== value);
            no[key] = filteredArray;
            let li = no.lineItems;
            li.forEach(lineItem => {
                let lineTotal = lineItem.quantity * lineItem.price;
                pdst += lineTotal;
            });
        }else{
            no[key] = '';
        }
        this.setState({
            newOrder: no,
            preDiscountSubTotal: pdst
        });
    }

    getDateTime = (includeTime) => {
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

    showAsCurrency = (amount) => {
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return formatter.format(amount);
    }

    buildCurrentLineItem = (key) => (event) => {
        let bli = this.state.buildLineItem;
        bli[key] = event.target.value;
        if (key === 'quantity') {
            if (Math.floor(event.target.value) !== event.target.value) {
                bli.quantity = Math.floor(event.target.value);
                document.getElementById('liQuantity').value = Math.floor(bli.quantity);
            }
            if (event.target.value < 1) {
                bli.quantity = null;
                document.getElementById('liQuantity').value = '';
            }
        }
        if (key === 'price') {
            if (event.target.value < .01) {
            bli.price = null;
            document.getElementById('liPrice').value = '';
        }
        }
        this.setState({ buildLineItem: bli });
    }

    addCurrentLineItem = () => {
        let currentItem = this.state.buildLineItem;
        let fieldsToClear = ['liSeedSelectList', 'liQuantity', 'liPrice'];
        let no = this.state.newOrder;
        let pdst = 0;
        let li = [];
        if (no.lineItems) {
            li = no.lineItems;
        }
        if (currentItem.itemId && currentItem.quantity && currentItem.price) {
            currentItem.quantity = Math.floor(currentItem.quantity);
            li.push(currentItem);
            no.lineItems = li;
            li.forEach(lineItem => {
                let lineTotal = lineItem.quantity * lineItem.price;
                pdst += lineTotal;
            });
            this.setState({
                newOrder: no,
                buildLineItem: {},
                preDiscountSubTotal: pdst
            });
            fieldsToClear.forEach(field => {
                document.getElementById(field).value = '';
            });
        }
    }

    buildCurrentExtra = (key) => (event) => {
        let be = this.state.buildExtra;
        if (key === 'quantity') {
            be.quantity = event.target.value;
            if (Math.floor(event.target.value) !== event.target.value) {
                be.quantity = Math.floor(event.target.value);
                document.getElementById('exQuantity').value = Math.floor(be.quantity);
            }
            if (event.target.value < 1) {
                be.quantity = null;
                document.getElementById('exQuantity').value = '';
            }
        }
        else if (key === 'note'){
            be.note = event.target.value;
            if (event.target.value.replace(/\s/g, '') === "") {
                be.note = null;
            }
        }
        else {
            be[key] = event.target.value;
        }
        this.setState({ buildLineItem: be });
    }

    addCurrentExtra = () => {
        let user = this.state.sessionUser;
        let currentExtra = this.state.buildExtra;
        let fieldsToClear = ['extraSeedSelectList', 'exQuantity', 'exNote'];
        let no = this.state.newOrder;
        let ex = [];
        if (no.extras) {
            ex = no.extras;
        }
        if (currentExtra.itemId && currentExtra.quantity && currentExtra.note) {
            currentExtra.userId = user;
            ex.push(currentExtra);
            no.extras = ex;
            this.setState({
                newOrder: no,
                buildExtra: {}
            });
            fieldsToClear.forEach(field => {
                document.getElementById(field).value = '';
            });
        }
    }

    checkDiscountCode = () => (event) => {
        let allPricingStructures = this.state.allPricingStructures;
        let selectedUser = this.state.selectedUser;
        let discountCode = event.target.value
        let discount;
        let allDiscounts = this.state.allDiscounts;
        let today = this.getDateTime(false);
        let pdst = this.state.preDiscountSubTotal;
        let discountAmount;
        if (this.crossReference(allPricingStructures, 'id', selectedUser.pricingStructure, 'allowDiscount')) {
            allDiscounts.forEach(d => {
                if (d.discountCode === discountCode) {
                    discount = d;
                }
            });
            if (discount.customerSpecific === false || (discount.customerSpecific === true && discount.customerId === selectedUser.id)) {
                if (pdst >= discount.minimumOrderAmount) {
                    if (discount.quantity >= 1) {
                        let compareToday = parseInt(today.substring(0,4) + today.substring(5,7) + today.substring(8));
                        
                        let compareStart = parseInt(discount.startDate.substring(0,4) + discount.startDate.substring(5,7) + discount.startDate.substring(8));
                        let compareEnd = parseInt(discount.endDate.substring(0,4) + discount.endDate.substring(5,7) + discount.endDate.substring(8));
                        if (compareToday >= compareStart && compareToday <= compareEnd) {
                            if (discount.discountRate) {
                                discountAmount = pdst * (discount.discountRate/100);
                            }
                            if (discount.discountAmount) {
                                discountAmount = discount.discountAmount;
                            }
                        }
                    }
                }
            }
                
        }
        this.setState({ discountAmount: discountAmount });
        // return discountAmount;
    }

    setDiscountCode = () => (event) => {
        this.setState({ discountCode: event.target.value });
    }

    render() { 
        const activeUsers = this.state.activeUsers;
        const allPurchaseStatuses = this.state.allPurchaseStatuses;
        const allPricingStructures = this.state.allPricingStructures;
        const allDiscounts = this.state.allDiscounts;
        const allSeeds = this.state.allSeeds;
        const searchResults = this.state.searchResults;
        const selectedUser = this.state.selectedUser;
        const secondsRemaining = this.state.secondsRemaining;
        const showLoading = this.state.dataLoaded ? 'hidden' : 'showLoading';
        const newOrder = this.state.newOrder;
        const hideClearDeliveryNotes = newOrder.deliveryNotes ? 'hideClearDeliveryNotes' : 'hidden';
        const hideClearDeliveryAddress2 = newOrder.deliveryAddress2 ? 'hideClearDeliveryAddress2' : 'hidden';
        const buildLineItem = this.state.buildLineItem;
        const okToAddLineItem = buildLineItem.itemId && buildLineItem.quantity && buildLineItem.quantity > 0 && buildLineItem.price && buildLineItem.price > 0 ? 'okToAddLineItem' : 'hidden';
        const buildExtra = this.state.buildExtra;
        const okToAddExtraItem = buildExtra.itemId && buildExtra.quantity && buildExtra.quantity > 0 && buildExtra.note ? 'okToAddExtraItem' : 'hidden';
        const discountAllowed = allPricingStructures && selectedUser ? this.crossReference(allPricingStructures, 'id', selectedUser.pricingStructure, 'allowDiscount') : false;
        const showDiscountInput = discountAllowed ? 'showDiscountInput' : 'hidden';
        const preDiscountSubTotal = this.state.preDiscountSubTotal;
        const discountAmount = this.state.discountAmount;

        return (
            <div className='adminPage'>
                <div className="adminNavDiv">
                    <AdminNav />
                    <span className={showLoading}><h3>Loading... {secondsRemaining}</h3></span>
                    <br/>{'newOrder: ' + JSON.stringify(newOrder)}<br/>
                    {/* <br/>{'buildLineItem: ' + JSON.stringify(buildLineItem)}<br/> */}
                    {/* <br/>{'activeUsers: ' + JSON.stringify(activeUsers)}<br/> */}
                    {/* <br/>{'selectedUser: ' + JSON.stringify(selectedUser)}<br/> */}
                    {/* <br/>{'allSeeds: ' + JSON.stringify(allSeeds)}<br/> */}
                    {/* <br/>{'allDiscounts: ' + JSON.stringify(allDiscounts)}<br/> */}
                    {/* <br/>{'allPricingStructures: ' + JSON.stringify(allPricingStructures)}<br/> */}
                    {/* <br/>{'allPurchaseStatuses: ' + JSON.stringify(allPurchaseStatuses)}<br/> */}
                    {/* <br/>{'buildExtra: ' + JSON.stringify(buildExtra)}<br/> */}
                    {/* <br/>{discountAllowed?.toString()}<br/> */}
                    {/* <br/>{preDiscountSubTotal}<br/> */}
                </div>
                <div className='addOrderdiv'>
                    <h1 className="adminSectionTitle">Add An Order</h1>
                <div className='searchDiv adminSortText'>Search &nbsp;
                    <input id="searchInput" type="text" onChange = {this.searchFor()} />
                </div>
                <div className='searchResultsDiv'>
                    <table>
                        {searchResults.map((sr)=>{
                            return (
                            <tr>
                                <td>
                                    <Link to="" onClick={()=>this.setSearchEntity(sr.id)}>{sr.orderUser} { "<" + sr.userName + ">"} {sr.email}</Link>
                                </td>
                            </tr>
                            )
                        })}
                    </table>
                </div>
                    <div className='newOrder'>
                        <div className='newOrder1'>
                            <table>
                                <tr>
                                    <td>Customer</td>
                                    <td><input id='orderUser' type='text' onBlur={this.updateOrder('orderUser')}/></td>
                                    <td className='noteColumn nudgeRight4'>{newOrder.orderUser}</td>
                                </tr>
                                <tr>
                                    <td>Purchaser (B2B)</td>
                                    <td><input id='purchaserName' type='text' onBlur={this.updateOrder('purchaserName')}/></td>
                                    <td className='noteColumn nudgeRight4'>{newOrder.purchaserName}</td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td><input id='deliveryAddress1' type='text' onBlur={this.updateOrder('deliveryAddress1')}/></td>
                                    <td className='noteColumn nudgeRight4'>{newOrder.deliveryAddress1}</td>
                                </tr>
                                <tr>
                                    <td/>
                                    <td><input id='deliveryAddress2' type='text' onBlur={this.updateOrder('deliveryAddress2')}/></td>
                                    <td className='noteColumn nudgeRight4'>
                                        <Link className={hideClearDeliveryAddress2} to='' onClick={()=>this.clearItem('deliveryAddress2')}>Clear&nbsp;</Link>
                                        {newOrder.deliveryAddress2}
                                    </td>
                                </tr>
                                <tr>
                                    <td>City</td>
                                    <td><input id='city' type='text' onBlur={this.updateOrder('city')}/></td>
                                    <td className='noteColumn nudgeRight4'>{newOrder.city}</td>
                                </tr>
                                <tr>
                                    <td>State</td>
                                    {/* <td><input id='state' type='text' onBlur={this.updateOrder('state')}/></td> */}
                                    <td>
                                        <input list='stateList' id='state' onBlur={this.updateOrder('state')}/>
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
                                    </td>
                                    
                                    <td className='noteColumn nudgeRight4'>{newOrder.state}</td>
                                </tr>
                                <tr>
                                    <td>Zip</td>
                                    <td><input id='zip' type='text' onBlur={this.updateOrder('zip')}/></td>
                                    <td className='noteColumn nudgeRight4'>{newOrder.zip}</td>
                                </tr>
                                <tr>
                                    <td>Delivery notes</td>
                                    <td><input id='deliveryNotes' type='text' onBlur={this.updateOrder('deliveryNotes')}/></td>
                                    <td className='noteColumn nudgeRight4'>
                                    <Link className={hideClearDeliveryNotes} to='' onClick={()=>this.clearItem('deliveryNotes')}>Clear&nbsp;</Link>
                                        {newOrder.deliveryNotes}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Order status</td>
                                    <td><select id='orderStatus' onClick={this.updateOrder('orderStatus')}/></td>
                                    <td className='topAlignTable nudgeRight4'>{newOrder.orderStatus ? this.crossReference(allPurchaseStatuses, 'statusCode', newOrder.orderStatus, 'label') : ''}</td>
                                </tr>
                                <tr>
                                    <td>Shipped Via</td>
                                    <td>
                                        <input id='shippedVia' list='shippedList' onBlur={this.updateOrder('shippedVia')}/>
                                        <datalist id='shippedList'>
                                            <option value='FedEx'/>
                                            <option value='Picked Up'/>
                                            <option value='Personal Delivery'/>
                                            <option value='UPS'/>
                                            <option value='USPS'/>
                                        </datalist>
                                    </td>
                                    <td>{newOrder.shippedVia}</td>
                                </tr>
                                <tr>
                                    <td>Tracking Number</td>
                                    <td><input id='trackingNumber' type='text' onBlur={this.updateOrder('trackingNumber')}/></td>
                                    <td>{newOrder.trackingNumber}</td>
                                </tr>
                                <tr className='topAlignTableRow'>
                                    <td className='topAlignTable'>Order notes</td>
                                    <td className='topAlignTable'><input id='orderNotes' type='text' onBlur={this.addOrderArray('orderNotes')}/></td>
                                    <td className='topAlignTable'>{newOrder.orderNotes?.map((orderNote)=>{
                                        return (
                                            <tr className='topAlignTableRow'>
                                                <td className='topAlignTable shortNoteColumn'>
                                                <Link to='' onClick={()=>this.clearItem('orderNotes', orderNote)}>Clear</Link>&nbsp;
                                                    {orderNote.date} {orderNote.note} 
                                                    {' [' + this.crossReference(activeUsers,'id', orderNote.userId, 'fName') + ']'}
                                                </td>
                                            </tr>
                                        )
                                    })}</td>
                                </tr>
                            </table>
                        </div>
                        <div className='newOrder2'>

                            
                            {/* <h4>Items</h4> */}
                            <table className='nudgeRight2'>
                                <tr>
                                    <td>Item</td>
                                    <td>Quantity</td>
                                    <td>Price</td>
                                    <td>Extended</td>
                                </tr>
                                <tr>
                                    {/* <td></td> */}
                                    <td><select id='liSeedSelectList' onChange={this.buildCurrentLineItem('itemId')}/></td>
                                    <td><input className='quantityInput' id='liQuantity' type='number' step='1' min='1' onBlur={this.buildCurrentLineItem('quantity')}/></td>
                                    <td><input className='priceInput' id='liPrice' type='number' min='.01' step='.01' onBlur={this.buildCurrentLineItem('price')}/></td>
                                    <td><input  className='priceInput' value={(!buildLineItem.quantity || !buildLineItem.price || buildLineItem.quantity === undefined || buildLineItem.price === undefined) ? '' : this.showAsCurrency(buildLineItem.quantity * buildLineItem.price)}/></td>
                                <td><Link className={okToAddLineItem} to='' onClick={()=>this.addCurrentLineItem()}>Add</Link></td>
                                </tr>
                                {newOrder.lineItems?.map((lineItem)=>{
                                    return(
                                        <tr>
                                            <td>{this.crossReference(this.state.allSeeds, 'id', lineItem.itemId, 'name')}</td>
                                            <td>{lineItem.quantity}</td>
                                            <td>{this.showAsCurrency(lineItem.price)}</td>
                                            <td>{this.showAsCurrency(lineItem.quantity * lineItem.price)}</td>
                                            <td><Link to='' onClick={()=>this.clearItem('lineItems', lineItem)}>Remove</Link>&nbsp;</td>
                                        </tr>
                                    )
                                })}
                            </table>
                            <br/>
                            {/* <h4>Extras</h4> */}
                            <table className='nudgeRight2'>
                                <tr>
                                    <td>Item</td>
                                    <td>Quantity</td>
                                    <td>Price</td>
                                    <td>Extended</td>
                                    <td>Note</td>
                                </tr>
                                <tr>
                                    <td><select id='extraSeedSelectList' onChange={this.buildCurrentExtra('itemId')}/></td>
                                    <td><input className='quantityInput' id='exQuantity' type='number' step='1'  min='1' onBlur={this.buildCurrentExtra('quantity')}/></td>
                                    <td><input className='priceInput' value=''/></td>
                                    <td><input className='priceInput' value=''/></td>
                                    <td><input id='exNote' type='text' onChange={this.buildCurrentExtra('note')}/></td>
                                <td><Link className={okToAddExtraItem} to='' onClick={()=>this.addCurrentExtra()}>Add</Link></td>
                                </tr>
                                {newOrder.extras?.map((extra)=>{
                                    return(
                                        <tr>
                                            
                                            <td>{this.crossReference(this.state.allSeeds, 'id', extra.itemId, 'name')}</td>
                                            <td>{extra.quantity}</td>
                                            <td>{this.showAsCurrency(0)}</td>
                                            <td>{this.showAsCurrency(0)}</td>
                                            <td>{extra.note + ' [' + this.crossReference(this.state.activeUsers, 'id', extra.userId, 'fName') + ']'}</td>
                                            <td><Link to='' onClick={()=>this.clearItem('extras', extra)}>Remove</Link>&nbsp;</td>
                                        </tr>
                                    )
                                })}
                                {/* <tr className={showDiscountInput}>
                                    <td>Discount code</td>
                                    <td className='quantityInput' onBlur={null}></td>
                                </tr> */}
                            </table>
                            <table className='nudgeRight1'>
                                <tr>
                                    <tr className={showDiscountInput}>
                                        <td>Discount code</td>
                                        <td/>
                                        <td>Amount</td>
                                    </tr>
                                    <tr className={showDiscountInput}>
                                        <td className='quantityInput'><input type='text' onBlur={this.checkDiscountCode()}/></td>
                                        <td><input className='quantityInput invisible'/></td>
                                        <td><input className='priceInput' value={this.showAsCurrency(discountAmount)}/></td>
                                        <td><input className='priceInput' value={this.showAsCurrency(preDiscountSubTotal - discountAmount)}/></td>
                                    </tr>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default CreateOrder;