import React, { useState } from 'react';
import AdminNav from './AdminNav';

function Admin() {

    // const [inputValue, setInputValue] = useState("Sean");

    // let handleChange = (event) => {
    //     const newValue = event.target.value;
    //     setInputValue(newValue);
    // }

  return (
    <div>
    <AdminNav /><br/>
        {/* <input onChange={handleChange} />
        {inputValue} */}
        <p>Admin</p>
        <table>
            <tr>
                <td>Comments</td>
            </tr>
            <tr>
                <td>Content</td>
            </tr>
            <tr>
                <td>Discounts</td>
            </tr>
            <tr>
                <td>Lines</td>
            </tr>
            <tr>
                <td>Logins</td>
            </tr>
            <tr>
                <td>Messages</td>
            </tr>
            <tr>
                <td>Plants</td>
            </tr>
            <tr>
                <td>Purchases</td>
            </tr>
            <tr>
                <td>Purchase Statuses</td>
            </tr>
            <tr>
                <td>Seeds</td>
            </tr>
            <tr>
                <td>Users</td>
            </tr>
        </table>
    </div>
  )
}

export default Admin