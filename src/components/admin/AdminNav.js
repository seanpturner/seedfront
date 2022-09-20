import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

function AdminNav() {
  
    const checkAuth = () => {
        let requestOptions;
        let un = localStorage.getItem('userName');
        let token = localStorage.getItem('bearerToken');

        if (!un || un === '' || !token || token === '') {
            kickToLogin();
        }else{
        let myHeaders = new Headers();
        myHeaders.append("bearerToken", token);

        requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        }

        fetch("https://www.boutiqueseedsnm.com/users/checkUserLevel/" + un, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.grantAccess !== true || result.userAccountType !== 'admin') {
                kickToLogin();
            }
        })
    }

    const kickToLogin = () => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('./login');
    }

    useEffect(() => {
        checkAuth();
    })

  return (
    <div className ="adminDiv">
        <table>
          <tr>
            <td><Link to='/admin'>Admin Home</Link></td>
            <td><Link to='/home'>Public Site</Link></td>
            <td><Link to='/comments'>Comments</Link></td>
            <td><Link to='/content'>Content</Link></td>
            <td><Link to='/discounts'>Discounts</Link></td>
            <td><Link to='/lines'>Lines</Link></td>
            <td><Link to='/logins'>Logins</Link></td>
            <td><Link to='/messages'>Messages</Link></td>
            <td><Link to='/plants'>Plants</Link></td>
            <td><Link to='/pricing'>Pricing</Link></td>
            <td><Link to='/openorders'>Orders</Link></td>
            <td><Link to='/seeds'>Seeds</Link></td>
            <td><Link to='/users'>Users</Link></td>
            <td><Link to='' onClick={()=>kickToLogin()}>Log out</Link></td>
          </tr>
        </table>
    </div>
  )
}

export default AdminNav