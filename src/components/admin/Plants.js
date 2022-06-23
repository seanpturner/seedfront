import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";
// import Admin from './Admin';

class Plants extends Component {
  state = { 
    baseUrl: "http://localhost:8080/",
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
    np.id = null;
    if (method === "POST") {
      np.id = null;
    }
    if (!np.notes) {
      np.notes = [];
    }
    if (!np.imageList) {
      np.imageList = [];
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
    this.doPostPutFetch(method, np);
  }

  doPostPutFetch = (method, plant) => {

    let fetchUrl = "http://localhost:8080/plants";
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
            let mlInput = document.getElementById("addMaternalLine");
            let staticValue = document.createElement("span");
            staticValue.innerHTML = element.maternalLine;
            staticValue.setAttribute("id", "addMaternalLine");
            mlInput.parentNode.replaceChild(staticValue, mlInput);
            let np = this.state.newPlant;
            np.maternalLine = element.maternalLine;
            this.setState({ newPlant: np });
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
          let mlInput = document.getElementById("addPaternalLine");
          let staticValue = document.createElement("span");
          staticValue.innerHTML = element.paternalLine;
          staticValue.setAttribute("id", "addPaternalLine");
          mlInput.parentNode.replaceChild(staticValue, mlInput);
          let np = this.state.newPlant;
          np.paternalLine = element.paternalLine;
          this.setState({ newPlant: np });
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
      let mLine = document.createElement("select");
      mLine.setAttribute("id", "addMaternalLine");
      mLine.addEventListener("change", this.buildNewPlant("maternalLine"))

      options.forEach(element => {
        if (mLine.length === 0) {
          mLine.options.add(new Option("select", "", true));
        }
        if (mLine.length < options.length + 1) {
          mLine.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
        })
        let oldInput = document.getElementById("addMaternalLine");
        oldInput.parentNode.replaceChild(mLine, oldInput);
        if (line === "maternal") {
          let np = this.state.newPlant;
          np.maternalLine = "";
          this.setState({ newPlant: np });
        }
    }

    if (line === "paternal" || line === "all") {
      let pLine = document.createElement("select");
      pLine.setAttribute("id", "addPaternalLine");
      pLine.addEventListener("change", this.buildNewPlant("paternalLine"))

      options.forEach(element => {
        if (pLine.length === 0) {
          pLine.options.add(new Option("select", "", true));
        }
        if (pLine.length < options.length + 1) {
          pLine.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
      })
      let oldInput = document.getElementById("addPaternalLine");
        oldInput.parentNode.replaceChild(pLine, oldInput);
        if (line === "paternal") {
          let np = this.state.newPlant;
          np.paternalLine = "";
          this.setState({ newPlant: np });
        }
        
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

  plantSelectOptions = () => {
    let plants = this.state.sortAlphaPlants;
    let options = [];

    plants.forEach(element => {
      options.push({text: element.name, value: element.id, selected: false});
    });

    let addMother = document.getElementById("addMother");
    let addFather = document.getElementById("addFather");

    options.forEach(element => {
      if (addMother.length === 0) {
        addMother.options.add(new Option("select", "", true));
      }
      if (addMother.length < options.length + 1) {
        addMother.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
      }
      })

      options.forEach(element => {
        if (addFather.length === 0) {
          addFather.options.add(new Option("select", "", true));
        }
        if (addFather.length < options.length + 1) {
          addFather.options.add(new Option(element.text + " (" + element.value + ")", element.value, element.selected));
        }
        })
  }

  render() { 
    const plantList = this.state.allPlants;
    const selectedPlant = this.state.selectedPlant;
    const selectedPlantDiv = this.state.selectedPlant === "none" || this.state.addPlant === true ? "hidden" : "selectedPlantDiv";
    const updatePlantDiv = this.state.selectedPlant === "none" || this.state.addPlant === true ? "hidden" : "selectedPlantDiv";
    const plantListDiv = this.state.selectedPlant !== "none" || this.state.addPlant === true ? "hidden" : "plantListDiv";
    const addPlantDiv = this.state.addPlant === true ? "addPlantDiv" : "hidden";
    const newPlant = this.state.newPlant;
    const npString = JSON.stringify(newPlant);
    const lastCheck = this.state.lastCheck === true ? "lastCheck" : "hidden";
    const lineSelectOptions = JSON.stringify(this.state.lineSelectOptions);
    const okToSubmit = this.state.newPlant.name && this.state.newPlant.maternalLine && this.state.newPlant.paternalLine && this.state.newPlant.sex ? "okToSubmit" : "hidden";
    return (
      <div className='adminPage'>
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className={selectedPlantDiv}>
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
              <td>imageList</td>
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
                <td>{selectedPlant.imageList?.map((img) => {
                  return (
                    <tr className='adminSubRow'>{img}</tr>
                  )
                })}</td>
            </tr>
          </table>
          <Link to="" onClick={()=>
                      this.setState({selectedPlant: "none"})
                    }>Deselect Plant</Link>
        </div>
        <div className={plantListDiv}>
          Plant List Div
          <br/>{lineSelectOptions}
          <table className='adminTable'>
            <tr className='adminRow'>
              <td></td>
              <td>ID</td>
              <td>Plant Name</td>
              <td>Notes</td>
              <td>Mother</td>
              <td>Father</td>
              <td>Maternal Line</td>
              <td>Paternal Line</td>
              <td>Sex</td>
              <td>Clone</td>
              <td>imageList</td>
            </tr>
            {plantList.map((plant) =>{
              return (
                <tr className='adminRow'>
                  <td>
                    <Link to="" onClick={()=>this.setState({selectedPlant: plant})}>Open</Link>
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
                  <td>{this.getLineNameById(plant.maternalLine)}</td>
                  <td>{this.getLineNameById(plant.paternalLine)}</td>
                  <td>{plant.sex}</td>
                  <td>{plant.clone === true ? "Yes" : "No"}</td>
                  <td>{plant.imageList?.map((img) => {
                    return (
                      <tr className='adminSubRow'>{img}</tr>
                    )
                  })}</td>
                  {/* <td>{plant.imageList}</td> */}
                </tr>
              )
            })}
          </table>
          <Link to="" onClick={()=>{
            this.setState({addPlant: true})
          }}>Add a plant</Link>
        </div>
        <div className={updatePlantDiv}>
          Update Plant Div
        </div>
        <div className={addPlantDiv}>
          Add Plant Div
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
              <td className='topAlignTable'>imageList</td>
              <td className='topAlignTable'>
                <input className='clearField' id="addImageList" type="text" name="imageList" onBlur={this.buildPlantArray("imageList", "addImageList")}/>
              </td>
              <td>
              {newPlant.imageList?.map((image) => {
                  return (
                    <tr className='adminSubRow'>{image}</tr>
                  )
                })}
              </td>
            </tr>
          </table>
          <div className={okToSubmit}>
          <Link to="" onClick={()=>this.setState({lastCheck: true})}>Add this Plant</Link>
          <div className={lastCheck}>
            <span className='alertRedText'>
              Are you sure you want to add this plant? 
            </span>&nbsp;
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.postPutFetch("POST")}>Yes</Link>
        </div>
          </div>
          

          <br/><br/>
        <Link to="" onClick={()=>this.clearFieldsAndPlant()}>Back to plant list</Link>
        <br/>{npString}
        </div>
      </div>
    );
  }
}
 
export default Plants;