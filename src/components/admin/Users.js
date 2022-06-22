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
    password2: ""
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

    let rq = "http://localhost:8080" + dataRqPath;
    let requestOptions = {
      method: fetchMethod.toUpperCase(),
    };

    fetch(rq, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.setState({ userList: result });
        this.sortList(result, "id");
      });
    // .catch(error => console.log('error', error));
  };
  
  saveUpdatedUser = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(this.state.updateSelectedUser)
    };

    fetch("http://localhost:8080/users/updateUser/" + this.state.updateSelectedUser.id, requestOptions)
  .then(response => response.text())
  .then(response => window.location.reload())
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
    this.setState({ updateSelectedUser: usd });
  }

  handlePassword = (pw) => (event) => {
    this.setState({[pw]: event.target.value});
  }

  savePassword = () => {

    let fetchUrl = "http://localhost:8080/users/updatepasswordonly/"+ this.state.updateSelectedUser.id + "/" + this.state.password1;
      let requestOptions = {
        method: 'PUT',
        body: ""
      };
      
      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        .then(window.location.reload())
        // .catch(error => console.log('error', error));
  }

  render() {
    const userList = this.state.sortedList;
    const sortBy = "sorted by " + this.state.sortBy.toUpperCase();
    const dataSet = "Showing " + this.state.dataSet.toUpperCase() + " users ";
    const selectedUser = this.state.selectedUser;
    const selectedUserDiv =
      this.state.selectedUser === "none" ? "hidden" : "selectedUserDiv";
    const userListDiv = this.state.selectedUser === "none" ? "userListDiv" : "hidden";
    const updateUserDiv = this.state.selectedUser === "none" ? "hidden" : "updateUserDiv";
    const toggleSet = this.state.dataSet === "all" ? "active" : "all";
    const lastCheck = this.state.lastCheck === true ? "lastCheck" : "hidden";
    const updatePassword = this.state.updatePassword === true ? "updatePassword" : "hidden";
    const passwordsMatch = this.state.password1 != "" && this.state.password2 != "" && this.state.password1 === this.state.password2 ? "passwordsMatch" : "hidden";

    return (
      <div className="adminPage">
        <div className="adminNavDiv">
          <AdminNav />
        </div>

        <div className={selectedUserDiv}>
          <table className="adminTable">
            <tr>
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
            <tr>
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
              <td>{selectedUser.pricingStructure}</td>
              <td>
                {selectedUser.id === undefined
                  ? ""
                  : selectedUser.salesTax.toString()}
              </td>
            </tr>
          </table>
          <Link
            to=""
            className="adminLink"
            onClick={() => {
              this.setState({ 
                selectedUser: "none",
                updateSelectedUser: undefined,
                password1: "",
                password2: ""
                 });
            }}
          >
            Deselect User
          </Link>
        </div>
        <div className={userListDiv}>
          <p>
            {dataSet}
            {sortBy}. Show <Link to="" onClick={()=>{this.getUsers(toggleSet, "get")}}>{toggleSet}</Link> users.
          </p>
          <table>
            <tr>
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
                <tr>
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
                  <td>{users.pricingStructure}</td>
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
        <table>
          <tr>
            <td>User Name</td>
            <td><input
            type="text"
            name="userName"
            defaultValue={selectedUser.userName}
            onBlur={this.updateSelectedUser('userName')}
          /></td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td><input
            type="text"
            name="lName"
            defaultValue={selectedUser.lName}
            onBlur={this.updateSelectedUser('lName')}
          /></td>
          </tr>
          <tr>
            <td>First Name</td>
            <td><input
            type="text"
            name="fName"
            defaultValue={selectedUser.fName}
            onBlur={this.updateSelectedUser('fName')}
          /></td>
          </tr>
          <tr>
            <td>Email</td>
            <td><input
            type="text"
            name="email"
            defaultValue={selectedUser.email}
            onBlur={this.updateSelectedUser('email')}
          /></td>
          </tr>
          <tr>
            <td>BirthDate</td>
            <td><input
            type="text"
            name="birthDate"
            defaultValue={selectedUser.birthDate}
            onBlur={this.updateSelectedUser('birthDate')}
          /></td>
          </tr>
          <tr>
            <td>Active</td>
            <td><input
            type="checkbox"
            checked={selectedUser.active}
            onChange={this.updateSelectedUser('active')}
            />
            </td>
          </tr>
          <tr>
            <td>Account Type</td>
            <td><input
            type="text"
            name="accountType"
            defaultValue={selectedUser.accountType}
            onBlur={this.updateSelectedUser('accountType')}
          /></td>
          </tr>
          <tr>
            <td>Address1</td>
            <td><input
            type="text"
            name="address1"
            defaultValue={selectedUser.address1}
            onBlur={this.updateSelectedUser('address1')}
          /></td>
          </tr>
          <tr>
            <td>Address 2</td>
            <td><input
            type="text"
            name="address2"
            defaultValue={selectedUser.address2}
            onBlur={this.updateSelectedUser('address2')}
          /></td>
          </tr>
          <tr>
            <td>City</td>
            <td><input
            type="text"
            name="city"
            defaultValue={selectedUser.city}
            onBlur={this.updateSelectedUser('city')}
          /></td>
          </tr>
          <tr>
            <td>State</td>
            <td><input
            type="text"
            name="state"
            defaultValue={selectedUser.state}
            onBlur={this.updateSelectedUser('state')}
          /></td>
          </tr>
          <tr>
            <td>ZIP</td>
            <td><input
            type="text"
            name="zip"
            defaultValue={selectedUser.zip}
            onBlur={this.updateSelectedUser('zip')}
          /></td>
          </tr>
          <tr>
            <td>Phone Number</td>
            <td><input
            type="text"
            name="phone"
            defaultValue={selectedUser.phone}
            onBlur={this.updateSelectedUser('phone')}
          /></td>
          </tr>
          <tr>
            <td>Business Name</td>
            <td><input
            type="text"
            name="businessName"
            defaultValue={selectedUser.businessName}
            onBlur={this.updateSelectedUser('businessName')}
          /></td>
          </tr>
          <tr>
            <td>Business Phone</td>
            <td><input
            type="text"
            name="businessPhone"
            defaultValue={selectedUser.businessPhone}
            onBlur={this.updateSelectedUser('businessPhone')}
          /></td>
          </tr>
          <tr>
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
            <td><input
            type="text"
            name="pricingStructure"
            defaultValue={selectedUser.pricingStructure}
            onBlur={this.updateSelectedUser('pricingStructure')}
          /></td>
          </tr>
          <tr>
            <td>Taxable</td>
            <td><input
            type="checkbox"
            checked={selectedUser.salesTax}
            onChange={this.updateSelectedUser('salesTax')}
            /></td>
          </tr>
        </table><br/>
        <Link to="" onClick={()=>this.setState({
          lastCheck: true,
          updatePassword: false,
          password1: "",
          password2: ""
          })}>Update User</Link>&nbsp; &nbsp;
        <Link to="" onClick={()=>this.setState({
          updatePassword: true,
          lastCheck: false
          })}>Update Password</Link> <br/>
          <div className={lastCheck}>
            <span className="alertRedText">Are you sure you want to update this user? </span>
            <Link to="" onClick={()=>this.setState({lastCheck: false})}>No</Link> <Link to="" onClick={()=>this.saveUpdatedUser()}>Yes</Link><br/>
          </div>
          <div className={updatePassword}>
          <table>
            <tr>
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
          </table>
          <Link to="" onClick={()=>this.setState({
            updatePassword: false,
            password1: "",
            password2: ""
            })}>Close Password Modal</Link><br/>
          <div className={passwordsMatch}>
            <Link to="" onClick={()=>this.savePassword()}>Save Password</Link>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
