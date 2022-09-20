import React, { Component } from "react";
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Pricing extends Component {
  state = {
    baseUrl: "http://www.boutiqueseedsnm.com/",
    allPricing: [],
    sortAlphaPricing: [],
    dataSet: "ID",
    sortDirection: "descending",
    sortedList: [],
    searchString: "",
    searchResults: [],
    selectedPricing: "none",
    newPricing: {},
    addPricing: false,
    lastCheck: false
  };

  componentDidMount = () => {
    this.getFetch("pricing", null, "allPricing", "ascending")
  }

  getFetch = (endpoint, path, statePosition, sortOrder) => {
    let pathUrl = this.state.baseUrl + endpoint;
    if (path != null) {
      pathUrl = pathUrl + path;
    }
    this.doGetFetch(pathUrl, statePosition, sortOrder);
  }

  doGetFetch = (fetchUrl, statePosition, sortOrder) => {
    let requestOptions = {
      method: 'GET'
    };
    
    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.objectSort(result, "id", statePosition, sortOrder, true);
        this.sortList(result, "id");
      })
  }

  objectSort = (obj, sortKey, statePosition, sortOrder, updateAlphas) => {
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
    if (updateAlphas) {
      setTimeout(() => {
        this.objectSort(this.state.allPricing, "name", "sortAlphaPricing", "ascending", false);
      }, 100);
    }
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

  searchFor = (key) => (event) => {
    let noSpace = event.target.value.replace(/\s/g, '').toLowerCase();
    let ap = this.state.allPricing;
    let returnArray = [];
    this.setState({ searchString: noSpace });
    ap.forEach(element => {
      let searchString = element[key].replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      if (noSpace === searchString && noSpace.length > 0) {
        returnArray.push({"id": element.id, "label": element.label})
      }
      });
      this.setState({ searchResults: returnArray });
    }

  setSearchEntity = (id) => {
    let ap = this.state.allPricing;
    ap.forEach(element => {
      if (element.id === id) {
        this.setState({
          selectedPricing: element,
          newPricing: element,
          searchResults: []
          });
          document.getElementById("searchInput").value = "";
      }
    });
 }

 showAsCurrency = (amount) => {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amount);
}

buildNewPricing = (key) => (event) => {
  let np = this.state.newPricing;
  let newValue = event.target.value;
  np[key] = newValue;
  this.setState({ newPricing: np });
}

clearFieldsAndPricing = () => {
  let fields = document.getElementsByClassName('clearField');
  fields.forEach(field => {
    field.value = "";
  });
  this.setState({ 
    addPricing: false,
    newPricing: {}
  });
}

buildPricingBoolean = (key) => {
  let np = this.state.newPricing;
  let notKey = !np[key];
  np[key] = notKey;
  this.setState({ newPricing: np });
}

postPutFetch = (method) => {
  let np = this.state.newPricing;
  method = method.toUpperCase();
  if (method === "POST") {
    np.id = null;
  }
  this.doPostPutFetch(method, np);
}

doPostPutFetch = (method, pricing) => {

  let fetchUrl = "http://www.boutiqueseedsnm.com/pricing";
  if (method === "PUT") {
    fetchUrl = fetchUrl + "/" + pricing.id;
  }

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(pricing);

  let requestOptions = {
    method: method,
    headers: myHeaders,
    body: raw
  };

  fetch(fetchUrl, requestOptions)
  .then(response =>this.reloadPage())
}

reloadPage = () => {
  window.location.reload();
}

addRequirement = () => (event) => {
  let req = event.target.value;
  let p = this.state.newPricing;
  let existingReqs = p.requirements;
  if (existingReqs === null || existingReqs === undefined) {
    p.requirements = [req];
    this.setState({ newPricing: p });
  }
  if (!p.requirements.includes(req)) {
    existingReqs.push(req);
    this.setState({ newPricing: p });
  }
  document.getElementById('inputUpdateRequirement').value = '';
  document.getElementById('inputAddRequirement').value = '';
}

