import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class OpenOrders extends Component {
  state = { 
    baseUrl: 'http://localhost:8080/',
    allOrders: [],
    activeUsers: [],
    allPurchaseStatuses: [],
    allPricingStructures: [],
    allDiscounts: [],
    allSeeds: [],
    masterJson: [],
    selectedOrder: "none",
    verifyCancel: false,
    updateOrderStatus: false,
    originalSelectedOrder: '',
    updatePaymentDate: false,
    updatePickedDate: false,
    updateShippedDate: false,
    currentUser: 1,
    addLineItems: {},
    addExtra: {},
    sortDirection: 'descending',
    searchString: '',
    searchResults: [],
    confirmSubmit: false,
    
   } 

  componentDidMount = () => {
    this.getFetch('purchases', 'openpurchases', 'allOrders', 'id', 'ascending', 'activeUsers');
  }
  
  createMasterJson = () => {
    let masterJson = [];
    let orders = this.state.allOrders;
    let users = this.state.activeUsers;
    let statuses = this.state.allPurchaseStatuses;
    let pricing = this.state.allPricingStructures;
    let discounts = this.state.allDiscounts;
    let seeds = this.state.allSeeds
    orders.forEach(order => {
      users.forEach(user => {
        if (parseInt(order.userId) === parseInt(user.id)) {
          order.userName = user.userName;
          order.lName = user.lName;
          order.fName = user.fName;
          order.pricingStructure = user.pricingStructure;
          order.phone = user.phone;
          order.orderUser = user.fName + ' ' + user.lName;
        }
      });
      statuses.forEach(status => {
        if (parseInt(order.orderStatus) === parseInt(status.statusCode)) {
          order.statusLabel = status.label;
        }
      });
      discounts.forEach(discount => {
        if (order.discountCode === discount.discountCode) {
          order.discountType = discount.discountType;
          order.discountTypeDescription = discount.discountTypeDescription;
        }
      });
      let lineItems = order.lineItems;
      if (lineItems) {
        lineItems.forEach(lineItem => {
          seeds.forEach(seed => {
            if (lineItem.itemId === seed.id) {
              lineItem.seedName = seed.name;
            }
          });
        });
      }
      let extras = order.extras;
      if (extras) {
        extras.forEach(extra => {
          seeds.forEach(seed => {
            if (extra.itemId === seed.id) {
              extra.seedName = seed.name;
            }
          });
          users.forEach(user => {
            if (extra.userId === user.id) {
              extra.user = '[' + user.fName + ']';
            }
          })
        });
      }
      let orderNotes = order.orderNotes;
      if (orderNotes) {
        orderNotes.forEach(orderNote => {
          users.forEach(user => {
            if (orderNote) {
              if (orderNote.userId === user.id) {
                orderNote.user = '[' + user.fName + ' ' + user.lName + ']';
              }
            }
          });
        });
      }
      masterJson.push(order);
    });
    masterJson.forEach(order => {
      pricing.forEach(price => {
        if (order.pricingStructure === price.id) {
          order.pricingLabel = price.label;
          order.pricingDescription = price.description;
          order.allowDiscount = price.allowDiscount;
        }
      });
      if (order.purchaseDate.length > 10 ) {
        order.originalPurchaseDate = order.purchaseDate;
      }
      order.purchaseDate = this.parseDate(order.purchaseDate);
      order.selectShippedDate = this.getSelectableDate(null,null,0,0,0);
      order.selectPaymentDate = this.getSelectableDate(null, null, 0,0,0);
      order.selectOrderPickedDate = this.getSelectableDate(null, null, 0,0,0);
      if (order.shippedDate) {
        order.shippedDate = this.parseDate(order.shippedDate);
        order.selectShippedDate = this.parseDate(order.shippedDate);
      };
      if (order.paymentDate) {
        order.paymentDate = this.parseDate(order.paymentDate);
        order.selectPaymentDate = this.parseDate(order.paymentDate);
      };
      if (order.orderPickedDate) {
        order.orderPickedDate = this.parseDate(order.orderPickedDate);
        order.selectOrderPickedDate = this.parseDate(order.orderPickedDate);
      };
      if (order.orderCancelledDate) {
        order.orderCancelledDate = this.parseDate(order.orderCancelledDate);
      };
      order.orderNotes?.forEach(note =>{
        if (note){
          note.date = this.parseDate(note.date);
        }
      });
    });
    this.setState({ masterJson: masterJson });
  }

  getFetch = (endpoint, path, statePosition, sortKey, sortOrder, nextPass) => {
    let pathUrl = this.state.baseUrl + endpoint;
    if (path != null) {
      pathUrl = pathUrl + '/' + path;
    }
    this.doGetFetch(pathUrl, statePosition, sortKey, sortOrder);
    this.nextFetch(nextPass);
  }

  nextFetch = (nextPass) => {
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
        this.getFetch('seeds', null, 'allSeeds', 'name', 'ascending', 'createMasterJson');
        break;
      case 'createMasterJson':
        setTimeout(() => {
          this.createMasterJson();
        }, 200);        
        break;
      default:
        break;
    }
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

  listObjectSort = (object, sortKey, statePosition) => {
    let sortDirection = this.state.sortDirection;
      if (sortDirection === 'ascending') {
        sortDirection = 'descending';
      }else{
        sortDirection = 'ascending';
      }
      this.setState({ sortDirection: sortDirection });
    this.objectSort(object, sortKey, statePosition, sortDirection);
    this.setState({ 
      lastSortKey: sortKey
    });
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

  parseDate = (dateIn) => {
    let dateOut = dateIn.substring(0, 10);
    return dateOut;
  }

  showAsCurrency = (amount) => {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(amount);
  }

  setShipper = (so) => {
    if (so) {
      so = JSON.stringify(so);
    }
    let reload = false;
    if (!so) {
      so = JSON.stringify(this.state.selectedOrder);
      reload = true;
    }
    sessionStorage.setItem('shipperInfo', so);
    if (reload === true) {
      window.open('/shipper', '_blank', 'width=960px, height=1320px');
      window.close();
    }
    if (reload === false) {
      window.open('/shipper', '_blank', 'width=960px, height=1320px');
    }
  }

  setEcon = (so) => {
    if (so) {
      so = JSON.stringify(so);
    }
    let reload = false;
    if (!so) {
      so = JSON.stringify(this.state.selectedOrder);
      reload = true;
    }
    sessionStorage.setItem('shipperInfo', so);
    if (reload === true) {
      window.open('/econfirm', '_blank', 'width=960px, height=1320px');
      window.close();
    }
    if (reload === false) {
      window.open('/econfirm', '_blank', 'width=960px, height=1320px');
    }
  }

  getSelectableDate = (selectStateMember, dateValue, y, m, d) => {
    let so = this.state.selectedOrder;
    let maxDay = 31;
    if (!dateValue) {
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
        dateValue =  year + dash1 + month + dash2 + day;
    }
    let updatedDateValue;
    let dash1 = '-';
    let dash2 = '-';
    let updYear = parseInt(dateValue.substring(0,4));
    let updMonth = parseInt(dateValue.substring(5,7));
    let updDay = parseInt(dateValue.substring(8));

    updYear = updYear + y;
    updMonth = updMonth + m;
    if (updMonth > 12) {
      updMonth = 12;
    }
    if (updMonth < 1) {
      updMonth = 1;
    }
    if (updMonth === 4 || updMonth === 6 || updMonth === 9 || updMonth === 11) {
      maxDay = 30;
    }
    if (updMonth === 2) {
      maxDay = 28;
      if (updYear%4 === 0) {
        maxDay = 29;
      }
    }
    updDay = updDay + d;
    if (updDay > maxDay) {
      updDay = maxDay;
    }
    if (updDay < 1) {
      updDay = 1;
    }
    if (updMonth < 10) {
      dash1 = '-0';
    }
    if (updDay < 10) {
      dash2 = '-0';
    }
    updatedDateValue = updYear + dash1 + updMonth + dash2 + updDay;
    if (so === 'none') {
      return updatedDateValue;
    }else{
      so[selectStateMember] = updatedDateValue;
    this.setState({ selectedOrder: so });
    }
  }

  updateOrderDate = (dateType, date) => {
    let so = this.state.selectedOrder;
    so[dateType] = date;
    this.setState({ selectedOrder: so });
  }

  updateOrder = (key, idToClear) => (event) => {
    if (event.key === 'Enter' || (event.type === 'click' && event.target.value !== '')){
      let so = this.state.selectedOrder;
      if (event.target.value.replace(/\s/g, '') !== "") {
        if (key === 'shippedVia') {
        let upperEvent = event.target.value.toUpperCase();
        so[key] = upperEvent;
      }else{
        so[key] = event.target.value;
        if (key === 'orderStatus') {
          so.statusLabel = this.crossReference(this.state.allPurchaseStatuses, 'statusCode', event.target.value, 'label' );
          // so.statusLabel = statusLabel;
        }
      }
      this.setState({ selectedOrder: so });
      document.getElementById(idToClear).value = '';
      }
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

  addOrderNote = (idToClear) =>(event) => {
    if (event.keyCode === 13){
      if (event.target.value.replace(/\s/g, '') !== "") {
        let so = this.state.selectedOrder;
        let users = this.state.activeUsers;
        let orderNotes = so.orderNotes;
        let currentUserName;
        let dateValue;
        let newOrderNote = {};
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
          dateValue =  year + dash1 + month + dash2 + day;
        users.forEach(user => {
          if (user.id === this.state.currentUser) {
            currentUserName = '[' + user.fName + ' ' + user.lName + ']';
          }
        });
        newOrderNote.date = dateValue;
        newOrderNote.note = event.target.value;
        newOrderNote.userId = this.state.currentUser;
        newOrderNote.user = currentUserName;
        orderNotes.push(newOrderNote);
        this.setState({ selectedOrder: so });
        document.getElementById(idToClear).value = '';
      }
    }
  }

  removeArrayItem = (arrayToChange, objectToRemove) => {
    let so = this.state.selectedOrder;
    let thisArray = so[arrayToChange];
    let filteredArray = thisArray.filter(data => data !== objectToRemove);
    so[arrayToChange] = filteredArray;
    this.setState({ selectedOrder: so });
  }

  resetForm = () => {
    let so = this.state.selectedOrder;
    let oso = JSON.parse(this.state.originalSelectedOrder);
    so = oso;
    this.setState({ 
      selectedOrder: so,
      addLineItems: {},
      addExtra: {}
     });
    document.getElementById('extraQuantity').value='';
    document.getElementById('extraSeedOptions').value='';
    document.getElementById('extraNote').value='';
    document.getElementById('quantity').value='';
    document.getElementById('seedOptions').value= '';
    document.getElementById('addPrice').value='';
    document.getElementById('updateShippedVia').value='';
    document.getElementById('updateTrackingNumber').value='';
    document.getElementById('addOrderNote').value ='';
    document.getElementById('extended').innerHTML='';
  }

  updateSeedSelectOptions = () => {
    let seedOptions = document.getElementById('seedOptions');
    let extraSeedOptions = document.getElementById('extraSeedOptions')
    let seeds = this.state.allSeeds;
    seedOptions.innerHTML = '';
    extraSeedOptions.innerHTML = '';
    seedOptions.options.add(new Option("Select", "", true));
    extraSeedOptions.options.add(new Option("Select", "", true));
    seeds.forEach(seed => {
      if (seed.quantityAvailable && seed.quantityAvailable > 0 ){
        seedOptions.options.add(new Option(seed.name + ' qty: ' + seed.quantityAvailable, seed.id, false));
        extraSeedOptions.options.add(new Option(seed.name + ' qty: ' + seed.quantityAvailable, seed.id, false));
      }
    });
    seedOptions.parentNode.replaceChild(seedOptions, seedOptions);
    extraSeedOptions.parentNode.replaceChild(extraSeedOptions, extraSeedOptions);
  }

  addNewItem = (stateObject, key) => (event) => {
    let item = this.state[stateObject];
    item[key] = event.target.value;
    item.userId = this.state.currentUser;
    let users = this.state.activeUsers;
    users.forEach(user => {
      if (user.id === this.state.currentUser) {
        item.user = '[' + user.fName + ']';
      }
    });
    if (key === 'itemId') {
      let seeds = this.state.allSeeds;
       seeds.forEach(seed => {
        if (seed.id === parseInt(event.target.value)) {
          item.seedName = seed.name;
        }
       });
      if (stateObject !== 'addExtra'){
        seeds.forEach(seed => {
          if (seed.id === parseInt(event.target.value)) {
            let defaultPrice = document.getElementById('addPrice');
            let seedPrice = this.showAsCurrency(seed.price);
            seedPrice = seedPrice.substring(1);
            defaultPrice.value = seedPrice;
            defaultPrice.parentNode.replaceChild(defaultPrice, defaultPrice);
            item.price = parseFloat(seed.price);
          }
        });
    }}
    if (stateObject !== 'addExtra' && item.price && item.quantity) {
      item.extended = item.price * item.quantity;
      document.getElementById('extended').innerText = this.showAsCurrency(item.extended);
    }
    if (key !== 'note') {
      item[key] = parseFloat(event.target.value);
    }    
    this.setState({ [stateObject]: item });
  }

  addLineItem = () => {
    let so = this.state.selectedOrder;
    let newItem = this.state.addLineItems;
    let lineItems = so.lineItems;
    lineItems.push(newItem);
    this.setState({ selectedOrder: so });
    this.setState({ addLineItems: {} });
    document.getElementById('quantity').value = '';
    document.getElementById('seedOptions').value = '';
    document.getElementById('addPrice').value = '';
    document.getElementById('extended').innerHTML = '';
  }

  addExtra = () => {
    let so = this.state.selectedOrder;
    let newExtra = this.state.addExtra;
    let extras = so.extras;
    extras.push(newExtra);
    this.setState({ selectedOrder: so});
    this.setState({ addExtras: {} });
    document.getElementById('extraQuantity').value='';
    document.getElementById('extraSeedOptions').value='';
    document.getElementById('extraNote').value='';
  }

  submitForm = () => {
    let so = this.state.selectedOrder;
    let updateOrder = JSON.parse(JSON.stringify(so));
    updateOrder.lineItems = [];
    updateOrder.extras = [];
    updateOrder.orderNotes = [];
    let soLineItems = so.lineItems;
    let soExtras = so.extras;
    let soOrderNotes = so.orderNotes;
    let uoLineItems = [];
    let uoExtras = [];
    let uoOrderNotes = [];
    soLineItems.forEach(lineItem => {
      let strippedLineItem = {};
      strippedLineItem.itemId = lineItem.itemId;
      strippedLineItem.quantity = lineItem.quantity;
      strippedLineItem.price = lineItem.price;
      uoLineItems.push(strippedLineItem);
    });
    if (soExtras) {
      soExtras.forEach(extra => {
        let strippedExtra = {};
        strippedExtra.itemId = extra.itemId;
        strippedExtra.quantity = extra.quantity;
        strippedExtra.note = extra.note;
        strippedExtra.userId = extra.userId;
        uoExtras.push(strippedExtra);
      });
    }
    if (soOrderNotes) {
      soOrderNotes.forEach(orderNote => {
        let strippedOrderNote = {};
        if (orderNote != null) {
          if (orderNote.date) {
            strippedOrderNote.date = orderNote.date;
          }else{
            strippedOrderNote.date = null;
          }
          if (orderNote.note) {
            strippedOrderNote.note= orderNote.note;
          }else{
            strippedOrderNote.note = null;
          }
          if (orderNote.userId) {
            strippedOrderNote.userId = orderNote.userId;
          }else{
            strippedOrderNote.useId = null;
          }
          uoOrderNotes.push(strippedOrderNote);
        }
      });
    }
    updateOrder.lineItems = uoLineItems;
    updateOrder.extras = uoExtras;
    updateOrder.orderNotes = uoOrderNotes;
    updateOrder.purchaseDate = updateOrder.originalPurchaseDate;
    this.saveUpdatedOrder(updateOrder);
  }

  saveUpdatedOrder = (updateOrder) => {
    let fetchUrl = this.state.baseUrl + '/purchases/' + updateOrder.id
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(updateOrder)
    };
    fetch(fetchUrl, requestOptions)
  .then(response => response.text())
  .then(response => window.location.reload())
  }

  searchFor = (key) => (event) => {
    let noSpace = event.target.value.replace(/\s/g, '').toLowerCase();
    let ul = this.state.masterJson;
    let returnArray = [];
    this.setState({ searchString: noSpace });
    ul.forEach(element => {
      let searchString1 = element.userName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      let searchString2 = element.fName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      let searchString3 = element.lName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      console.log(searchString1);
      if (noSpace === searchString1 || noSpace === searchString2 || noSpace === searchString3) {
        let addOrder = {"id": element.id, "date": element.purchaseDate, "userName": element.userName, "fName": element.fName, "lName": element.lName};
        if (!returnArray.includes(addOrder)) {
          returnArray.push(addOrder);
        }
      }
    });
    this.setState({ searchResults: returnArray });
  }

  setSearchEntity = (id) => {
    let mj = this.state.masterJson;
    mj.forEach(order => {
      if (order.id === id) {
        this.setState({
          selectedOrder: order,
          originalSelectedOrder: JSON.stringify(order),
          searchResults: []
          });
          document.getElementById("searchInput").value = "";
      }
    });
 }

 populateDropdowns = () => {
  let dropdowns = ['updateOrderStatus'];
  let seedList = this.state.allSeeds;
  let statusList = this.state.allPurchaseStatuses;
  let selectBox;
  dropdowns.forEach(dropdown => {
      selectBox = document.getElementById(dropdown);
      selectBox.setAttribute('id', dropdown);
      selectBox.innerHTML = "";
      selectBox.options.add(new Option("Select", "", true));
      if (dropdown.includes('SeedSelectList')) {
          seedList.forEach(seed => {
              selectBox.options.add(new Option(seed.name + ' (' + seed.quantityAvailable + ')', seed.id, false));
          });
      }
      if (dropdown === 'updateOrderStatus') {
          statusList.forEach(status => {
              selectBox.options.add(new Option(status.label, status.statusCode));
          });
      }
  });
}

  render() { 
    const masterJson = this.state.masterJson;
    const allOrdersDiv = this.state.selectedOrder === "none" ? "allOrdersDiv" : "hidden";
    const updateOrderDiv = allOrdersDiv === "hidden" ? "updateOrderDiv" : "hidden";
    const selectedOrder = this.state.selectedOrder;
    const verifyCancel = this.state.verifyCancel ? 'topAlignTable alertRedText' : 'hidden';
    const updateOrderStatus = this.state.updateOrderStatus ? 'topAlignTableRow' : 'hidden';
    const selectPurchaseDate = selectedOrder !== 'none' ? selectedOrder.selectPurchaseDate : '';
    const selectPaymentDate = selectedOrder !== 'none' ? selectedOrder.selectPaymentDate : '';
    const selectOrderPickedDate = selectedOrder !== 'none' ? selectedOrder.selectOrderPickedDate : '';
    const selectShippedDate = selectedOrder !== 'none' ? selectedOrder.selectShippedDate : '';
    const updatePaymentDate = this.state.updatePaymentDate === true ? 'updatePaymentDate' : 'hidden';
    const showUpdateLinkForPayment = this.state.updatePaymentDate === false ? 'updatePaymentDate' : 'hidden';
    const updatePickedDate = this.state.updatePickedDate === true ? 'updatePickedDate' : 'hidden';
    const showUpdateLinkForPicked = this.state.updatePickedDate === false ? 'updatePickedDate' : 'hidden';
    const updateShippedDate = this.state.updateShippedDate === true ? 'updateShippedDate' : 'hidden';
    const showUpdateLinkForShipped = this.state.updateShippedDate === false ? 'updateShippedDate' : 'hidden';
    const addLineItemOK = this.state.addLineItems.quantity > 0 && this.state.addLineItems.extended ? 'addLineItemOK' : 'hidden';
    const addExtraOK = this.state.addExtra.quantity > 0 && this.state.addExtra.itemId && this.state.addExtra.note ? 'addExtraOK' : 'hidden';
    const searchResultsDiv = this.state.searchString === "" ? "hidden" : "searchResultsDiv";
    const searchResults = this.state.searchResults;
    const confirmSubmit = this.state.confirmSubmit === true ? 'confirmSubmit' : 'hidden';

    return (
      <div className='adminPage'>
        <div className="adminNavDiv">
          <AdminNav />
          {/* {JSON.stringify(masterJson)}<br/> */}
          {/* {selectablePurchaseDate} */}
          {/* {this.state.selectedOrder === 'none' ? '' : JSON.stringify(selectedOrder)} */}
          {/* {JSON.stringify(this.state.addLineItems)} */}
        </div>
        <div className={allOrdersDiv}>
        
        
          <h1 className='adminSectionTitle'>Open Orders</h1><br/>
          <Link to='/allorders'>Go to all orders</Link><br/>
          <Link to='/createorder'>Create an order</Link><br/>
          <span className='adminSortText'>Search by name &nbsp;</span><input id="searchInput" type="text" onChange = {this.searchFor("userName")} /><br/>
          <div className={searchResultsDiv}>
            <table>
                  {searchResults.map((sr)=>{
                    return (
                      <tr>
                        <td>
                          <Link to="" onClick={()=>this.setSearchEntity(sr.id)}>{sr.date} {sr.fName} {sr.lName} { "<" + sr.userName + ">"}</Link>
                        </td>
                      </tr>
                    )
                  })}
            </table>
        </div>
          <p>
            <table className='adminTable topAlignTable'>
              <tr className='topAlignTableRow'>
              <td/>
                <td><Link to='' onClick={()=>this.listObjectSort(masterJson, 'id', 'masterJson', )}>ID</Link></td>
                <td><Link to='' onClick={()=>this.listObjectSort(masterJson, 'purchaseDate', 'masterJson', )}>Date</Link></td>
                <td><Link to='' onClick={()=>this.listObjectSort(masterJson, 'orderStatus', 'masterJson', )}>Status</Link></td>
                <td><Link to='' onClick={()=>this.listObjectSort(masterJson, 'user', 'masterJson', )}>Customer</Link></td>
                <td><Link to='' onClick={()=>this.listObjectSort(masterJson, 'userName', 'masterJson', )}>UserName</Link></td>
                <td><Link to='' onClick={()=>this.listObjectSort(masterJson, 'total', 'masterJson', )}>Total</Link></td>
                <td><Link to=''>Order Notes</Link></td>
              </tr>
              {masterJson.map((order)=>{
                return (
                  <tr className='topAlignTableRow adminRow'>
                    <tr  className='topAlignTableRow'>
                      <td className='topAlignTable'><Link className='separateLinkRight' to='' onClick={()=>{
                        this.setState({selectedOrder: order, originalSelectedOrder: JSON.stringify(order)});
                        this.updateSeedSelectOptions();
                        this.populateDropdowns();
                      }
                      }>Open</Link>
                        <Link className='separateLinkLeft' to='' onClick={()=>this.setShipper(order)}>Shipper </Link>
                        <Link className='separateLinkLeft' to='' onClick={()=>this.setEcon(order)}>E-con </Link>
                      </td>
                    </tr>
                    <td className='topAlignTable'>
                      <tr className='topAlignTableRow'>
                        <td>{order.id}</td>
                      </tr>
                    </td>
                    <td className='topAlignTable'>
                      <tr className='topAlignTableRow'><td>{order.purchaseDate}</td></tr>
                    </td>
                    <td className='topAlignTable'>
                      <tr className='topAlignTableRow'><td>{order.statusLabel}</td></tr>
                    </td>
                    <td className='topAlignTable'>
                    <tr className='topAlignTableRow'><td>{order.orderUser}</td></tr>
                    </td>
                    <td className='topAlignTable'>
                    <tr className='topAlignTableRow'><td>{order.userName}</td></tr>
                    </td>
                    <td className='topAlignTable'>
                    <tr className='topAlignTableRow'><td>{this.showAsCurrency(order.total)}</td></tr>
                    </td>
                    <td className='topAlignTable'>{order.orderNotes?.map((note)=>{
                      return (
                        <tr className='topAlignTableRow'>
                        <td className='topAlignTable'>{note?.date}</td>
                        <td className='topAlignTable'>{note?.note}</td>
                        </tr>
                      )
                    })}</td>
                  </tr>
                )
              })}
            </table>
          </p>
        </div>
        <div className={updateOrderDiv}>
          <h1 className='adminSectionTitle'>Update An Order</h1>
          <p>
            <Link to="" onClick={()=>this.setState({
              selectedOrder: "none",
              updateOrderStatus: false,
              originalSelectedOrder: null,
              confirmSubmit: false
              })}>Back to open orders</Link><br/>
          </p>
          <p>
            <table className='topAlignTable'>
              <tr className='topAlignTableRow'>
                <td className='topAlignTable rightBorder'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><span className='grayText'>Order #&nbsp;</span><span className='alertRedText'>{selectedOrder.id}</span></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><Link to='' onClick={()=>this.setState({verifyCancel: true})}>Cancel this order</Link></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                  <td className={verifyCancel}>Are you sure you want to cancel this order?<br/><Link to=''>Yes </Link><Link to='' onClick={()=>this.setState({verifyCancel: false})}>No</Link></td>
                  </tr>
                </td>
                <td className='topAlignTable rightBorder'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Order Date</td>
                    <td/>
                    <td className='topAlignTable'>{selectedOrder.purchaseDate}</td>
                    <td className='topAlignTable alertRedText'>{selectPurchaseDate}
                    </td>
                    <td/>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Payment Date</td>
                    <td className='topAlignTable'><span className={showUpdateLinkForPayment}><Link to='' onClick={()=>this.setState({updatePaymentDate: true})}>Change</Link></span>
                      <span className={updatePaymentDate}><span className='alertRedText'>{selectPaymentDate}</span><br/>
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.selectPaymentDate,-1,0,0)}>{'<'}</Link>
                      <span>Y</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.selectPaymentDate,1,0,0)}>{'>'}</Link>&nbsp;
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.selectPaymentDate,0,-1,0)}>{'<'}</Link>
                      <span>M</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.selectPaymentDate,0,1,0)}>{'>'}</Link>&nbsp;
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.selectPaymentDate,0,0,-1)}>{'<'}</Link>
                      <span>D</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.selectPaymentDate,0,0,1)}>{'>'}</Link><br/>
                      <Link to='' onClick={()=>this.getSelectableDate('selectPaymentDate',selectedOrder.paymentDate,0,0,0)}>Reset</Link>&nbsp;
                      <Link to='' onClick={()=>{
                        this.updateOrderDate('paymentDate', selectedOrder.selectPaymentDate);
                        this.setState({updatePaymentDate: false});
                        this.getSelectableDate('selectPaymentDate',selectedOrder.paymentDate,0,0,0);
                      }}>Accept</Link>&nbsp;
                      <Link to='' onClick={()=>{
                        this.setState({updatePaymentDate: false});
                        this.getSelectableDate('selectPaymentDate',selectedOrder.paymentDate,0,0,0);
                      }}>Close</Link>
                      </span>
                    </td>
                    <td className='topAlignTable'>{selectedOrder.paymentDate}</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Picked Date</td>
                    
                    <td className='topAlignTable'><span className={showUpdateLinkForPicked}><Link to='' onClick={()=>this.setState({updatePickedDate: true})}>Change</Link></span>
                      <span className={updatePickedDate}><span className='alertRedText'>{selectOrderPickedDate}</span><br/>
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.selectOrderPickedDate,-1,0,0)}>{'<'}</Link>
                      <span>Y</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.selectOrderPickedDate,1,0,0)}>{'>'}</Link>&nbsp;
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.selectOrderPickedDate,0,-1,0)}>{'<'}</Link>
                      <span>M</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.selectOrderPickedDate,0,1,0)}>{'>'}</Link>&nbsp;
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.selectOrderPickedDate,0,0,-1)}>{'<'}</Link>
                      <span>D</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.selectOrderPickedDate,0,0,1)}>{'>'}</Link><br/>
                      <Link to='' onClick={()=>this.getSelectableDate('selectOrderPickedDate',selectedOrder.orderPickedDate,0,0,0)}>Reset</Link>&nbsp;
                      <Link to='' onClick={()=>{
                        this.updateOrderDate('orderPickedDate', selectedOrder.selectOrderPickedDate);
                        this.setState({updatePickedDate: false});
                        this.getSelectableDate('selectOrderPickedDate',selectedOrder.orderPickedDate,0,0,0);
                      }}>Accept</Link>&nbsp;
                      <Link to='' onClick={()=>{
                        this.setState({updatePickedDate: false});
                        this.getSelectableDate('selectOrderPickedDate',selectedOrder.orderPickedDate,0,0,0);
                      }}>Close</Link>
                      </span>
                    </td>
                    <td className='topAlignTable'>{selectedOrder.orderPickedDate}</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Shipped Date</td>
                    <td className='topAlignTable'><span className={showUpdateLinkForShipped}><Link to='' onClick={()=>this.setState({updateShippedDate: true})}>Change</Link></span>
                      <span className={updateShippedDate}><span className='alertRedText'>{selectShippedDate}</span><br/>
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.selectShippedDate,-1,0,0)}>{'<'}</Link>
                      <span>Y</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.selectShippedDate,1,0,0)}>{'>'}</Link>&nbsp;
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.selectShippedDate,0,-1,0)}>{'<'}</Link>
                      <span>M</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.selectShippedDate,0,1,0)}>{'>'}</Link>&nbsp;
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.selectShippedDate,0,0,-1)}>{'<'}</Link>
                      <span>D</span>
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.selectShippedDate,0,0,1)}>{'>'}</Link><br/>
                      <Link to='' onClick={()=>this.getSelectableDate('selectShippedDate',selectedOrder.shippedDate,0,0,0)}>Reset</Link>&nbsp;
                      <Link to='' onClick={()=>{
                        this.updateOrderDate('shippedDate', selectedOrder.selectShippedDate);
                        this.setState({updateShippedDate: false});
                        this.getSelectableDate('selectShippedDate',selectedOrder.shippedDate,0,0,0);
                      }}>Accept</Link>&nbsp;
                      <Link to='' onClick={()=>{
                        this.setState({updateShippedDate: false});
                        this.getSelectableDate('selectShippedDate',selectedOrder.shippedDate,0,0,0);
                      }}>Close</Link>
                      </span>
                    </td>
                    <td className='topAlignTable'>{selectedOrder.shippedDate}</td>
                  </tr>
                </td>
                <td  className='topAlignTable rightBorder'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Status</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>{selectedOrder.statusLabel}</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><Link to='' onClick={()=>this.setState({updateOrderStatus: true})}>Change status</Link></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className={updateOrderStatus}>
                      <select name='statuses' id='updateOrderStatus' onClick={this.updateOrder('orderStatus', 'updateOrderStatus')}>
                        {/* <option value ='' >Select</option>
                        <option value='100'>Ordered</option>
                        <option value='101'>Paid</option>
                        <option value='102'>Picked</option>
                        <option value='103'>Shipped</option>
                        <option value='190'>Partial payment</option>
                        <option value='200'>Complete</option>
                        <option value='201'>Complete - no tracking</option>
                        <option value='300'>Cancelled</option> */}
                      </select>
                    </td>
                  </tr>
                </td>
                <td className='topAlignTable rightBorder'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Purchaser</td>
                  </tr>
                  <tr className='topAlignTable'>
                    <td className='topAlignTable'>{selectedOrder.purchaserName}</td>
                  </tr>
                </td>
                <td className='topAlignTable rightBorder'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Delivery Notes</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><input type='text' id='addDeliveryNote' onKeyUp={this.updateOrder('deliveryNotes','addDeliveryNote')}/></td>
                  </tr>
                  <tr className='topAlignTable'>
                    <td className='topAlignTable noteColumn'>{selectedOrder.deliveryNotes}</td>
                  </tr>
                </td>
                <td>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable grayText'>Order Notes</td>
                  </tr>
                  
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><input type='text' id='addOrderNote' onKeyUp={this.addOrderNote('addOrderNote')}/></td>
                  </tr>

                  {selectedOrder.orderNotes?.map((note)=>{
                    return (
                      <tr className='topAlignTableRow'>
                        <td className='topAlignTable noteColumn'>{note?.date} {note?.note} {note?.user}</td>
                      </tr>
                    )
                  })}
                </td>
              </tr>
            </table>
          </p>
          <p>
            <table className='topAlignTable'>
              <span className='boldGray'>Delivery info</span>
                <tr className='topAlignTableRow'>
                  <td className='topAlignTable'>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.fName + ' ' + selectedOrder.lName}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.deliveryAddress1}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.deliveryAddress2}</td>
                    </tr>
                  </td>
                  <td className='topAlignTable rightBorder'>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable rightCell'>{selectedOrder.city + ', ' + selectedOrder.state}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable rightCell'>{selectedOrder.zip}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable rightCell'>{selectedOrder.phone}</td>
                    </tr>
                  </td>
                  <td className='topAlignTable rightBorder'>
                  <tr className='topAlignTableRow'>
                      <td className='topAlignTable grayText'>Shipped Via</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.shippedVia}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>
                      <input type='text' id='updateShippedVia' onKeyUp={this.updateOrder('shippedVia', 'updateShippedVia')}/>
                      {/* <input list='ShippedVia' id='updateShippedVia'/>
                      <datalist id='ShippedVia'>
                        <option value='FedEx'/>
                        <option value='UPS'/>
                        <option value='USPS'/>
                      </datalist> */}
                      </td>
                    </tr>
                  </td>
                  <td className='topAlignTable'>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable grayText'>Tracking #</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.trackingNumber}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'><input type='text' id='updateTrackingNumber' onKeyUp={this.updateOrder('trackingNumber', 'updateTrackingNumber')}/></td>
                    </tr>
                  </td>
                </tr>
            </table>
            <table className='topAlignTable'>
              <h3 className='boldGray'>Items</h3>
              <tr className='topAlignTableRow'>
                <td/>
                <td className='topAlignTable grayText'>Quantity</td>
                <td className='topAlignTable grayText'>Item</td>
                <td className='topAlignTable rightCell grayText'>Price</td>
                <td className='topAlignTable rightCell grayText'>Extended</td>
              </tr>
              <tr className='topAlignTableRow'>
                <td/>
                <td><input id='quantity' type='number' min='1' step='1' onBlur={this.addNewItem('addLineItems', 'quantity')}></input></td>
                <td><select id='seedOptions' onChange={this.addNewItem('addLineItems', 'itemId')}></select></td>
                <td><input id='addPrice' type='number' min='0' step='.01' onBlur={this.addNewItem('addLineItems', 'price')}></input></td>
                <td className='rightCell'><span id='extended'/></td>
                <td className={addLineItemOK}><Link to='' onClick={()=>this.addLineItem()}>Add this item</Link></td>
              </tr>
              {selectedOrder.lineItems?.map((lineItem)=>{
                return (
                  <tr className='topAlignTableRow adminRow'>
                    <td className='topAlignTable separateLinkRight'><Link to='' onClick={()=>this.removeArrayItem('lineItems', lineItem)}>Remove</Link></td>
                    <td className='topAlignTable'>{lineItem.quantity}</td>
                    <td className='topAlignTable'>{lineItem.seedName}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(lineItem.price)}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(lineItem.price * lineItem.quantity)}</td>
                  </tr>
                )
              })}
              <br/>
              <h3 className='boldGray'>Extras</h3>
              <tr className='topAlignTable'>
                <td/>
                <td><input id='extraQuantity' type='number' min='1' step='1' onBlur={this.addNewItem('addExtra', 'quantity')}></input></td>
                <td><select id='extraSeedOptions' onChange={this.addNewItem('addExtra', 'itemId')}></select></td>
                <td className='rightCell'><span>$0.00</span></td>
                <td className='rightCell'><span>$0.00</span></td>
                <td><input id='extraNote' type='text' onChange={this.addNewItem('addExtra', 'note')}></input></td>
                <td className={addExtraOK}><Link to='' onClick={()=>this.addExtra()}>Add this extra</Link></td>
              </tr>
              {selectedOrder.extras?.map((extra)=>{
                return (
                  <tr className='topAlignTableRow adminRow'>
                    <td className='topAlignTable separateLinkRight'><Link to='' onClick={()=>this.removeArrayItem('extras', extra)}>Remove</Link></td>
                    <td className='topAlignTable'>{extra.quantity}</td>
                    <td className='topAlignTable'>{extra.seedName}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(0)}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(0)}</td>
                    <td className='topalignTable'>{extra.note + ' ' + extra.user}</td>
                  </tr>
                )
              })}
              <br/>
              <tr className='topAlignTableRow'>
                <td/>
                <td className='topAlignTable'/>
                <td className='topAlignTable'>Discount Code</td>
                <td className='topAlignTable rightCell'>{selectedOrder.discountCode === null ? '-' : selectedOrder.discountCode}</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.discountAmount)}</td>
              </tr>
              <tr className='topAlignTableRow'>
                <td/>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Pre-tax</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.preTax)}</td>
              </tr>
              <tr className='topAlignTableRow'>
                <td/>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Tax</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.tax)}</td>
              </tr>
              <tr className='topAlignTableRow'>
                <td/>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Shipping</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.shippingFee)}</td>
              </tr>
              <tr className='topAlignTableRow'>
                <td/>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Total</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.total)}</td>
              </tr>
            </table>
            <table className='topAlignTable'>
            </table>
            <Link to='' onClick={()=>this.resetForm()}>Reset this form</Link><br/>
            <Link to='' onClick={()=>this.setState({confirmSubmit: true})}>Submit</Link>
            <div className={confirmSubmit}>
              <span className='alertRedText'>Are you sure you want to save these changes?</span>&nbsp;
              <Link to='' onClick={()=>this.submitForm()}>Yes</Link>&nbsp;<Link to='' onClick={()=>this.setState({confirmSubmit: false})}>No</Link>
            </div>
          </p>
        </div>
      </div>
    );
  }
}
 
export default OpenOrders;