import React, { Component } from "react";
import AdminNav from "./AdminNav";
import { Link } from "react-router-dom";

class Users extends Component {
  state = {
    userList: [],
    sortBy: "",
    sortDirection: "descending",
    sortedList: [],
    dataSet: "active",
    dataRequest: [
      {
        show: "all",
        requestPath: "/users",
      },
      {
        show: "active",
        requestPath: "/users/active",
      },
    ],
    selectedUser: "none",
    lastCheck: false,
    updatePassword: false,
    password1: "",
    password2: "",
    searchString: "",
    searchResults: [],
    updatePricing: false,
    pricingList: [],
    updateSelectedUser: ""
  };

  componentDidMount = () => {
    this.getUsers("active", "get");
  };

  getUsers = (dSet, fetchMethod) => {
    let dataRqOptions = this.state.dataRequest;
    let dataRqPath;
    dataRqOptions.forEach((element) => {
      if (element.show === dSet) {
        this.setState({ dataSet: dSet });
        dataRqPath = element.requestPath;
      }
    });

    let rq = "https://www.boutiqueseedsnm.com" + dataRqPath;
    let requestOptions = {
      method: fetchMethod.toUpperCase(),
    };

    fetch(rq, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.getPricing(result);
      });
    // .catch(error => console.log('error', error));
  };

  getPricing = (userList) => {
    fetch("https://www.boutiqueseedsnm.com/pricing", {method: 'GET'}) 
      .then((response) => response.json())
      .then((response) => this.addPricingLabels(userList, response))
  }

  addPricingLabels = (ul, pl) => {
    let userListWithPricingLabel = [];
    ul.forEach(user => {
      pl.forEach(pricing => {
        if (user.pricingStructure === pricing.id) {
          user.pricingLabel = pricing.label;
          userListWithPricingLabel.push(user);
        }
      });
    });
    this.setState({ 
      userList: userListWithPricingLabel,
      pricingList: pl
    });
    this.sortList(userListWithPricingLabel, "id");
    this.createPricingDropdowns(pl);
  }

  createPricingDropdowns = (pricingList) => {
    pricingList.sort((a, b) => (a.label > b.label ? 1 : -1));
    let upSelect = document.getElementById("updatePricingSelect");
    upSelect.innerHTML = "";
    upSelect.options.add(new Option("Select", "", true));
    pricingList.forEach(pricing => {
      upSelect.options.add(new Option(pricing.label + " (" + pricing.id + ")", pricing.id, false))
    });
    upSelect.parentNode.replaceChild(upSelect, upSelect);

  }
  
  saveUpdatedUser = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(this.state.updateSelectedUser)
    };

    fetch("https://www.boutiqueseedsnm.com/users/updateUser/" + this.state.updateSelectedUser.id, requestOptions)
  .then(response => response.text())
  .then(response => {
    this.setState({ selectedUser: "none" });
    this.getUsers(this.state.dataSet, "get");
  })
  .then(response => window.location.replace('./openorders'))
  }

  sortList = (users, by) => {
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
      users.sort((a, b) => (a[by] > b[by] ? 1 : -1));
      this.setState({
        sortedList: users,
        sortBy: by,
      });
    }
    if (sortDirection === "descending") {
      users.sort((a, b) => (a[by] < b[by] ? 1 : -1));
      this.setState({
        sortedList: users,
        sortBy: by,
      });
    }
  };

  updateSelectedUser = (key) => (event) => {
    let usd = this.state.updateSelectedUser;
    if (key === "active" || key === "salesTax") {
      usd[key] = !usd[key]
    }else{
      usd[key] = event.target.value;
    }
    if (key === "pricingStructure") {
      let pricingList = this.state.pricingList;
      pricingList.forEach(pricing => {
        if (pricing.id === parseInt(event.target.value)) {
          usd.pricingLabel = pricing.label;
        }
      });
    }
    if (usd.pricingStructure === "") {
      usd.pricingStructure = 1;
    }
    this.setState({ updateSelectedUser: usd });
  }

  handlePassword = (pw) => (event) => {
    this.setState({[pw]: event.target.value});
  }

  savePassword = () => {

    let fetchUrl = "https://www.boutiqueseedsnm.com/users/updatepasswordonly/"+ this.state.updateSelectedUser.id + "/" + this.state.password1;
      let requestOptions = {
        method: 'PUT',
        body: ""
      };
      
      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .window.location.replace('./openorders')
  }

  searchFor = () => (event) => {
    let noSpace = event.target.value.replace(/\s/g, '').toLowerCase();
    let ul = this.state.userList;
    let returnArray = [];
    this.setState({ searchString: noSpace });
    ul.forEach(element => {
      let searchString1 = element.userName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      let searchString2 = element.fName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      let searchString3 = element.lName.replace(/\s/g, '').slice(0, noSpace.length).toLowerCase();
      if (noSpace === searchString1 || noSpace === searchString2 || noSpace === searchString3) {
        let addUser = {"id": element.id, "userName": element.userName, "fName": element.fName, "lName": element.lName};
        if (!returnArray.includes(addUser)) {
          returnArray.push(addUser);
        }
      }
    });
    this.setState({ searchResults: returnArray });
  }

  setSearchEntity = (id) => {
    let ul = this.state.userList;
    ul.forEach(element => {
      if (element.id === id) {
        this.setState({
          selectedUser: element,
          searchResults: []
          });
          document.getElementById("searchInput").value = "";
      }
    });
 }

 getSelectableDate = (dateValue, y, m, d) => {
  let us = this.state.selectedUser;
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
  if (us === 'none') {
    return updatedDateValue;
  }else{
    us.birthDate = updatedDateValue;
  this.setState({ selectedUser: us });
  }
}

  render() {
    const userList = this.state.sortedList;
    const sortBy = "sorted by " + this.state.sortBy;
    const dataSet = "Showing " + this.state.dataSet + " users ";
    const selectedUser = this.state.selectedUser;
    const selectedUserDiv = this.state.selectedUser === "none" ? "hidden" : "selectedUserDiv";
    const userListDiv = this.state.selectedUser === "none" ? "userListDiv" : "hidden";
    const updateUserDiv = this.state.selectedUser === "none" ? "hidden" : "updateUserDiv";
    const toggleSet = this.state.dataSet === "all" ? "active" : "all";
    const lastCheck = this.state.lastCheck === true ? "lastCheck" : "hidden";
    const updatePassword = this.state.updatePassword === true ? "updatePassword" : "hidden";
    const passwordsMatch = this.state.password1 !== "" && this.state.password2 !== "" && this.state.password1 === this.state.password2 ? "passwordsMatch" : "hidden";
    const searchResultsDiv = this.state.searchString === "" ? "hidden" : "searchResultsDiv";
    const searchResults = this.state.searchResults;
    const updatePricing = this.state.updatePricing ? "updatePricing" : "hidden";
    return (
      <div className="adminPage">
        <div className="adminNavDiv">
          <AdminNav />
        </div>
        <div className={selectedUserDiv}>
        <h1 className="adminSectionTitle">Update A User</h1>
        <p><Link
            to=""
            className="adminLink"
            onClick={() => {
              this.setState({ 
                selectedUser: "none",
                updateSelectedUser: undefined,
                password1: "",
                password2: "",
                lastCheck: false,
                updatePassword: false
                 });
            }}
          >
            Back to user list
          </Link></p>
          <p>
          <table className="adminTable">
            <tr className="adminRow">
              <td>
                <span>ID</span>
              </td>
              <td>
                <span>User Name</span>
              </td>
              <td>
                <span>Last Name</span>
              </td>
              <td>
                <span>First Name</span>
              </td>
              <td>
                <span>Email</span>
              </td>
              <td>
                <span>Date Created</span>
              </td>
              <td>
                <span>Birthday</span>
              </td>
              <td>
                <span>Active</span>
              </td>
              <td>
                <span>User Type</span>
              </td>
              <td>
                <span>Address</span>
              </td>
              <td>
                <span>City</span>
              </td>
              <td>
                <span>State</span>
              </td>
              <td>
                <span>Zip Code</span>
              </td>
              <td>
                <span>Phone Number</span>
              </td>
              <td>
                <span>Business Name</span>
              </td>
              <td>
                <span>Business Phone</span>
              </td>
              <td>
                <span>Ext.</span>
              </td>
              <td>
                <span>Pricing</span>
              </td>
              <td>
                <span>Taxable</span>
              </td>
            </tr>
            <tr className="adminRow">
              <td>{selectedUser.id}</td>
              <td>{selectedUser.userName}</td>
              <td>{selectedUser.lName}</td>
              <td>{selectedUser.fName}</td>
              <td>{selectedUser.email}</td>
              <td>{selectedUser.dateCreated}</td>
              <td>{selectedUser.birthDate}</td>
              <td>
                {selectedUser.id === undefined
                  ? ""
                  : selectedUser.active.toString()}
              </td>
              <td>{selectedUser.accountType}</td>
              <td>
                {selectedUser.address1}
                <br />
                {selectedUser.address2}
              </td>
              <td>{selectedUser.city}</td>
              <td>{selectedUser.state}</td>
              <td>{selectedUser.zip}</td>
              <td>{selectedUser.phone}</td>
              <td>{selectedUser.businessName}</td>
              <td>{selectedUser.businessPhone}</td>
              <td>{selectedUser.businessPhoneExt}</td>
              <td>{selectedUser.pricingLabel}</td>
              <td>
                {selectedUser.id === undefined
                  ? ""
                  : selectedUser.salesTax.toString()}
              </td>
            </tr>
          </table></p>
        </div>
        <div className={userListDiv}>
        <h1 className="adminSectionTitle">Users</h1>
          <p className="adminSortText">
            {dataSet}
            {sortBy}. Show <Link to="" onClick={()=>{this.getUsers(toggleSet, "get")}}>{toggleSet}</Link> users.
          </p>
            <div className='searchDiv adminSortText'>Search by name &nbsp;
              <input id="searchInput" type="text" onChange = {this.searchFor("userName")} />
            </div>
            <div className={searchResultsDiv}>
            <table>
                  {searchResults.map((sr)=>{
                    return (
                      <tr>
                        <td>
                          <Link to="" onClick={()=>this.setSearchEntity(sr.id)}>{sr.fName} {sr.lName} { "<" + sr.userName + ">"}</Link>
                        </td>
                      </tr>
                    )
                  })}
            </table>
        </div>
          <table>
            <tr className="adminRow">
              <td />
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "id");
                  }}
                >
                  ID
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "userName");
                  }}
                >
                  User Name
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "lName");
                  }}
                >
                  Last Name
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "fName");
                  }}
                >
                  First Name
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "email");
                  }}
                >
                  Email
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "dateCreated");
                  }}
                >
                  Date Created
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "birthDate");
                  }}
                >
                  Birthday
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "active");
                  }}
                >
                  Active
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "accountType");
                  }}
                >
                  User Type
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "address1");
                  }}
                >
                  Address
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "city");
                  }}
                >
                  City
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "state");
                  }}
                >
                  State
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "zip");
                  }}
                >
                  ZIP Code
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "phone");
                  }}
                >
                  Phone Number
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "businessName");
                  }}
                >
                  Business Name
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "businessPhone");
                  }}
                >
                  Business Phone
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "businessPhoneExt");
                  }}
                >
                  Ext.
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "pricingStructure");
                  }}
                >
                  Pricing
                </Link>
              </td>
              <td>
                <Link
                  to=""
                  onClick={() => {
                    this.sortList(this.state.userList, "salesTax");
                  }}
                >
                  Taxable
                </Link>
              </td>
            </tr>
            {userList.map((users) => {
              return (
                <tr className="adminRow">
                  <td>
                    <Link
                      to=""
                      className="adminLink"
                      onClick={() => {
                        this.setState({ 
                          selectedUser: users,
                          updateSelectedUser: users
                         });
                      }}
                    >
                      Open
                    </Link>
                  </td>
                  <td>{users.id}</td>
                  <td>{users.userName}</td>
                  <td>{users.lName}</td>
                  <td>{users.fName}</td>
                  <td>{users.email}</td>
                  <td>{users.dateCreated}</td>
                  <td>{users.birthDate}</td>
                  <td>{users.active === true ? "Active" : "Inactive"}</td>
                  <td>{users.accountType}</td>
                  <td>
                    {users.address1}
                    <br />
                    {users.address2}
                  </td>
                  <td>{users.city}</td>
                  <td>{users.state}</td>
                  <td>{users.zip}</td>
                  <td>{users.phone}</td>
                  <td>{users.businessName}</td>
                  <td>{users.businessPhone}</td>
                  <td>{users.businessPhoneExt}</td>
                  <td>{users.pricingLabel}</td>
                  <td>
                    {users.salesTax === null
                      ? ""
                      : users.salesTax === true
                      ? "Taxable"
                      : "Tax Exempt"}
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
        <div className={updateUserDiv}>
        <p>
        <table>
        <tr></tr>
          <tr className="adminRow">
            <td>User Name</td>
            <td><input
            type="text"
            name="userName"
            defaultValue={selectedUser.userName}
            onBlur={this.updateSelectedUser('userName')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Last Name</td>
            <td><input
            type="text"
            name="lName"
            defaultValue={selectedUser.lName}
            onBlur={this.updateSelectedUser('lName')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>First Name</td>
            <td><input
            type="text"
            name="fName"
            defaultValue={selectedUser.fName}
            onBlur={this.updateSelectedUser('fName')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Email</td>
            <td><input
            type="text"
            name="email"
            defaultValue={selectedUser.email}
            onBlur={this.updateSelectedUser('email')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>BirthDate</td>
            <td>
            {selectedUser.birthDate}<br/>
            <Link to='' onClick={()=>this.getSelectableDate(selectedUser.birthDate,-1,0,0)}>{'<'}</Link>
            <span>Y</span>
            <Link to='' onClick={()=>this.getSelectableDate(selectedUser.birthDate,1,0,0)}>{'>'}</Link>&nbsp;
            <Link to='' onClick={()=>this.getSelectableDate(selectedUser.birthDate,0,-1,0)}>{'<'}</Link>
            <span>M</span>
            <Link to='' onClick={()=>this.getSelectableDate(selectedUser.birthDate,0,1,0)}>{'>'}</Link>&nbsp;
            <Link to='' onClick={()=>this.getSelectableDate(selectedUser.birthDate,0,0,-1)}>{'<'}</Link>
            <span>D</span>
            <Link to='' onClick={()=>this.getSelectableDate(selectedUser.birthDate,0,0,1)}>{'>'}</Link><br/>
          </td>
          </tr>
          <tr className="adminRow">
            <td>Active</td>
            <td><input
            type="checkbox"
            checked={selectedUser.active}
            onChange={this.updateSelectedUser('active')}
            />
            </td>
          </tr>
          <tr className="adminRow">
            <td>Account Type</td>
            <td><input
            type="text"
            name="accountType"
            defaultValue={selectedUser.accountType}
            onBlur={this.updateSelectedUser('accountType')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Address1</td>
            <td><input
            type="text"
            name="address1"
            defaultValue={selectedUser.address1}
            onBlur={this.updateSelectedUser('address1')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Address 2</td>
            <td><input
            type="text"
            name="address2"
            defaultValue={selectedUser.address2}
            onBlur={this.updateSelectedUser('address2')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>City</td>
            <td><input
            type="text"
            name="city"
            defaultValue={selectedUser.city}
            onBlur={this.updateSelectedUser('city')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>State</td>
            <td><input
            type="text"
            name="state"
            defaultValue={selectedUser.state}
            onBlur={this.updateSelectedUser('state')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>ZIP</td>
            <td><input
            type="text"
            name="zip"
            defaultValue={selectedUser.zip}
            onBlur={this.updateSelectedUser('zip')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Phone Number</td>
            <td><input
            type="text"
            name="phone"
            defaultValue={selectedUser.phone}
            onBlur={this.updateSelectedUser('phone')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Business Name</td>
            <td><input
            type="text"
            name="businessName"
            defaultValue={selectedUser.businessName}
            onBlur={this.updateSelectedUser('businessName')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Business Phone</td>
            <td><input
            type="text"
            name="businessPhone"
            defaultValue={selectedUser.businessPhone}
            onBlur={this.updateSelectedUser('businessPhone')}
          /></td>
          </tr>
          <tr className="adminRow">
            <td>Ext.</td>
            <td><input
            type="text"
            name="businessPhoneExt"
            defaultValue={selectedUser.businessPhoneExt}
            onBlur={this.updateSelectedUser('businessPhoneExt')}
          /></td>
          </tr>
          <tr>
            <td>Pricing</td>
            <td><span id="updatePricing">{selectedUser.pricingLabel} <Link to="" onClick={()=>this.setState({ updatePricing: true})}>Update Pricing</Link></span></td>
            <td className={updatePricing}><select id="updatePricingSelect" onChange={this.updateSelectedUser('pricingStructure')}></select></td>
          </tr>
          <tr className="adminRow">
            <td>Taxable</td>
            <td><input
            type="checkbox"
            checked={selectedUser.salesTax}
            onChange={this.updateSelectedUser('salesTax')}
            /></td>
          </tr>
        </table></p>
        <Link to="" onClick={()=>this.setState({
          updatePassword: true,
          lastCheck: false
          })}>Update password</Link> <br/>
        <Link to="" onClick={()=>this.setState({
          lastCheck: true,
          updatePassword: false,
          password1: "",
          password2: ""
          })}>Update this user</Link>
        
          <div className={lastCheck}>
            <span className="alertRedText">Are you sure you want to update this user? </span>
            <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>{this.saveUpdatedUser();
              this.setState({'lastCheck' : false});
            }}>Yes</Link><br/>
          </div>
          <div className={updatePassword}>
          <p>
          <table>
            <tr className="adminRow">
              <td>New Password</td>
              <td><input
              type="text"
              name="password1"
              onBlur={this.handlePassword("password1")}
            /></td>
            <td>New Password</td>
              <td><input
              type="text"
              name="password2"
              onBlur={this.handlePassword("password2")}
            /></td>
            </tr>
          </table></p>
          <p className={passwordsMatch}>
            <Link to="" onClick={()=>this.savePassword()}>Save Password</Link><br/>
          </p>
          <Link to="" onClick={()=>this.setState({
            updatePassword: false,
            password1: "",
            password2: ""
            })}>Close Password Modal</Link><br/>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
