import React, { Component } from 'react';

class Orders extends Component {
  state = { 
    baseUrl: 'http://localhost:8080/',
    openOrders: [],
    activeUsers: [],
    allPurchaseStatuses: [],
    allPricingStructures: [],
    allDiscounts: [],
    allSeeds: [],
    masterJson: []

   } 

  componentDidMount = () => {
    this.getFetch('purchases', 'openpurchases', 'openOrders', 'id', 'ascending', 'activeUsers')
  }

  
  createMasterJson = () => {
    let initialJson = [];
    let masterJson = [];
    let orders = this.state.openOrders;
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
      lineItems.forEach(lineItem => {
        console.log(lineItem.itemId);
        seeds.forEach(seed => {
          if (lineItem.itemId === seed.id) {
            lineItem.seedName = seed.name;
          }
        });
      });
      initialJson.push(order);
    });
    initialJson.forEach(order => {
      pricing.forEach(price => {
        if (order.pricingStructure === price.id) {
          order.pricingLabel = price.label;
          order.pricingDescription = price.description;
          order.allowDiscount = price.allowDiscount;
        }
      });
    });
    masterJson.push(initialJson);
    this.setState({ masterJson: masterJson });
  }

  // crossReference = (value, key, objectArray, returnKey) => {
  //   value = value.toString();

  //   objectArray.forEach(element => {
  //     let elemKey = element[key];
  //     if (elemKey.toString() === value) {
  //       let returnValue = element[returnKey];
  //       console.log('returning: ' + returnValue);
  //     }
  //   });
  // }

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
        // setTimeout(() => {
        //   this.crossReference("2", "id", this.state.allSeeds, "name");
        // }, 200);
        
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

  render() { 
    const openOrders = this.state.openOrders;
    const activeUsers = this.state.activeUsers;
    const purchaseStatuses = this.state.allPurchaseStatuses;
    const discounts = this.state.allDiscounts;
    const allSeeds = this.state.allSeeds;
    const masterJson = this.state.masterJson;
    const pricingStructures = this.state.allPricingStructures;
    return (
      <div className='adminPage'>
      openOrders: {JSON.stringify(openOrders)}<br/><br/>
      activeUsers: {JSON.stringify(activeUsers)}<br/><br/>
      purchaseStatuses: {JSON.stringify(purchaseStatuses)}<br/><br/>
      discounts: {JSON.stringify(discounts)}<br/><br/>
      seeds: {JSON.stringify(allSeeds)}<br/><br/>
      masterJson: {JSON.stringify(masterJson)}<br/><br/>
      pricingStructures: {JSON.stringify(pricingStructures)}
      </div>
    );
  }
}
 
export default Orders;