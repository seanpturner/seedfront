import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Plants extends Component {
  state = { 
    baseUrl: "http://www.boutiqueseedsnm.com/",
    allLines: [],
    sortAlphaLines: [],
    allPlants: [],
    sortAlphaPlants: [],
    viewListSort: "descending",
    selectedPlant: "none",
    addPlant: false,
    newPlant: {},
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
    let np = this.state.newPlant;
    method = method.toUpperCase();
    if (method === "POST") {
      np.id = null;
    }
    if (!np.notes) {
      np.notes = [];
    }
    if (!np.image) {
      np.image = null;
    }
    if (!np.mother) {
      np.mother = null;
    }
    if (!np.father) {
      np.father = null;
    }
    if (!np.clone) {
      np.clone = false;
    }
    if (method === "PUT") {
      np.id = this.state.newPlant.id;
    }
    this.doPostPutFetch(method, np);
  }

  doPostPutFetch = (method, plant) => {

    let fetchUrl = "http://www.boutiqueseedsnm.com/plants";
    if (method === "PUT") {
      fetchUrl = fetchUrl + "/" + plant.id;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(plant);

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
        this.objectSort(this.state.allLines, "name", "sortAlphaLines", "ascending", false);
        this.objectSort(this.state.allPlants, "name", "sortAlphaPlants", "ascending", false);
        this.lineSelectOptions("all");
        this.plantSelectOptions();
      }, 100);
    }
  }

  buildNewPlant = (key) => (event) => {
    let np = this.state.newPlant;
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
            np.maternalLine = element.maternalLine;
            this.setState({ newPlant: np });
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
          let mlInputAdd = document.getElementById("addPaternalLine");
          let staticValue = document.createElement("span");
          staticValue.innerHTML = element.paternalLine;
          staticValue.setAttribute("id", "addPaternalLine");
          mlInputAdd.parentNode.replaceChild(staticValue, mlInputAdd);
          // let np = this.state.newPlant;
          np.paternalLine = element.paternalLine;
          this.setState({ newPlant: np });
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
    np[key] = event.target.value;
    this.setState({ newPlant: np });
  }

  buildPlantArray = (key, inputId) => (event) => {
    if (event.target.value.replace(/\s/g, '') !== "") {
      let np = this.state.newPlant;
      let npArray = np[key];
      if (npArray === undefined) {
        npArray = [];
      }
    npArray.push(event.target.value);
    np[key] = npArray;
    this.setState({ newPlant: np });
    document.getElementById(inputId).value = "";
    }
  }

  buildPlantBoolean = (key) => {
    let np = this.state.newPlant;
    let npBool = np[key];
    np[key] = !npBool;
      this.setState({ newPlant: np });
  }
  
  clearFieldsAndPlant = () => {
    let fields = document.getElementsByClassName('clearField');
    fields.forEach(field => {
      field.value = "";
    });
    this.setState({ 
      addPlant: false,
      newPlant: {}
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
      mLineAdd.addEventListener("change", this.buildNewPlant("maternalLine"))

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
          let np = this.state.newPlant;
          np.maternalLine = "";
          this.setState({ newPlant: np });
        }

        let mLineUpdate = document.createElement("select");
      mLineUpdate.setAttribute("id", "updateMaternalLine");
      mLineUpdate.addEventListener("change", this.buildNewPlant("maternalLine"))

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
      pLineAdd.addEventListener("change", this.buildNewPlant("paternalLine"))

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
          let np = this.state.newPlant;
          np.paternalLine = "";
          this.setState({ newPlant: np });
        }

        let pLineUpdate = document.createElement("select");
      pLineUpdate.setAttribute("id", "updatePaternalLine");
      pLineUpdate.addEventListener("change", this.buildNewPlant("paternalLine"))

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
    let np = this.state.newPlant;
    let existingArray = np[member];
    let enIndex = existingArray.indexOf(element);
    if (enIndex !== -1) {
      existingArray.splice(enIndex, 1);
      np[member] = existingArray;
      this.setState({ newPlant: np });
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
    let ap = this.state.allPlants;
    let returnArray = [];
    this.setState({ searchString: noSpace });
    ap.forEach(element => {
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
          newPlant: element,
          searchResults: []
          });
          document.getElementById("searchInput").value = "";
      }
    });
 }
  render() { 
    const selectedPlant = this.state.selectedPlant;
    const selectedPlantDiv = this.state.selectedPlant === "none" || this.state.addPlant === true ? "hidden" : "selectedPlantDiv";
    const updatePlantDiv = this.state.selectedPlant === "none" || this.state.addPlant === true ? "hidden" : "selectedPlantDiv";
    const plantListDiv = this.state.selectedPlant !== "none" || this.state.addPlant === true ? "hidden" : "plantListDiv";
    const addPlantDiv = this.state.addPlant === true ? "addPlantDiv" : "hidden";
    const newPlant = this.state.newPlant;
    const lastCheck = this.state.lastCheck === true ? "lastCheck" : "hidden";
    const updateLineage = this.state.updateLineage ? "updateLineage" : "hidden";
    const hideStatic = this.state.updateLineage ? "hidden" : "hideStatic";
    const sortedList = this.state.sortedList ? this.state.allPlants : this.state.sortedList;
    const okToSubmit = this.state.newPlant.name && this.state.newPlant.maternalLine && this.state.newPlant.paternalLine && this.state.newPlant.sex ? "okToSubmit" : "hidden";
    const dataSet = "Sorted by " + this.state.dataSet;
    const searchResultsDiv = this.state.searchString === "" ? "hidden" : "searchResultsDiv";
    const searchResults = this.state.searchResults;
    return (
      <div className='adminPage'>
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className={selectedPlantDiv}>
        <h1 className='adminSectionTitle'>Update A Plant</h1>
        <p><Link to="" onClick={()=>{this.setState({
                        selectedPlant: "none",
                        newPlant: {},
                        updateLineage: false
                        });
                        this.getFetch("lines", null, "allLines", "ascending");
                      this.getFetch("plants", null, "allPlants", "ascending");}
                      
                    }>Back to plant list</Link>
          </p>
          <table className='adminTable'>
          <tr className='adminRow'>
              <td>Plant Name</td>
              <td>Notes</td>
              <td>Mother</td>
              <td>Father</td>
              <td>Maternal Line</td>
              <td>Paternal Line</td>
              <td>Sex</td>
              <td>Clone</td>
              <td>Image</td>
            </tr>
            <tr className='adminRow'>
              <td>{selectedPlant.name}</td>
              <td>{selectedPlant.notes?.map((note) => {
                  return (
                    <tr className='adminSubRow'>{note}</tr>
                  )
                })}</td>
                <td>{selectedPlant.mother}</td>
                <td>{selectedPlant.father}</td>
                <td>{selectedPlant.maternalLine}</td>
                <td>{selectedPlant.paternalLine}</td>
                <td>{selectedPlant.sex}</td>
                <td>{selectedPlant.clone?.toString()}</td>
                <td>{selectedPlant.image}</td>
            </tr>
          </table>
          <br/><br/>
        </div>
          <div className={plantListDiv}><br/>
          <h1 className='adminSectionTitle'>Plants</h1>
          <p className='adminSortText'></p>
            <p className='adminSortText'>{dataSet}</p>
            <div className='searchDiv adminSortText'>Search by name &nbsp;
              <input id="searchInput" type="text" onChange = {this.searchFor("name")} />
            </div>
          <div className={searchResultsDiv}>
            <table>
                  {searchResults.map((plant)=>{
                    return (
                      <tr>
                        <td>
                          <Link to="" onClick={()=>this.setSearchEntity(plant.id)}>{plant.name}</Link>
                        </td>
                      </tr>
                    )
                  })}
            </table>
        </div>
          <table className='adminTable'>
            <tr className='adminRow'>
              <td></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "id")}}>ID</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "name")}}>Plant Name</Link></td>
              <td><Link to="">Notes</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "mother")}}>Mother</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "father")}}>Father</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "maternalLine")}}>Maternal Line</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "paternalLine")}}>Paternal Line</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "sex")}}>Sex</Link></td>
              <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "clone")}}>Clone</Link></td>
              <td><Link to="">Image</Link></td>
            </tr>
            {sortedList.map((plant) =>{
              return (
                <tr className='adminRow'>
                  <td>
                    <Link to="" onClick={()=>this.setState({
                      selectedPlant: plant,
                      newPlant: plant
                      })}>Open</Link>
                  </td>
                  <td>{plant.id}</td>
                  <td>{plant.name}</td>
                  <td>{plant.notes.map((note) => {
                    return (
                      <tr className='adminSubRow'>{note}</tr>
                    )
                  })}</td>
                  <td>{plant.mother}</td>
                  <td>{plant.father}</td>
                  <td>{plant.maternalLine} {this.getLineNameById(plant.maternalLine)}</td>
                  <td>{plant.paternalLine} {this.getLineNameById(plant.paternalLine)}</td>
                  <td>{plant.sex}</td>
                  <td>{plant.clone === true ? "Yes" : "No"}</td>
                  <td>{plant.image}</td>
                </tr>
              )
            })}
          </table><p>
          <Link to="" onClick={()=>{
            this.setState({addPlant: true})
          }}>Add a plant</Link></p>
        </div>
        <div className={updatePlantDiv}>
          <table className='adminTable topAlignTable'>
            <tr><td></td></tr>
            <tr className='adminRow topAlignTable'>
              <td>Plant Name</td>
              <td><input type="text" name = "name" defaultValue={selectedPlant.name} onChange={this.buildNewPlant("name")}/></td>
            </tr>
            <tr className='adminRow topAlignTable'>
            <td>Notes</td>
            <td><input id="updateNotes" type="text" name="notes" onBlur={this.buildPlantArray("notes", "updateNotes")}/>
              <tr className='adminRow topAlignTable'>
                <td id="notesUpdateArray">
                {newPlant.notes?.map((note) => {
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
            <td>Image</td>
            <td><input id="updateImage" type="text" name="image" onChange={this.buildNewPlant("image")}/>
              <tr className='adminRow topAlignTable'>
              </tr>
            </td>
            </tr>
            <tr className='adminRow topAlignTable'>
            <td>Mother</td>
            <td className={hideStatic}>{newPlant.mother} {this.getPlantNameById(newPlant.mother)}</td>
            <td className={updateLineage}>
                <select name="mother" id="updateMother" className='clearField' onChange={this.buildNewPlant("mother")}/>
              </td>
            </tr>
            <tr className='adminRow topAlignTable'>
            <td>Father</td>
            <td className={hideStatic}>{newPlant.father} {this.getPlantNameById(newPlant.father)}</td>
            <td className={updateLineage}>
                <select name="father" id="updateFather" className='clearField' onChange={this.buildNewPlant("father")}/>
              </td>
            </tr>
            <tr>
            <td>Maternal Line</td>
            <td className={hideStatic}>{newPlant.maternalLine} {this.getLineNameById(newPlant.maternalLine)}</td>
            <td className={updateLineage}>
                <select name="maternalLine" id="updateMaternalLine" className='clearField' onChange={this.buildNewPlant("maternalLine")}/>
               </td>
            </tr>
            <tr>
            <td>Paternal Line</td>
            <td className={hideStatic}>{newPlant.paternalLine} {this.getLineNameById(newPlant.paternalLine)}</td>
            <td className={updateLineage}>
                <select name="paternalLine" id="updatePaternalLine" className='clearField' onChange={this.buildNewPlant("paternalLine")}/>
               </td>
            </tr>
            <tr>
              <td>Sex</td>
              <td className={hideStatic}>{newPlant.sex}</td>
              <td  className={updateLineage}>
                <select name="sex" id="addSex" className='clearField' onChange={this.buildNewPlant("sex")}>
                  <option value = "" selected>Select</option>
                  <option value = "F">Female</option>
                  <option value = "M">Male</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Clone</td>
              <td className={hideStatic}>{newPlant?.clone ? "true" : "false"}</td>
              <td  className={updateLineage}>
                <input className='clearField' id = "updateClone"
                type = "checkbox"
                onChange={()=>this.buildPlantBoolean("clone")}/>
              </td>
              </tr>
          </table>
          <Link to="" onClick={()=>this.setState({updateLineage: !this.state.updateLineage})}>Update lineage</Link><br/>
          <Link to="" onClick={()=>this.setState({lastCheck: true})}>Update this plant</Link>
          <div className={lastCheck}>
            <span className='alertRedText'>
              Are you sure you want to update this plant? 
            </span>&nbsp;
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("PUT")}>Yes</Link>
        </div>
        </div>
        <div className={addPlantDiv}><br/>
          <h1 className='adminSectionTitle'>Add A Plant</h1>
          <p><Link to="" onClick={()=>this.clearFieldsAndPlant()}>Back to plant list</Link></p>
          <table>
            <tr>
              <td>Name</td>
              <td>
                <input id="addName" type="text" name="name" onBlur={this.buildNewPlant("name")}/>
              </td>
              <td className='alertRedText'>
                {newPlant.name?.replace(/\s/g, '') === "" ? "Required" : ""}
              </td>
              </tr>
              <tr>
              <td className='topAlignTable'>Notes</td>
              <td className='topAlignTable'>
                <input id="addNotes" type="text" name="notes" onBlur={this.buildPlantArray("notes", "addNotes")}/>
              </td>
              <td>{newPlant.notes?.map((note) => {
                  return (
                    <tr className='adminSubRow'>{note}</tr>
                  )
                })}
              </td>
              </tr>
              <tr>
              <td>Mother</td>
              <td>
                <select name="mother" id="addMother" className='clearField' onChange={this.buildNewPlant("mother")}/>
              </td>
              </tr>
              <tr>
              <td>Father</td>
              <td>
              <select name="father" id="addFather" className='clearField' onChange={this.buildNewPlant("father")}/>
              </td>
              </tr>
              <tr>
              <td>Maternal Line</td>
              <td>
                <select name="maternalLine" id="addMaternalLine" className='clearField' onChange={this.buildNewPlant("maternalLine")}/>
               </td>
               <td className='alertRedText'>
                {newPlant.maternalLine === "" ? "Required" : ""}
              </td>
              </tr>
              <tr>
              <td>Paternal Line</td>
              <td>
              <select name="paternalLine" id="addPaternalLine" className='clearField' onChange={this.buildNewPlant("paternalLine")}/>
              </td>
              <td className='alertRedText'>
                {newPlant.paternalLine === "" ? "Required" : ""}
              </td>
              </tr>
              <tr>
              <td>Sex</td>
              <td>
                <select name="sex" id="addSex" className='clearField' onChange={this.buildNewPlant("sex")}>
                  <option value = "">Select</option>
                  <option value = "F">Female</option>
                  <option value = "M">Male</option>
                </select>
              </td>
              <td className='alertRedText'>
                {newPlant.sex === "" ? "Required" : ""}
              </td>
              </tr>
              <tr>
              <td>Clone</td>
              <td>
                <input className='clearField' id = "addClone"
                type = "checkbox"
                onChange={()=>this.buildPlantBoolean("clone")}/>
              </td>
              </tr>
              <tr>
              <td className='topAlignTable'>image</td>
              <td className='topAlignTable'>
                <input className='clearField' id="addImage" type="text" name="image" onChange={this.buildNewPlant("image")}/>
              </td>
            </tr>
          </table>
          <div className={okToSubmit}>
          <p><Link to="" onClick={()=>this.setState({lastCheck: true})}>Add this Plant</Link></p>
            <div className={lastCheck}>
              <span className='alertRedText'>
                Are you sure you want to add this plant? 
              </span>&nbsp;
              <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("POST")}>Yes</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
 
export default Plants;