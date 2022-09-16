import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Seeds extends Component {
  state = { 
    baseUrl: "http://www.boutiqueseedsnm.com/backend/",
    allSeeds: [],
    sortAlphaSeeds: [],
    allLines: [],
    sortAlphaLines: [],
    allPlants: [],
    sortAlphaPlants: [],
    viewListSort: "descending",
    selectedSeed: "none",
    addSeed: false,
    newSeed: {},
    lastCheck: false,
    lineSelectOptions: [],
    addMaternalSelect: "",
    addPaternalSelect: "",
    updateLineage: false,
    sortBy: "",
    sortDirection: "descending",
    sortedList: [],
    dataSet: "ID",
    searchString: "",
    searchResults: []
   } 

  componentDidMount = () => {
    this.getFetch("seeds", null, "allSeeds", "ascending")
    this.getFetch("lines", null, "allLines", "ascending");
    this.getFetch("plants", null, "allPlants", "ascending");
  }

  getFetch = (endpoint, path, statePosition, sortOrder) => {
    let pathUrl = this.state.baseUrl + endpoint;
    if (path != null) {
      pathUrl = pathUrl + path;
    }
    this.doGetFetch(pathUrl, statePosition, sortOrder);
  }

  postPutFetch = (method) => {
    let ns = this.state.newSeed;
    method = method.toUpperCase();
    if (method === "POST") {
      ns.id = null;
    }
    if (!ns.notes) {
      ns.notes = [];
    }
    if (!ns.mother) {
      ns.mother = null;
    }
    if (!ns.father) {
      ns.father = null;
    }
    if (!ns.price) {
      ns.mother = 0;
    }
    if (method === "PUT") {
      ns.id = this.state.newSeed.id;
    }
    this.doPostPutFetch(method, ns);
  }

  doPostPutFetch = (method, seed) => {

    let fetchUrl = "http://www.boutiqueseedsnm.com/backend/seeds";
    if (method === "PUT") {
      fetchUrl = fetchUrl + "/" + seed.id;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(seed);

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
        this.objectSort(this.state.allSeeds, "name", "sortAlphaSeeds", "ascending", false);
        this.objectSort(this.state.allLines, "name", "sortAlphaLines", "ascending", false);
        this.objectSort(this.state.allPlants, "name", "sortAlphaPlants", "ascending", false);
        this.lineSelectOptions("all");
        this.plantSelectOptions();
      }, 100);
    }
  }

  buildNewSeed = (key) => (event) => {
    let ns = this.state.newSeed;
    let plants = this.state.allPlants;
    if (key === "mother") {
      if (event.target.value !== "") {
        plants.forEach(element => {
          if (element.id === parseInt(event.target.value)) {
            let mlInputAdd = document.getElementById("addMaternalLine");
            let staticValue = document.createElement("span");
            staticValue.innerHTML = element.maternalLine;
            staticValue.setAttribute("id", "addMaternalLine");
            mlInputAdd.parentNode.replaceChild(staticValue, mlInputAdd);
            let ns = this.state.newSeed;
            ns.maternalLine = element.maternalLine;
            this.setState({ newSeed: ns });
          }
        });

        plants.forEach(element => {
          if (element.id === parseInt(event.target.value)) {
            let mlInputUpdate = document.getElementById("updateMaternalLine");
            let staticValue = document.createElement("span");
            staticValue.innerHTML = element.maternalLine;
            staticValue.setAttribute("id", "updateMaternalLine");
            mlInputUpdate.parentNode.replaceChild(staticValue, mlInputUpdate);
          }
        });
      }else{
        this.lineSelectOptions("maternal");
      }
      
    }

    if (key === "father") {
      if (event.target.value !=="") {
      plants.forEach(element => {
        if (element.id === parseInt(event.target.value)) {
          let plInputAdd = document.getElementById("addPaternalLine");
          let staticValue = document.createElement("span");
          staticValue.innerHTML = element.paternalLine;
          staticValue.setAttribute("id", "addPaternalLine");
          plInputAdd.parentNode.replaceChild(staticValue, plInputAdd);
          let ns = this.state.newSeed;
          ns.paternalLine = element.paternalLine;
          this.setState({ newSeed: ns });
        }
      });

      plants.forEach(element => {
        if (element.id === parseInt(event.target.value)) {
          let mlInputUpdate = document.getElementById("updatePaternalLine");
          let staticValue = document.createElement("span");
          staticValue.innerHTML = element.paternalLine;
          staticValue.setAttribute("id", "updatePaternalLine");
          mlInputUpdate.parentNode.replaceChild(staticValue, mlInputUpdate);
        }
      });


    }else{
      this.lineSelectOptions("paternal");
    }
    }
    ns[key] = event.target.value;
    this.setState({ newSeed: ns });
  }

  buildSeedArray = (key, inputId) => (event) => {
    if (event.target.value.replace(/\s/g, '') !== "") {
      let ns = this.state.newSeed;
      let nsArray = ns[key];
      if (nsArray === undefined) {
        nsArray = [];
      }
    nsArray.push(event.target.value);
    ns[key] = nsArray;
    this.setState({ newSeed: ns });
    document.getElementById(inputId).value = "";
    }
  }

  buildSeedBoolean = (key) => {
    let ns = this.state.newSeed;
    let nsBool = ns[key];
    ns[key] = !nsBool;
      this.setState({ newSeed: ns });
  }
  
  clearFieldsAndSeed = () => {
    let fields = document.getElementsByClassName('clearField');
    fields.forEach(field => {
      field.value = "";
    });
    this.setState({ 
      addSeed: false,
      newSeed: {},
    });
  }

  lineSelectOptions = (line) => {
    let lines = this.state.sortAlphaLines;
    let options = [];

    lines.forEach(element => {
      options.push({text: element.name, value: element.id, selected: false});
    });

    if (line === "maternal" || line === "all") {
      let mLineAdd = document.createElement("select");
      mLineAdd.setAttribute("id", "addMaternalLine");
      mLineAdd.addEventListener("change", this.buildNewSeed("maternalLine"))

      options.forEach(element => {
        if (mLineAdd.length === 0) {
          mLineAdd.options.add(new Option("select", "", true));
        }
        if (mLineAdd.length < options.length + 1) {
          mLineAdd.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
        })
        let oldInputAdd = document.getElementById("addMaternalLine");
        oldInputAdd.parentNode.replaceChild(mLineAdd, oldInputAdd);
        if (line === "maternal") {
          let ns = this.state.newSeed;
          ns.maternalLine = "";
          this.setState({ newSeed: ns });
        }

        let mLineUpdate = document.createElement("select");
      mLineUpdate.setAttribute("id", "updateMaternalLine");
      mLineUpdate.addEventListener("change", this.buildNewSeed("maternalLine"))

      options.forEach(element => {
        if (mLineUpdate.length === 0) {
          mLineUpdate.options.add(new Option("select", "", true));
        }
        if (mLineUpdate.length < options.length + 1) {
          mLineUpdate.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
        })
        let oldInputUpdate = document.getElementById("updateMaternalLine");
        oldInputUpdate.parentNode.replaceChild(mLineUpdate, oldInputUpdate);
    }

    if (line === "paternal" || line === "all") {
      let pLineAdd = document.createElement("select");
      pLineAdd.setAttribute("id", "addPaternalLine");
      pLineAdd.addEventListener("change", this.buildNewSeed("paternalLine"))

      options.forEach(element => {
        if (pLineAdd.length === 0) {
          pLineAdd.options.add(new Option("select", "", true));
        }
        if (pLineAdd.length < options.length + 1) {
          pLineAdd.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
      })
      let oldInputAdd = document.getElementById("addPaternalLine");
        oldInputAdd.parentNode.replaceChild(pLineAdd, oldInputAdd);
        if (line === "paternal") {
          let ns = this.state.newSeed;
          ns.paternalLine = "";
          this.setState({ newSeed: ns });
        }

        let pLineUpdate = document.createElement("select");
      pLineUpdate.setAttribute("id", "updatePaternalLine");
      pLineUpdate.addEventListener("change", this.buildNewSeed("paternalLine"))

      options.forEach(element => {
        if (pLineUpdate.length === 0) {
          pLineUpdate.options.add(new Option("select", "", true));
        }
        if (pLineUpdate.length < options.length + 1) {
          pLineUpdate.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
      })
      let oldInputUpdate = document.getElementById("updatePaternalLine");
        oldInputUpdate.parentNode.replaceChild(pLineUpdate, oldInputUpdate);
    }
  }

  getLineNameById = (lineId) => {
    let lines = this.state.allLines;
    let lineName;
    lines.forEach(element => {
      if (element.id === lineId) {
        lineName = element.name;
      }
    });
    return lineName;
  }

  getPlantNameById = (plantId) => {
    let plants = this.state.allPlants;
    let plantName;
    plants.forEach(element => {
      if (element.id === plantId) {
        plantName = element.name;
      }
    });
    return plantName;
  }

  plantSelectOptions = () => {
    let plants = this.state.sortAlphaPlants;
    let options = [];

    plants.forEach(element => {
      options.push({text: element.name, value: element.id, selected: false});
    });

    let addMother = document.getElementById("addMother");
    let addFather = document.getElementById("addFather");
    let updateMother = document.getElementById("updateMother");
    let updateFather = document.getElementById("updateFather");

    options.forEach(element => {
      if (addMother.length === 0) {
        addMother.options.add(new Option("select", "", true));
      }
      if (addMother.length < options.length + 1) {
        addMother.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
      }
      if (updateMother.length === 0) {
        updateMother.options.add(new Option("select", "", true));
      }
      if (updateMother.length < options.length + 1) {
        updateMother.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
      }
      })

      options.forEach(element => {
        if (addFather.length === 0) {
          addFather.options.add(new Option("select", "", true));
        }
        if (addFather.length < options.length + 1) {
          addFather.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
        if (updateFather.length === 0) {
          updateFather.options.add(new Option("select", "", true));
        }
        if (updateFather.length < options.length + 1) {
          updateFather.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
        })
  }

  removeFromUpdateArray = (member, element) => {
    let ns = this.state.newSeed;
    let existingArray = ns[member];
    let enIndex = existingArray.indexOf(element);
    if (enIndex !== -1) {
      existingArray.splice(enIndex, 1);
      ns[member] = existingArray;
      this.setState({ newSeed: ns });
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
    let as = this.state.allSeeds;
    let returnArray = [];
    this.setState({ searchString: noSpace });
    as.forEach(element => {
      let searchString = element.name.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      if (noSpace === searchString) {
        returnArray.push({"id": element.id, "name": element.name})
      }
    });
    this.setState({ searchResults: returnArray });
  }

  setSearchEntity = (id) => {
    let ap = this.state.allPlants;
    ap.forEach(element => {
      if (element.id === id) {
        this.setState({
          selectedPlant: element,
          newSeed: element,
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

  render() { 
    const selectedSeed = this.state.selectedSeed;
    const selectedSeedDiv = this.state.selectedSeed === "none" || this.state.addSeed === true ? "hidden" : "selectedSeedDiv";
    const updateSeedDiv = this.state.selectedSeed === "none" || this.state.addSeed === true ? "hidden" : "selectedSeedDiv";
    const seedListDiv = this.state.selectedSeed !== "none" || this.state.addSeed === true ? "hidden" : "plantListDiv";
    const addSeedDiv = this.state.addSeed === true ? "addSeedDiv" : "hidden";
    const newSeed = this.state.newSeed;
    const lastCheck = this.state.lastCheck === true ? "lastCheck" : "hidden";
    const updateLineage = this.state.updateLineage ? "updateLineage" : "hidden";
    const hideStatic = this.state.updateLineage ? "hidden" : "hideStatic";
    const sortedList = this.state.sortedList ? this.state.allSeeds : this.state.sortedList;
    const okToSubmit = this.state.newSeed.name && this.state.newSeed.maternalLine && this.state.newSeed.paternalLine ? "okToSubmit" : "hidden";
    const dataSet = "Sorted by " + this.state.dataSet;
    const searchResultsDiv = this.state.searchString === "" ? "hidden" : "searchResultsDiv";
    const searchResults = this.state.searchResults;
    return (
      <div className='adminPage'>
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className={selectedSeedDiv}>
          <h1 className='adminSectionTitle'>Update A Seed</h1>
          <p>
            <Link to="" onClick={()=>{this.setState({
                        selectedSeed: "none",
                        newSeed: {},
                        updateLineage: false,
                        lastCheck: false
                        });
                        this.getFetch("lines", null, "allLines", "ascending");
                      this.getFetch("plants", null, "allPlants", "ascending");}
                      
                    }>Back to seed list</Link>
          </p>
          <p>
            <table className='adminTable'>
              <tr className='adminRow'>
                <td>Seed Name</td>
                <td>Notes</td>
                <td>Available</td>
                <td>Mother</td>
                <td>Father</td>
                <td>Maternal line</td>
                <td>Paternal line</td>
                <td>Feminized</td>
                <td>Autoflower</td>
                <td>Active</td>
                <td>Price</td>
                <td>Storage id</td>
              </tr>
              <tr className='adminRow'>
                <td>{selectedSeed.name}</td>
                <td>{selectedSeed.notes?.map((note) => {
                  return (
                    <tr className='adminSubRow'>{note}</tr>
                  )
                })}</td>
                <td>{selectedSeed.quantityAvailable}</td>
                <td>{selectedSeed.mother}</td>
                <td>{selectedSeed.father}</td>
                <td>{selectedSeed.maternalLine}</td>
                <td>{selectedSeed.paternalLine}</td>
                <td>{selectedSeed.feminized?.toString()}</td>
                <td>{selectedSeed.autoFlower?.toString()}</td>
                <td>{selectedSeed.active?.toString()}</td>
                <td>{this.showAsCurrency(selectedSeed.price)}</td>
                <td>{selectedSeed.storageId}</td>
            </tr>
          </table>
</p>
        </div>
          <div className={seedListDiv}><br/>
            <h1 className='adminSectionTitle'>Seeds</h1>
            <p className='adminSortText'>{dataSet}</p>
            <div className='searchDiv adminSortText'>Search by name &nbsp;
              <input id="searchInput" type="text" onChange = {this.searchFor("name")} />
            </div>
            <div className={searchResultsDiv}>
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
        </div>
          <table className='adminTable'>
            <tr className='adminRow'>
              <td></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "id")}}>ID</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "name")}}>Seed Name</Link></td>
              <td><Link to="">Notes</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "mother")}}>Mother</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "father")}}>Father</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "quantityAvailable")}}>Quantity
              </Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "maternalLine")}}>Maternal Line</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "paternalLine")}}>Paternal Line</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "feminized")}}>Feminized</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "autoFlower")}}>Auto Flower</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "active")}}>Active</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "price")}}>Price</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allSeeds, "storageId")}}>Storage id</Link></td>
            </tr>
            {sortedList.map((seed) =>{
              return (
                <tr className='adminRow'>
                  <td>
                    <Link to="" onClick={()=>this.setState({
                      selectedSeed: seed,
                      newSeed: seed
                      })}>Open</Link>
                  </td>
                  <td>{seed.id}</td>
                  <td>{seed.name}</td>
                  <td>{seed.notes.map((note) => {
                    return (
                      <tr className='adminSubRow'>{note}</tr>
                    )
                  })}</td>
                  <td>{seed.mother}</td>
                  <td>{seed.father}</td>
                  <td>{seed.quantityAvailable}</td>
                  <td>{seed.maternalLine} {this.getLineNameById(seed.maternalLine)}</td>
                  <td>{seed.paternalLine} {this.getLineNameById(seed.paternalLine)}</td>
                  <td>{seed.feminized?.toString()}</td>
                  <td>{seed.autoFlower?.toString()}</td>
                  <td>{seed.active?.toString()}</td>
                  <td>{this.showAsCurrency(seed.price)}</td>
                  <td>{seed.storageId}</td>
                </tr>
              )
            })}
          </table>
          <p>
          <Link to="" onClick={()=>{
            this.setState({addSeed: true})
          }}>Add a seed</Link></p>
        </div>
        <div className={updateSeedDiv}>
          <table className='adminTable topAlignTable'>
            <tr><td></td></tr>
            <tr className='adminRow topAlignTable'>
              <td>Seed Name</td>
              <td><input type="text" name = "name" onChange={this.buildNewSeed("name")} defaultValue={selectedSeed.name}/></td>
            </tr>
            <tr className='adminRow topAlignTable'>
            <td>Notes</td>
            <td><input id="updateNotes" type="text" name="notes" onBlur={this.buildSeedArray("notes", "updateNotes")}/>
              <tr className='adminRow topAlignTable'>
                <td id="notesUpdateArray">
                {newSeed.notes?.map((note) => {
                  return (
                    <tr className='adminSubRow'>
                      <td>
                        <Link to="" onClick={()=>this.removeFromUpdateArray("notes", note)}> X </Link>
                        {note}</td>
                    </tr>
                  )
                })}
                </td>
              </tr>
            </td>
            </tr>

            <tr className='adminRow topAlignTable'>
            <td>Mother</td>
            <td className={hideStatic}>{newSeed.mother} {this.getPlantNameById(newSeed.mother)}</td>
            <td className={updateLineage}>
                <select name="mother" id="updateMother" className='clearField' onChange={this.buildNewSeed("mother")}/>
              </td>
            </tr>
            <tr className='adminRow topAlignTable'>
            <td>Father</td>
            <td className={hideStatic}>{newSeed.father} {this.getPlantNameById(newSeed.father)}</td>
            <td className={updateLineage}>
                <select name="father" id="updateFather" className='clearField' onChange={this.buildNewSeed("father")}/>
              </td>
            </tr>
            <tr className='adminRow topAlignTable'>
              <td>Quantity Available</td>
              <td><input type="number" name = "quantityAvailable" defaultValue={selectedSeed.quantityAvailable} onChange={this.buildNewSeed("quantityAvailable")}/></td>
            </tr>
            <tr className='adminRow topAlignTable'>
              <td>Price</td>
              <td><input type="number" name = "price" defaultValue={selectedSeed.price} onChange={this.buildNewSeed("price")}/></td>
            </tr>
            <tr className='adminRow topAlignTable'>
              <td>Storage id</td>
              <td><input type="text" name = "storageId" defaultValue={selectedSeed.storageId} onChange={this.buildNewSeed("storageId")}/></td>
            </tr>
            <tr>
            <td>Maternal Line</td>
            <td className={hideStatic}>{newSeed.maternalLine} {this.getLineNameById(newSeed.maternalLine)}</td>
            <td className={updateLineage}>
                <select name="maternalLine" id="updateMaternalLine" className='clearField' onChange={this.buildNewSeed("maternalLine")}/>
               </td>
            </tr>
            <tr>
            <td>Paternal Line</td>
            <td className={hideStatic}>{newSeed.paternalLine} {this.getLineNameById(newSeed.paternalLine)}</td>
            <td className={updateLineage}>
                <select name="paternalLine" id="updatePaternalLine" className='clearField' onChange={this.buildNewSeed("paternalLine")}/>
               </td>
            </tr>

            <tr>
              <td>Feminized</td>
              <td className={hideStatic}>{newSeed?.feminized ? "true" : "false"}</td>
              <td>
                <input className='clearField' id = "updateFeminized"
                type = "checkbox"
                checked = {newSeed?.feminized}
                onChange={()=>this.buildSeedBoolean("feminized")}/>
              </td>
            </tr>

            <tr>
              <td>Autoflower</td>
              <td className={hideStatic}>{newSeed?.autoFlower ? "true" : "false"}</td>
              <td>
                <input className='clearField' id = "updateAutoFlower"
                type = "checkbox"
                checked = {newSeed?.autoFlower}
                onChange={()=>this.buildSeedBoolean("autoFlower")}/>
              </td>
            </tr>

            <tr>
              <td>Active</td>
              <td className={hideStatic}>{newSeed?.active ? "true" : "false"}</td>
              <td>
                <input className='clearField' id = "updateActive"
                type = "checkbox"
                checked = {newSeed?.active}
                onChange={()=>this.buildSeedBoolean("active")}/>
              </td>
            </tr>

          </table>
          <Link to="" onClick={()=>this.setState({updateLineage: !this.state.updateLineage})}>Update lineage</Link><br/>
          <Link to="" onClick={()=>this.setState({lastCheck: true})}>Update this seed</Link>
          <div className={lastCheck}>
            <span className='alertRedText'>
              Are you sure you want to update this seed? 
            </span>&nbsp;
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("PUT")}>Yes</Link>
        </div>
        </div>
        <div className={addSeedDiv}><br/>
          <h1 className='adminSectionTitle'>Add A Seed</h1>
          <p><Link to="" onClick={()=>this.clearFieldsAndPlant()}>Back to seed list</Link></p>
          <table>
            <tr>
              <td>Name</td>
              <td>
                <input id="addName" type="text" name="name" onBlur={this.buildNewSeed("name")}/>
              </td>
              <td className='alertRedText'>
                {newSeed.name?.replace(/\s/g, '') === "" ? "Required" : ""}
              </td>
              </tr>
              <tr>
              <td className='topAlignTable'>Notes</td>
              <td className='topAlignTable'>
                <input id="addNotes" type="text" name="notes" onBlur={this.buildSeedArray("notes", "addNotes")}/>
              </td>
              <td>{newSeed.notes?.map((note) => {
                  return (
                    <tr className='adminSubRow'>{note}</tr>
                  )
                })}
              </td>
              </tr>
              <tr>
              <td>Mother</td>
              <td>
                <select name="mother" id="addMother" className='clearField' onChange={this.buildNewSeed("mother")}/>
              </td>
              </tr>
              <tr>
              <td>Father</td>
              <td>
              <select name="father" id="addFather" className='clearField' onChange={this.buildNewSeed("father")}/>
              </td>
              </tr>
              <tr>
              <td>Maternal Line</td>
              <td>
                <select name="maternalLine" id="addMaternalLine" className='clearField' onChange={this.buildNewSeed("maternalLine")}/>
               </td>
               <td className='alertRedText'>
                {newSeed.maternalLine === "" ? "Required" : ""}
              </td>
              </tr>
              <tr>
              <td>Paternal Line</td>
              <td>
              <select name="paternalLine" id="addPaternalLine" className='clearField' onChange={this.buildNewSeed("paternalLine")}/>
              </td>
              <td className='alertRedText'>
                {newSeed.paternalLine === "" ? "Required" : ""}
              </td>
              </tr>
          </table>
          <div className={okToSubmit}>
          <p><Link to="" onClick={()=>this.setState({lastCheck: true})}>Add this Seed</Link></p>
          <div className={lastCheck}>
            <span className='alertRedText'>
              Are you sure you want to add this seed? 
            </span>&nbsp;
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("POST")}>Yes</Link>
        </div>
          </div>
        </div>
      </div>
    );
  }
}
 
export default Seeds;