import React, { useState } from 'react';
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function Login() {

    const [inputs, setInputs] = useState({
        userName: null,
        password: null
    });

    const [newUser, setNewUser] = useState({
        id: null,
        userName: null,
        password: null,
        fName: null,
        lName: null,
        email: null,
        dateCreated: null,
        birthDate: null,
        active: true,
        accountType: 'user',
        address1: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        phone: null,
        businessName: null,
        businessPhone: null,
        businessPhoneExt: null,
        pricingStructure: 5,
        salesTax: true
    });

    const okToSubmit = newUser.userName && newUser.password && newUser.fName && newUser.lName && newUser.email && newUser.birthDate && newUser.address1 && newUser.city && newUser.state && newUser.zip ? 'okToSubmit' : 'hidden';

    const updateNewUser = (e) => {
        let nu = {...newUser};
        nu.dateCreated = todaysDate();
        nu[e.target.name] = e.target.value;
        if (e.target.name === 'newPassword1' || e.target.name === 'newPassword2') {
            let md5 = require('md5');
            nu[e.target.name] = md5(e.target.value);
            if (nu.newPassword1 === nu.newPassword2) {
                nu.password = nu.newPassword1;
                let i = inputs;
                i.password = nu.password;
                setInputs(i);
            }else{
                nu.password = null;
                let i = inputs;
                i.password = null;
                setInputs(i);
            }
        }
        if (e.target.name === 'birthYear') {
            let by = e.target.value;
            for (let i=0; i<by.length; i++) {
                let compareTo = '0123456789';
                let digit = by[i];
                if (!compareTo.includes(digit)) {
                    document.getElementById('birthYear').value = '';
                    nu.birthYear = null;
                }
            }
        }
        if (e.target.name === 'birthMonth' || e.target.name === 'birthDay' || e.target.name === 'birthYear') {
            if (nu.birthYear && nu.birthYear.length === 4 && parseInt(nu.birthYear) > 1900 && parseInt(nu.birthYear) < 2022 && nu.birthMonth && nu.birthDay) {
                nu.birthDate = nu.birthYear + nu.birthMonth + nu.birthDay;
            }
        }
        if (e.target.name === 'userName') {
            let un = e.target.value;
            if (un.replace(/\s/g, '') !== '') {
                checkUserName(un);
            }else{
                nu[e.target.name] = null;
                let i = inputs;
                i.userName = null;
                setInputs(i);
            }
            
        }
        if (e.target.value.replace(/\s/g, '') === '') {
            nu[e.target.name] = null;
        }
        setNewUser(nu);
    }

    const updateUserName = (availability) => {
        let nu = newUser;
        if (availability !== '') {
            nu.userName = null;
            setNewUser(nu);
            alert('this username is taken');
        }else{
            let i = inputs;
            i.userName = nu.userName;
            setInputs(i);
        }
    }

    const checkUserName = (name) => {
        let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("http://localhost:8080/users/user/" + name, requestOptions)
            .then(response => response.text())
            .then(result => {updateUserName(result)})
    }

    const todaysDate = () => {
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
        let dateValue =  year + dash1 + month + dash2 + day;
        return dateValue;
    }

    const [viewDiv, setViewDiv] = useState('login');
    const loginInputs = viewDiv === 'login' ? 'loginInputs' : 'hidden';
    const createAccount = viewDiv === 'createAccount' ? 'createAccount' : 'hidden';

    const baseUrl = 'http://localhost:8080/users/getToken/';

    const handleChange = (e) => {
        let i = {...inputs};
        let val = e.target.value;
        let md5 = require('md5');
        if (e.target.name === 'password') {
            val = md5(val);
        }
        i[e.target.name] = val;
        setInputs(i);
    }

    const checkPassword = () => {
        setTimeout(() => {
            timeOutLogIn(50);
        }, 1000);
        submitPassword();
    }

    const submitPassword = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            mode: 'cors'
        };
          
        fetch(baseUrl + inputs.userName + '/' + inputs.password, requestOptions)
            .then(response => response.text())
            .then(response => {
                sessionStorage.setItem('bearerToken', response)
                sessionStorage.setItem('userName', inputs.userName);
        })
        .then(() => clearFields()) 
    }

    const clearFields = () => {
        document.getElementById('userName').value = '';
        document.getElementById('password').value = '';
    }

    const unableToLogIn = () => {
        window.location.assign('./loginfailure');
    }
    
    const timeOutLogIn = (n) => {
        let tokenCheck = sessionStorage.getItem('bearerToken');
        if (n > 0) {
            if (tokenCheck === 'invalid') {
                sessionStorage.clear();
                unableToLogIn();
            }
            if (tokenCheck === '' || tokenCheck === null) {
                console.log(n);
                n--
                setTimeout(() => {
                    timeOutLogIn(n);
                }, 100);
            }
            if (tokenCheck && tokenCheck !== 'invalid' && tokenCheck !== '') {
                window.location.assign('./loginsuccess');
            } 
        }
        else{
            sessionStorage.clear();
            unableToLogIn();
        }    
    }

    const addNewUser = () => {
        let nu = {...newUser};
        let i = inputs;
        i.userName = nu.userName;
        i.password = nu.password;
        setInputs(i);

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(nu);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/users", requestOptions)
        .then(response => response.text())
        .then(result => {window.location.assign('./creationsuccess');})
    }

    const catchEnter = (e) => {
        if (e.key === 'Enter' && (e.target.id === 'userName' || e.target.id === 'password')) {
            checkPassword();
        }
    }

    return (
        <div className='pubPage'>
            <div className='navBar'>
                <NavBar/>
                {/* <br/>{JSON.stringify(newUser)}<br/>
                <br/>{JSON.stringify(inputs)} */}
            </div>
            <div className={loginInputs}>
                <input id='userName' type='text' name='userName' onKeyDown={(e)=>{catchEnter(e)}} onChange={(e)=>{handleChange(e)}}/><br/>
                <input id='password' type='password' name='password' onKeyDown={(e)=>{catchEnter(e)}} onChange={(e)=>{handleChange(e)}}/><br/>
                <button onClick={()=>checkPassword()}>Submit</button><br/>
                <span>Don't have an account?<br/>
                <Link to='' onClick={()=>setViewDiv('createAccount')}>Click here</Link></span>
            </div>
            <div className={createAccount}>
                <table>
                    <tr>
                        <td>User Name</td>
                        <td><input id='newUserName' type='text' name='userName' onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input id='newPassword1' type='password' name='newPassword1' onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>Re-enter password</td>
                        <td><input id='newPassword2' type='password' name='newPassword2' onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>First name</td>
                        <td><input id='newFName' type='text' name='fName' onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>Last name</td>
                        <td><input id='newLName' type='text' name='lName' onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input id='newEmail' type='text' name='email' onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>Birth Date</td>
                        <td>
                            <select id='birthMonth' name='birthMonth' onChange={(e)=>{updateNewUser(e)}}>
                                <option value=''>Month</option>
                                <option value='-01-'>January</option>
                                <option value='-02-'>February</option>
                                <option value='-03-'>March</option>
                                <option value='-04-'>April</option>
                                <option value='-05-'>May</option>
                                <option value='-06-'>June</option>
                                <option value='-07-'>July</option>
                                <option value='-08-'>August</option>
                                <option value='-09-'>September</option>
                                <option value='-10-'>October</option>
                                <option value='-11-'>November</option>
                                <option value='-12-'>December</option>
                            </select>
                            <select id='birthDay' name='birthDay' onChange={(e)=>{updateNewUser(e)}}>
                                <option value=''>Day</option>
                                <option value='01'>01</option>
                                <option value='02'>02</option>
                                <option value='03'>03</option>
                                <option value='04'>04</option>
                                <option value='05'>05</option>
                                <option value='06'>06</option>
                                <option value='07'>07</option>
                                <option value='08'>08</option>
                                <option value='09'>09</option>
                                <option value='10'>10</option>
                                <option value='11'>11</option>
                                <option value='12'>12</option>
                                <option value='13'>13</option>
                                <option value='14'>14</option>
                                <option value='15'>15</option>
                                <option value='16'>16</option>
                                <option value='17'>17</option>
                                <option value='18'>18</option>
                                <option value='19'>19</option>
                                <option value='20'>20</option>
                                <option value='21'>21</option>
                                <option value='22'>22</option>
                                <option value='23'>23</option>
                                <option value='24'>24</option>
                                <option value='25'>25</option>
                                <option value='26'>26</option>
                                <option value='27'>27</option>
                                <option value='28'>28</option>
                                <option value='29'>29</option>
                                <option value='30'>30</option>
                                <option value='31'>31</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Birth year</td>
                        <td><input id='birthYear' name='birthYear' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>Address1</td>
                        <td><input id='newAddress1' name='address1' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>Address2</td>
                        <td><input id='newAddress2' name='address2' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>City</td>
                        <td><input id='newCity' name='city' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td><input id='newState' name='state' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>Zip</td>
                        <td><input id='newZip' name='zip' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td><input id='newPhone' name='phone' onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td className={okToSubmit}><button onClick={()=>addNewUser()}>Submit</button></td>
                    </tr>
                    <tr>
                        <td/>
                    </tr>
                    <tr>
                        <td>Have an account?<br/><Link to='' onClick={()=>setViewDiv('login')}>Click here</Link></td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

export default Login;
