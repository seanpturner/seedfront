import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Plants extends Component {
  state = { 
    baseUrl: "http://localhost:8080/",
    allLines: [],
    sortAlphaLines: [],
    allPlants: [],
    sortAlphaPlants: [],
    viewListSort: "descending",

   } 

  componentDidMount = () => {
    this.getFetch("lines", null, "allLines", "ascending");
    this.getFetch("plants", null, "allPlants", "ascending");
  }

  getFetch = (endpoint, path, statePosition, sortOrder) => {
    let pathUrl = this.state.baseUrl + endpoint;
    if (path != null) {
      pathUrl = pathUrl + path;
    }
    this.doFetch(pathUrl, statePosition, sortOrder);
  }

  doFetch = (fetchUrl, statePosition, sortOrder) => {

    let requestOptions = {
      method: 'GET'
    };
    
    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(result => this.objectSort(result, "id", statePosition, sortOrder, true));
      // .then(result => this.setState({ [statePosition]: result }))
      // .catch(error => console.log('error', error));
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
        this.objectSort(this.state.allLines, "name", "sortAlphaLines", "ascending", false);
        this.objectSort(this.state.allPlants, "name", "sortAlphaPlants", "ascending", false);
      }, 100);
    }
  }

  render() { 

    const allLines = JSON.stringify(this.state.allLines);
    const allPlants = JSON.stringify(this.state.allPlants);
    const sortAlphaPlants = JSON.stringify(this.state.sortAlphaPlants);
    const sortAlphaLines = JSON.stringify(this.state.sortAlphaLines);
    
    return (
      <div className='adminPage'>
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div clasName="selectedPlant">
          Selected Plant Div
        </div>
        <div className='plantListDiv'>
          Plant List Div
        </div>
        <div className='updatePlantDiv'>
          Update Plant Div
        </div>
        <div className='addPlantDiv'>
          Add Plant Div
        </div>
        all lines: {allLines}<br/>
        all plants: {allPlants}<br/>
        alpha lines: {sortAlphaLines}<br/>
        alpha plants: {sortAlphaPlants}
      </div>
    );
  }
}
 
export default Plants;