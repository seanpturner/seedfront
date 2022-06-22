import React, { Component } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

class Lines extends Component {
  state = { 
    lineList: [],
    sortBy: "",
    sortDirection: "descending",
    sortedList: [],
    selectedLine: "none",
    newLine: {},
    lastCheck: false
   } 

  componentDidMount = () => {
    this.getLines();
  };

  getLines = () => {
    let requestOptions = {
      method: 'GET'
    };
    
    fetch("http://localhost:8080/lines", requestOptions)
      .then(response => response.json())
      .then((response) => {
        this.setState({ lineList: response });
        this.sortList(response, "id");
      });
      // .catch(error => console.log('error', error));
  }

  sortList = (lines, by) => {
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
      lines.sort((a, b) => (a[by] > b[by] ? 1 : -1));
      this.setState({
        sortedList: lines,
        sortBy: by,
      });
    }
    if (sortDirection === "descending") {
      lines.sort((a, b) => (a[by] < b[by] ? 1 : -1));
      this.setState({
        sortedList: lines,
        sortBy: by,
      });
    }
  };

  updateSelectedLine = (key) => (event) => {
    let usl = this.state.updateSelectedLine;
    usl[key] = event.target.value;
    this.setState({ updateSelectedLine: usl });
  }

  addNewLine = (key) => (event) => {
    let nl = this.state.newLine;
    nl[key] = event.target.value;
    this.setState({ newLine: nl });
  }



  saveLine = () => {
    let updateLine = this.state.updateSelectedLine;
    let fetchUrl = "http://localhost:8080/lines/" + updateLine.id;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      "id": updateLine.id,
      "name": updateLine.name
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(response => window.location.reload())
      // .then(result => console.log(result))
      // .catch(error => console.log('error', error));
  }

  resetAndClearForm = () => {
    this.setState({
      selectedLine: "none",
      newLine: {}
    });
    document.getElementById("addName").value = "";
  }

  saveNewLine = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "id": null,
      "name": this.state.newLine.name
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/lines", requestOptions)
      .then(response => response.text())
      .then(response => window.location.reload())
      // .catch(error => console.log('error', error));
  }

  render() { 
    const selectedLineDiv = this.state.selectedLine === "none" || this.state.selectedLine === "add" ? "hidden" : "selectedLineDiv";
    const selectedLine = this.state.selectedLine;
    const sortBy = "Showing lines sorted by " + this.state.sortBy.toUpperCase() + ".";
    const lineListDiv = this.state.selectedLine === "none" ? "lineListDiv" : "hidden";
    const updateLineDiv = this.state.selectedLine === "none"|| this.state.selectedLine === "add" ? "hidden" : "updateLineDiv";
    const lineList = this.state.sortedList;
    const addLineDiv = this.state.selectedLine === "add" ? "addLineDiv" : "hidden";
    const lastCheck = this.state.lastCheck === true ? "lastCheck" : "hidden";
    
    return (<div className="adminPage">
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className={selectedLineDiv}>
          <table className="adminTable">
            <tr className='adminRow'>
              <td>
                <span>ID</span>
              </td>
              <td>
                <span>Line Name</span>
              </td>
            </tr>
            <tr className='adminRow'>
              <td>{selectedLine.id}</td>
              <td>{selectedLine.name}</td>
            </tr>
          </table>
          <Link
            to=""
            className="adminLink"
            onClick={() => {
              this.setState({ 
                selectedLine: "none",
                updateSelectedLine: undefined,
                 });
            }}
          >
            Deselect Line
          </Link><br/><br/>
        </div>
        <div className={lineListDiv}>
          <p>
          {sortBy}
          </p>
          <table>
            <tr className='adminRow'>
              <td/>
              <td>
                <Link to="" onClick={() => {
                  this.sortList(this.state.lineList, "id");
                }}>ID</Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.lineList, "lineName");
                  }}
                >
                  Line Name
                </Link>
              </td>
            </tr>
              {lineList.map((lines) => {
                return (
                  <tr className='adminRow'>
                    <td>
                    <Link
                      to=""
                      className="adminLink"
                      onClick={() => {
                        this.setState({ 
                          selectedLine: lines,
                          updateSelectedLine: lines
                         });
                      }}
                    >
                      Open
                    </Link>
                    </td>
                    <td>
                      {lines.id}
                    </td>
                    <td>
                    {lines.name}
                    </td>
                  </tr>
                )
              })}
          </table>
          <Link to="" onClick={()=>{
            this.setState({selectedLine: "add"})
          }}>Add a line</Link>
        </div>
        <div className={updateLineDiv}>
          <table>
            <tr className='adminRow'>
              <td>Line Name</td>
              <td>
                <input type="text" name="name" defaultValue={selectedLine.name}
                onBlur={this.updateSelectedLine("name")}/>
              </td>
              <Link to="" onClick={()=>this.saveLine()}>Update Line</Link>
            </tr>
          </table>
        </div>
        <div className={addLineDiv}>
        <table>
          <tr className='adminRow'>
            <td>Name</td>
            <td>
            <input
            id="addName"
            type="text"
            name="name"
            onBlur={this.addNewLine("name")}
          />
            </td>
          </tr>
        </table>
        <Link to="" onClick={()=>this.setState({lastCheck: true})}>Add this line</Link>
        <div className={lastCheck}>
          <span className='alertRedText'>
            Are you sure you want to add this line?
          </span>
          <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.saveNewLine()}>Yes</Link>
        </div>
        <br/><br/>
        <Link to="" onClick={()=>this.resetAndClearForm()}>Back to line</Link>
        </div>
    </div>);
  }
}
 
export default Lines;