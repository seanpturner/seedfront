import React, { Component } from 'react';

class Users extends Component {
  constructor(props) {
    super(props);
  }
  state = { 
    allUsers: [],
   }

  componentDidMount = () => {
    this.getAllUsers();
  }

  getAllUsers = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:8080/users", requestOptions)
      .then(response => response.json())
      .then(result => this.setState({ allUsers: result }));
      // .catch(error => console.log('error', error));
  }

  render() { 

    const allUsers = this.state.allUsers;

    return ( 
      <div>
        <table>
          {allUsers.map((users) => {
            return (
              <tr>
                <td>{users.id}</td>
                <td>{users.userName}</td>
                <td>{users.fName}</td>
                <td>{users.lName}</td>
                <td>{users.email}</td>
                <td>{users.dateCreated}</td>
                <td>{users.birthDate}</td>
                <td>{users.active === true ? "Active" : "Inactive"}</td>
                <td>{users.accountType}</td>
                <td>{users.businessName}</td>
                <td>{users.businessAddress1}</td>
                <td>{users.businessAddress2}</td>
                <td>{users.businessState}</td>
                <td>{users.businessZip}</td>
                <td>{users.businessPhone}</td>
                <td>{users.businessPhoneExt}</td>
                <td>{users.pricingStructure}</td>
                <td>{users.salesTax}</td>
              </tr>
            )
          })}
        </table>
      </div>
     );
  }
}
 
export default Users;