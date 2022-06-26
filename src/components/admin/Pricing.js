import React, { Component } from "react";
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Pricing extends Component {
  state = {
    baseUrl: "http://localhost:8080/",
    allPricing: [],
    sortAlphaPricing: [],
    dataSet: "ID",
    sortDirection: "descending",
    sortedList: [],
    searchString: "",
    searchResults: [],
    selectedPrice: {},
    newPrice: {},

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



  render() {
    const dataSet = "Sorted by " + this.state.dataSet;
    const searchResults = this.state.searchResults;
    const sortedList = this.state.sortedList ? this.state.allPricing : this.state.sortedList;
    return (
      <div className="adminPage">
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className="selectedPricingDiv">
        <h1 className='adminSectionTitle'>Update A Pricing Structure</h1>

        </div>
        <div className="pricingListDiv">
          <h1 className='adminSectionTitle'>Pricing Structures</h1>
          <p className='adminSortText'>{dataSet}</p>
          {/* <div className='searchDiv adminSortText'>Search by name &nbsp;
            <input id="searchInput" type="text" onChange = {this.searchFor("name")} />
          </div>
          <div className="searchResultsDiv">
            <table>
              {searchResults.map((seed)=>{
                return (
                  <tr>
                    <td>
                      <Link to="" onClick={()=>this.setSearchEntity(seed.id)}>{seed.name}</Link>
                    </td>
                  </tr>
                )
              })}
          </table>
        </div> */}
        <table className='adminTable'>
          <tr className='adminRow'>
            <td></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>ID</Link></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>Label</Link></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>Description</Link></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>Discount</Link></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>Minimum Order</Link></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>Allow Other Discounts</Link></td>
            <td><Link to="" onClick={()=>{this.sortList(this.state.allPricing, "id")}}>Active</Link></td>
          </tr>
              {sortedList.map((price) =>{
              return (
                <tr className='adminRow'>
                  <td>
                    <Link to="" onClick={()=>this.setState({
                      selectedPrice: price,
                      newPrice: price
                      })}>Open</Link>
                  </td>
                  <td>{price.id}</td>
                  <td>{price.label}</td>
                  <td>{price.description}</td>
                  <td>{price.discount + "%"}</td>
                  <td>{price.minimumOrder}</td>
                  <td>{price.allowDiscount === true ? "Yes" : "No"}</td>
                  <td>{price.active?.toString()}</td>
                </tr>
              )
            })}
        </table>


        </div>
        <div className="updatePricingDiv">

        </div>
        <div className="addPricingDiv">
        <h1 className='adminSectionTitle'>Update A Seed</h1>

        </div>
      </div>
    );
  }
}

export default Pricing;
