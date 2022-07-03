import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Orders extends Component {
  state = { 
    baseUrl: 'http://localhost:8080/',
    openOrders: [],
    activeUsers: [],
    allPurchaseStatuses: [],
    allPricingStructures: [],
    allDiscounts: [],
    allSeeds: [],
    masterJson: [],
    selectedOrder: "none",

   } 

  componentDidMount = () => {
    this.getFetch('purchases', 'openpurchases', 'openOrders', 'id', 'ascending', 'activeUsers')
  }

  
  createMasterJson = () => {
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
        });
      }
      let orderNotes = order.orderNotes;
      if (orderNotes) {
        orderNotes.forEach(orderNote => {
          users.forEach(user => {
            if (orderNote) {
              if (orderNote.userId === user.id) {
                orderNote.user = user.fName + ' ' + user.lName;
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
      order.purchaseDate = this.parseDate(order.purchaseDate);
      if (order.shippedDate) {order.shippedDate = this.parseDate(order.shippedDate)};
      if (order.paymentDate) {order.paymentDate = this.parseDate(order.PaymentDate)};
      if (order.orderPickedDate) {order.orderPickedDate = this.parseDate(order.orderPickedDate)};
      if (order.orderCancelledDate) {order.orderCancelledDate = this.parseDate(order.orderCancelledDate)};
      order.orderNotes.forEach(note =>{
        if (note){
          note.date = this.parseDate(note.date);
        }
      });
    });
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

  setShipper = () => {
    console.log ('here');
    let so = JSON.stringify(this.state.selectedOrder);
   localStorage.setItem('shipperInfo', so);
  }

  render() { 
    const masterJson = this.state.masterJson;
    const openOrdersDiv = this.state.selectedOrder === "none" ? "openOrdersDiv" : "hidden";
    const updateOrderDiv = openOrdersDiv === "hidden" ? "updateOrderDiv" : "hidden";
    const selectedOrder = this.state.selectedOrder;
    return (
      <div className='adminPage'>
        <div className="adminNavDiv">
          <AdminNav />
          {/* {JSON.stringify(masterJson)} */}
          {this.state.selectedOrder === 'none' ? '' : JSON.stringify(selectedOrder)}
        </div>
        <div className={openOrdersDiv}>
          <h1 className='adminSectionTitle'>Open Orders</h1>
          <p>
            <table className='adminTable'>
              <tr>
              <td/>
                <td>ID</td>
                <td>Date</td>
                <td>Status</td>
                <td>User</td>
                <td>Total</td>
                <td>Order Notes</td>
              </tr>
              {masterJson.map((order)=>{
                return (
                  <tr>
                    <td><Link to='' onClick={()=>this.setState({selectedOrder: order})}>Open</Link></td>
                    <td>{order.id}</td>
                    <td>{order.purchaseDate}</td>
                    <td>{order.statusLabel}</td>
                    <td>{order.userName}</td>
                    <td>{this.showAsCurrency(order.total)}</td>
                    <td>{order.orderNotes?.map((note)=>{
                      return (
                        <tr>
                        <td>{note?.date}</td>
                        <td>{note?.note}</td>
                        </tr>
                      )
                    })}</td>
                  </tr>
                )
              })}
            </table>
          </p>
        </div>
        {/* Update Order Div */}
        <div className={updateOrderDiv}>
          <h1 className='adminSectionTitle'>Update An Order</h1>
          <p>
            <Link to="" onClick={()=>this.setState({selectedOrder: "none"})}>Back to open orders</Link><br/>
            <Link target='_blank' to='/shipper' onClick={()=>this.setShipper()}>Set Shipper</Link>

          </p>
          <p>
            <table className='topAlignTable'>
              <tr className='topAlignTableRow'>
                <td className='topAlignTable'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>{'Order #: ' + selectedOrder.id}</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><Link to=''>Cancel</Link></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                  <td className='topAlignTable alertRedText'>Are you sure?<br/><Link to=''>Yes </Link><Link to=''>No</Link></td>
                  </tr>
                </td>
                <td className='topAlignTable'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>Order Date</td>
                    <td className='topAlignTable'>{selectedOrder.purchaseDate}</td>
                    <td className='topAlignTable'><input type='text'/></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>Payment Date</td>
                    <td className='topAlignTable'>{selectedOrder.paymentDate}</td>
                    <td className='topAlignTable'><input type='text'/></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>Picked Date</td>
                    <td className='topAlignTable'>{selectedOrder.orderPickedDate}</td>
                    <td className='topAlignTable'><input type='text'/></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>Shipped Date</td>
                    <td className='topAlignTable'>{selectedOrder.shippedDate}</td>
                    <td className='topAlignTable'><input type='text'/></td>
                  </tr>
                </td>
                <td  className='topAlignTable'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>Status</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>{selectedOrder.statusLabel}</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><Link to=''>Move to ___</Link></td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>
                      <select name='statuses' id='updateOrderStatus'>
                        <option value='100'>Ordered</option>
                        <option value='101'>Paid</option>
                        <option value='102'>Picked</option>
                        <option value='103'>Shipped</option>
                        <option value='104'>Partial payment</option>
                        <option value='200'>Complete</option>
                        <option value='201'>Complete - no tracking</option>
                        <option value='300'>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                </td>
                <td className='topAlignTable'>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>{'Purchaser: ' + selectedOrder.purchaserName}</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>Order Notes</td>
                  </tr>
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'><input type='text'/></td>
                  </tr>

                  {selectedOrder.orderNotes?.map((note)=>{
                    return (
                      <tr className='topAlignTableRow'>
                        <td className='topAlignTable'>{note?.date} {note?.note} {note?.user}</td>
                      </tr>
                    )
                  })}
                </td>
              </tr>
            </table>
            <table className='topAlignTable'>
              <Link to=''>Delivery Info</Link>
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
                  <td className='topAlignTable'>
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
                  <td className='topAlignTable'>
                  <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>Shipped Via</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.shippedVia}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'><input type='text'/></td>
                    </tr>
                  </td>
                  <td className='topAlignTable'>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>Tracking #</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.trackingNumber}</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'><input type='text'/></td>
                    </tr>
                  </td>
                  <td className='topAlignTable'>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>Shipping Notes</td>
                    </tr>
                    <tr className='topAlignTableRow'>
                      <td className='topAlignTable'>{selectedOrder.shippingNotes}</td>
                    </tr>
                  </td>
                </tr>
            </table>
            <table className='topAlignTable'>
              <span>Items</span>
              <tr className='topAlignTableRow'>
                <td className='topAlignTable'>Quantity</td>
                <td className='topAlignTable'>Item</td>
                <td className='topAlignTable rightCell'>Price</td>
                <td className='topAlignTable rightCell'>Extended</td>
              </tr>
              {selectedOrder.lineItems?.map((lineItem)=>{
                return (
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>{lineItem.quantity}</td>
                    <td className='topAlignTable'>{lineItem.seedName}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(lineItem.price)}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(lineItem.price * lineItem.quantity)}</td>
                  </tr>
                )
              })}
              <br/>
              <span>Extras</span>
              {selectedOrder.extras?.map((extra)=>{
                return (
                  <tr className='topAlignTableRow'>
                    <td className='topAlignTable'>{extra.quantity}</td>
                    <td className='topAlignTable'>{extra.seedName}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(0)}</td>
                    <td className='topAlignTable rightCell'>{this.showAsCurrency(0)}</td>
                    <td className='topalignTable'>{extra.note}</td>
                  </tr>
                )
              })}

              <br/>

              <tr className='topAlignTableRow'>
                <td className='topAlignTable'/>
                <td className='topAlignTable'>Discount Code</td>
                <td className='topAlignTable rightCell'>{selectedOrder.discountCode === null ? '-' : '"' + selectedOrder.discountCode + '"'}</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.discountAmount)}</td>
              </tr>

              <tr className='topAlignTableRow'>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Pre-tax</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.preTax)}</td>
              </tr>

              <tr className='topAlignTableRow'>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Tax</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.tax)}</td>
              </tr>

              <tr className='topAlignTableRow'>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Shipping</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.shippingFee)}</td>
              </tr>

              <tr className='topAlignTableRow'>
                <td className='topAlignTable'/>
                <td className='topAlignTable'/>
                <td className='topAlignTable rightCell'>Total</td>
                <td className='topAlignTable rightCell'>{this.showAsCurrency(selectedOrder.total)}</td>
              </tr>

            </table>
            <table className='topAlignTable'>

            </table>
          </p>
        </div>
      </div>
    );
  }
}
 
export default Orders;