removeRequirement = (req) => {
  let p = this.state.newPricing;
  let existingReqs = p.requirements;
  let filteredArray = existingReqs.filter(data => data !== req);
  p.requirements = filteredArray;
  this.setState({ newPricing: p });
}

  render() {
    const dataSet = "Sorted by " + this.state.dataSet;
    const searchResults = this.state.searchResults;
    const sortedList = this.state.sortedList ? this.state.allPricing : this.state.sortedList;
    const pricingListDiv = this.state.selectedPricing !== "none" || this.state.addPricing === true ? "hidden" : "plantListDiv";
    const selectedPricing = this.state.selectedPricing;
    const newPricing = this.state.newPricing;
    const lastCheck = this.state.lastCheck ? "lastCheck" : "hidden";
    const updatePricingDiv = this.state.selectedPricing === "none" || this.state.addPricing === true ? "hidden" : "selectedSeedDiv";
    const selectedPricingDiv = this.state.selectedPricing === "none" || this.state.addPricing === true ? "hidden" : "selectedSeedDiv";
    const addPricingDiv = this.state.addPricing === true ? "addPricingDiv" : "hidden";
    return (
      <div className="adminPage">
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className={selectedPricingDiv}>
        <h1 className='adminSectionTitle'>Update A Pricing Structure</h1>
        <br/>{JSON.stringify(newPricing)}<br/>
        <p>
            <Link to="" onClick={()=>{this.setState({
                        selectedPricing: "none",
                        newPricing: {}
                        });
                        this.clearFieldsAndPricing();
                      }
                    }>Back to pricing list</Link>
          </p>
          <p>
            <table className='adminTable'>
              <tr className='adminRow'>
                <td>Label</td>
                <td>Description</td>
                <td>Requirements1</td>
                <td>Discount</td>
                <td>Minimum Order</td>
                <td>Allow Other Discounts</td>
                <td>Active</td>
              </tr>
              <tr className='adminRow'>
                <td>{selectedPricing.label}</td>
                <td>{selectedPricing.description}</td>
                <td>{selectedPricing.requirements?.toString()}</td>
                <td>{selectedPricing.discount === undefined ? "" : selectedPricing.discount + "%"}</td>
                <td>{selectedPricing.minimumOrder === undefined ? "" : this.showAsCurrency(selectedPricing.minimumOrder)}</td>
                <td>{selectedPricing.allowDiscount?.toString()}</td>
                <td>{selectedPricing.active?.toString()}</td>
              </tr>
            </table>
          </p>
        </div>
        <div className={pricingListDiv}>
          <h1 className='adminSectionTitle'>Pricing Structures</h1>
          <p className='adminSortText'>{dataSet}</p>
          <div className='searchDiv adminSortText'>Search by label &nbsp;
            <input id="searchInput" type="text" onChange = {this.searchFor("label")} />
          </div>
          <div className="searchResultsDiv">
            <table>
              {searchResults.map((price)=>{
                return (
                  <tr>
                    <td>
                      <Link to="" onClick={()=>this.setSearchEntity(price.id)}>{price.label}</Link>
                    </td>
                  </tr>
                  )
                })}
            </table>
          </div>
          <table className='adminTable'>
            <tr className='adminRow'>
              <td></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>ID</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "label")}}>Label</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "description")}}>Description</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "requirements")}}>Requirements2</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "discount")}}>Discount</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "minimumOrder")}}>Minimum Order</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "allowDiscount")}}>Allow Other Discounts</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "active")}}>Active</Link></td>
            </tr>
              {sortedList.map((price) =>{
              return (
                <tr className='adminRow'>
                  <td>
                    <Link to="" onClick={()=>this.setState({
                      selectedPricing: price,
                      newPricing: price
                      })}>Open</Link>
                  </td>
                  <td>{price.id}</td>
                  <td>{price.label}</td>
                  <td>{price.description}</td>
                  <td>{price.requirements?.toString()}</td>
                  <td>{price.discount + "%"}</td>
                  <td>{price.minimumOrder}</td>
                  <td>{price.allowDiscount === true ? "Yes" : "No"}</td>
                  <td>{price.active?.toString()}</td>
                </tr>
              )
            })}
          </table>
          <p>
          <Link to="" onClick={()=>{
            this.setState({addPricing: true})
          }}>Add pricing</Link></p>
        </div>
        <div className={updatePricingDiv}>
        <p>
          <table className='adminTable topAlignTable'>
            <tr><td></td></tr>
            <tr className='topAlignTable'>
                <td>Label</td>
                <td><input type="text" className="clearField" name = "label" onChange={this.buildNewPricing("label")} defaultValue={selectedPricing.label}/></td>
            </tr>
            <tr>
            <td>Description</td>
              <td><input type="text" className="clearField" name = "description" onChange={this.buildNewPricing("description")} defaultValue={selectedPricing.description}/></td>
            </tr>
            <tr>
            <td>Requirements3</td>
              <td><input id='inputUpdateRequirement' type="text" className="clearField" name = "description" onBlur={this.addRequirement()}/></td>
            </tr>
            {selectedPricing.requirements?.map((req)=>{
              return (
                <tr>
                <td/>
                  <td>
                    <Link to='' onClick={()=>this.removeRequirement(req)}>X</Link> {req}
                  </td>
                </tr>
              )
            })}
            <tr>
            <td>Discount</td>
              <td><input type="text" className="clearField" name = "discount" onChange={this.buildNewPricing("discount")} defaultValue={selectedPricing.discount}/></td>
            </tr>    
            <tr>
            <td>Minimum Order</td>
              <td><input type="text" className="clearField" name = "minimumOrder" onChange={this.buildNewPricing("minimumOrder")} defaultValue={selectedPricing.minimumOrder}/></td>
            </tr>
            <tr>
              <td>Allow Discount</td>
              <td>
                <input className='clearField' id = "updateAllowDiscount"
                type = "checkbox"
                checked = {newPricing?.allowDiscount}
                onChange={()=>this.buildPricingBoolean("allowDiscount")}/>
              </td>
            </tr>
            <tr>
              <td>Active</td>
              <td>
                <input className='clearField' id = "updateActive"
                type = "checkbox"
                checked = {newPricing?.active}
                onChange={()=>this.buildPricingBoolean("active")}/>
              </td>
            </tr>
          </table>
        </p>
        <Link to="" onClick={()=>this.setState({lastCheck: true})}>Update this pricing</Link>
          <div className={lastCheck}>
            <span className='alertRedText'>
              Are you sure you want to update this pricing? 
            </span>&nbsp;
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("PUT")}>Yes</Link>
        </div>
        </div>
        <div className={addPricingDiv}>
        <h1 className='adminSectionTitle'>Add A Pricing Structure</h1>
        <br/>{JSON.stringify(newPricing)}<br/>
        <p>
            <Link to="" onClick={()=>{this.setState({
                        selectedPricing: "none",
                        newPricing: {},
                        addPricing: false
                        });
                        this.clearFieldsAndPricing();
                      }
                    }>Back to pricing list</Link>
          </p>
        <p>
          <table className='adminTable topAlignTable'>
            <tr><td></td></tr>
            <tr className='topAlignTable'>
                <td>Label</td>
                <td><input type="text" className="clearField" name = "label" onChange={this.buildNewPricing("label")}/></td>
            </tr>
            <tr>
            <td>Description</td>
              <td><input type="text" className="clearField" name = "description" onChange={this.buildNewPricing("description")}/></td>
            </tr>
            <tr>
            <td>Discount</td>
              <td><input type="text" className="clearField" name = "discount" onChange={this.buildNewPricing("discount")}/></td>
            </tr>
            <tr>
            <td>Requirements4</td>
              <td><input id='inputAddRequirement' type="text" className="clearField" name = "discount" onBlur={this.addRequirement()}/></td>
            </tr>
            {newPricing.requirements?.map((req)=>{
              return (
                <tr>
                <td/>
                  <td>
                    <Link to='' onClick={()=>this.removeRequirement(req)}>X</Link> {req}
                  </td>
                </tr>
              )
            })}
            <tr>
            <td>Minimum Order</td>
              <td><input type="text" className="clearField" name = "minimumOrder" onChange={this.buildNewPricing("minimumOrder")}/></td>
            </tr>
            <tr>
              <td>Allow Discount</td>
              <td>
                <input className='clearField' id = "addAllowDiscount"
                type = "checkbox"
                checked = {newPricing?.allowDiscount}
                onChange={()=>this.buildPricingBoolean("allowDiscount")}/>
              </td>
            </tr>
            <tr>
              <td>Active</td>
              <td>
                <input className='clearField' id = "addActive"
                type = "checkbox"
                checked = {newPricing?.active}
                onChange={()=>this.buildPricingBoolean("active")}/>
              </td>
            </tr>
          </table>
        </p>
        <Link to="" onClick={()=>this.setState({lastCheck: true})}>Add this pricing</Link>
          <div className={lastCheck}>
            <span className='alertRedText'>
              Are you sure you want to add this pricing? 
            </span>&nbsp;
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("POST")}>Yes</Link>
        </div>
        </div>
      </div>
    );
  }
}

export default Pricing;
