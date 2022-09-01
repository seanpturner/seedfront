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

    const [validateFields, setValidateFields] = useState([]);
    const [duplicateUserName, setDuplicateUserName] = useState(false);
    const alertDuplicateUserName = duplicateUserName && newUser.userName ? 'alertDuplicateUserName' : 'hidden';

    const updateValidateFields = (e)=> {
        if (!validateFields.includes(e.target.id)) {
            let updVF = [...validateFields];
            updVF.push(e.target.id);
            setValidateFields(updVF);
        }
    }
    
    const userNameErr = validateFields.includes('newUserName') && alertDuplicateUserName === 'hidden' && (!newUser.userName || newUser.userName === undefined || newUser.userName.length < 5) ? 'userNameErr' : 'hidden';
    const newPassword1Err = validateFields.includes('newPassword1') && (!newUser.newPassword1 || newUser.newPassword1.length < 8 || newUser.newPassword1.includes(' ')) ? 'password1Err' : 'hidden';
    const newPassword2Err = validateFields.includes('newPassword2') && (newUser.newPassword1 !== newUser.newPassword2) ? 'newPassword2Err' : 'hidden';
    const fNameErr = validateFields.includes('newFName') && (!newUser.fName || !/^[A-Za-z]+$/.test(newUser.fName) || newUser.fName.length < 2) ? 'fNameErr' : 'hidden';
    const lNameErr = validateFields.includes('newLName') && (!newUser.lName || !/^[a-zA-Z]+$/.test(newUser.lName) || newUser.lName.length < 2) ? 'lNameErr' : 'hidden';
    const emailErr = validateFields.includes('newEmail') && (!newUser.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newUser.email)) ? 'emailErr' : 'hidden';
    const [birthYearErr, setBirthYearErr] = useState('hidden');
    const [birthYearErrMsg,setBirthYearErrMsg] = useState(null);
    const address1Err = validateFields.includes('newAddress1') && (!newUser.address1 || newUser.address1.length < 6) ? 'address1Err' : 'hidden';
    const cityErr = validateFields.includes('newCity') && (!newUser.city || newUser.city.length < 2) ? 'address1Err' : 'hidden';
    const [stateAbbreviationError, setStateAbbreviationError] = useState(false);
    const stateErr = validateFields.includes('newState') && (!newUser.state || newUser.state.length !== 2 || stateAbbreviationError) ? 'stateErr' : 'hidden';
    const zipErr = validateFields.includes('newZip') && (!newUser.zip || newUser.zip.length !== 5) ? 'zipErr' : 'hidden';
    const phoneErr = validateFields.includes('newPhone') && (!newUser.phone || newUser.phone.length !== 12) ? 'phoneErr' : 'hidden';

    const revalidateBirthYear = () => {
        let nu = newUser;
        if (!validateFields.includes('birthYear')) {
            let updVF = [...validateFields];
            updVF.push('birthYear');
            setValidateFields(updVF);
        }
        if (!nu.birthYear || (nu.birthYear && nu.birthYear.length !== 4)) {
            nu.birthYear = '';
            document.getElementById('birthYear').value = '';
            setBirthYearErrMsg('You must enter a valid 4-digit year');
            setBirthYearErr('birthYearErr');
        }
    }

    const revalidateState = () => {
        let nu = newUser;
        if (!validateFields.includes('newState')) {
            let updVF = [...validateFields];
            updVF.push('newState');
            setValidateFields(updVF);
        }
        if (!nu.state || (nu.state && (nu.state === undefined || nu.state.length !== 2))) {
            nu.state = null;
            document.getElementById('newState').value = '';
            setStateAbbreviationError(true);
            // setBirthYearErr('birthYearErr');
        }
    }

    const catchDelete = (e) => {
        let key = e.key;
        let nu = newUser;
        if (key === "Backspace" || key === "Delete") {
            let noDash = '';
            let newDash = '';
            for (let i=0; i<e.target.value.length; i++) {
                if (e.target.value[i] !== '-') {
                    noDash += e.target.value[i];
                }
            }
            // e.target.value = noDash;
            for (let i=0; i< noDash.length; i++) {
                newDash += noDash[i];
                if (newDash.length === 3 && noDash.length > 3) {
                    newDash += '-';
                }
                if (newDash.length === 7 && noDash.length > 6) {
                    newDash += '-';
                }
            }
            nu.phone = newDash;
            document.getElementById('newPhone').value = newDash;
            // e.target.value = newDash;
            // updateNewUser(e);
        }
    }

    const updateNewUser = (e) => {
        let nu = {...newUser};
        let prevNu = {...newUser};
        let d = new Date();
        let year = d.getFullYear();
        if (nu.userName === null) {
            setDuplicateUserName(false);
        }
        nu.dateCreated = todaysDate();
        nu[e.target.name] = e.target.value;
        if (e.target.name === 'newPassword1' || e.target.name === 'newPassword2') {
            // let md5 = require('md5');
            if (nu.newPassword1 === nu.newPassword2) {
                // nu.password = md5(nu.newPassword1);
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
            setBirthYearErrMsg('');
            setBirthYearErr('hidden');
            let by = e.target.value;
            if (by.length <5 && /^[0-9]*$/.test(by)) {
                if (by.length === 4 && !/^(19|20)\d{2}$/.test(by)) {
                    nu.birthYear = null;
                    document.getElementById('birthYear').value = '';
                    setBirthYearErrMsg('You must enter a valid 4-digit year');
                    setBirthYearErr('birthYearErr');
                }else{
                    if (by.length === 4 && year - by < 18) {
                        setBirthYearErrMsg('You must be at least 18 years old to create an account');
                        setBirthYearErr('birthYearErr');
                    }
                    if (by.length === 4 && year - by > 110) {
                        setBirthYearErrMsg('If you can prove you\'re older than 110, I\'ll send you free seeds');
                        setBirthYearErr('birthYearErr');
                    }
                }
            }else{
                nu.birthYear = null;
                document.getElementById('birthYear').value = '';
                setBirthYearErrMsg('You must enter a valid 4-digit year');
                setBirthYearErr('birthYearErr')
            }
        }
        if (e.target.name === 'birthMonth' || e.target.name === 'birthDay' || e.target.name === 'birthYear') {
            if (nu.birthYear && nu.birthMonth && nu.birthDay) {
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
        if (e.target.name === 'state') {
            document.getElementById('newState').value = e.target.value.toUpperCase();
        }
        if (e.target.name === 'state' && e.target.value.length > 1) {
            // document.getElementById('newState').value = e.target.value.toUpperCase();
                setStateAbbreviationError(false);
            if (!/^((A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY]))$/.test(e.target.value.toUpperCase())) {
                document.getElementById('newState').value = '';
                setStateAbbreviationError(true);
            }
        }
        // <td><input id='newZip' name='zip' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td>
        if (e.target.name === 'zip') {
            if (!/^[0-9]*$/.test(e.target.value)) {
                document.getElementById('newZip').value = '';
            }
            else if (e.target.value.length > 5) {
                nu.zip = prevNu.zip;
                document.getElementById('newZip').value = prevNu.zip;
            }
            else {
                nu.zip = e.target.value;
            }
        }
        if (e.target.name === 'phone') {
            let compareTo = '0123456789-';
            for (let i=0; i<e.target.value.length; i++) {
                let iChar = e.target.value[i];
                if (i !== 3 && i !== 7 && isNaN(iChar)) {
                    nu.phone = prevNu.phone;
                    document.getElementById('newPhone').value = prevNu.phone;
                }
                if (!compareTo.includes(e.target.value[i]) || e.target.value.length > 12) {
                    nu.phone = prevNu.phone;
                    document.getElementById('newPhone').value = prevNu.phone;
                }
                if (e.target.value.length === 3 || e.target.value.length === 7) {
                    nu.phone = nu.phone + '-';
                    document.getElementById('newPhone').value = nu.phone;
                }
                // if (i === 2 || i === 7) {
                //     nu.phone = nu.phone + '-';
                //     document.getElementById('newPhone').value = nu.phone;
                // }
            }
        }
        if (e.target.value.replace(/\s/g, '') === '') {
            nu[e.target.name] = null;
        }
        setNewUser(nu);
    }

    const updateUserName = (availability) => {
        setDuplicateUserName(false);
        let nu = newUser;
        if (availability !== '') {
            // nu.userName = null;
            // setNewUser(nu);
            setDuplicateUserName(true);
            // alert('this username is taken');
        }else{
            let i = inputs;
            i.userName = nu.userName;
            setInputs(i);
            setDuplicateUserName(false);
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
    const loginInputs = viewDiv === 'login' ? 'centeredDiv' : 'hidden';
    const createAccount = viewDiv === 'createAccount' ? 'createAccount' : 'hidden';
    const loader = viewDiv === 'loader' ? 'loader' : 'hidden';

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
        setViewDiv('loader');
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
                localStorage.setItem('bearerToken', response)
                localStorage.setItem('userName', inputs.userName);
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
        let tokenCheck = localStorage.getItem('bearerToken');
        if (n > 0) {
            if (tokenCheck === 'invalid') {
                localStorage.clear();
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
            localStorage.clear();
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

    const clearInputFields = () => {
        let nu = newUser;
        let fieldsToClear = [
            'userName'
            ,'password'
            ,'newUserName'
            ,'newPassword1'
            ,'newPassword2'
            ,'newFName'
            ,'newLName'
            ,'newEmail'
            ,'birthMonth'
            ,'birthDay'
            ,'birthYear'
            ,'newAddress1'
            ,'newAddress2'
            ,'newCity'
            ,'newState'
            ,'newZip'
            ,'newPhone'
        ];
        let jsonToReset = [
            'userName'
            ,'password'
            ,'fName'
            ,'lName'
            ,'email'
            ,'birthDate'
            ,'address1'
            ,'address2'
            ,'city'
            ,'state'
            ,'zip'
            ,'phone'
            ,'newPassword1'
            ,'newPassword2'
            ,'birthMonth'
            ,'birthDay'
            ,'birthYear'
        ]
        fieldsToClear.forEach(field => {
            document.getElementById(field).value = '';
        });
        jsonToReset.forEach(element => {
            nu[element] = '';
        });
        setNewUser(nu);
        setValidateFields([]);
    }

    return (
        <div className='pubPage'>
            <div className='navBar'>
                <NavBar/>
                {/* <br/>{JSON.stringify(newUser)}<br/> */}
                {/* <br/>{JSON.stringify(inputs)} */}
                {/* <br/>{validateFields.toString()}<br/> */}
                {/* <br/>{fNameErr.toString()}<br/> */}
            </div>
            <div className={loader}>
                <div className='spinner'/>
                <span>logging you in...</span>
            </div>
            <div className={loginInputs}>
                <table>
                    <tr>
                        <td>User Name</td>
                        <td><input id='userName' type='text' name='userName' onKeyDown={(e)=>{catchEnter(e)}} onChange={(e)=>{handleChange(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input id='password' type='password' name='password' onKeyDown={(e)=>{catchEnter(e)}} onChange={(e)=>{handleChange(e)}}/><br/></td>
                    </tr>
                    <tr>
                        <td/>
                        <td><button onClick={()=>checkPassword()}>Submit</button><br/></td>
                    </tr>
                    <tr>
                        <td/>
                        <td>Don't have an account?</td>
                    </tr>
                    <tr>
                        <td/>
                        <td><Link to='' onClick={()=>{setViewDiv('createAccount'); clearInputFields();}}>Click here</Link></td>
                    </tr>
                </table>
            </div>
            <div className={createAccount}>
                <table>
                    <tr>
                        <td>User Name</td>
                        <td><input id='newUserName' type='text' name='userName'onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr className={alertDuplicateUserName}>
                        <td/>
                        <td className='max200 validationText'>
                            This User Name is taken
                        </td>
                    </tr>
                    <tr className={userNameErr}>
                        <td/>
                        <td className='max200 validationText'>
                            User Name must be at least 5 characters with no spaces
                        </td>
                    </tr>
                    {/* <tr>
                        <td/>
                        <td className='validationText'></td>
                    </tr> */}
                    <tr>
                        <td>Password</td>
                        <td><input id='newPassword1' type='password' name='newPassword1' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr className={newPassword1Err}>
                        <td/>
                        <td className='max200 validationText'>
                            Password must be at least 8 characters with no spaces
                        </td>
                    </tr>
                    <tr>
                        <td>Re-enter password</td>
                        <td><input id='newPassword2' type='password' name='newPassword2' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr className={newPassword2Err}>
                        <td/>
                        <td className='max200 validationText'>
                            Passwords do not match
                        </td>
                    </tr>
                    <tr>
                        <td>First name</td>
                        <td><input id='newFName' type='text' name='fName' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr className={fNameErr}>
                        <td/>
                        <td className='max200 validationText'>
                            First Name must be at least 2 characters with no spaces
                        </td>
                    </tr>
                    <tr>
                        <td>Last name</td>
                        <td><input id='newLName' type='text' name='lName' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr className={lNameErr}>
                        <td/>
                        <td className='max200 validationText'>
                            Last Name must be at least 2 characters with no spaces
                        </td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input id='newEmail' type='text' name='email' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/><br/></td>
                    </tr>
                    <tr className={emailErr}>
                        <td/>
                        <td className='max200 validationText'>
                            Email address must be formatted properly
                        </td>
                    </tr>
                    <tr>
                        <td>Birth Date</td>
                        <td>
                            <select id='birthMonth' name='birthMonth' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}>
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
                            <select id='birthDay' name='birthDay' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}>
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
                        <td><input id='birthYear' name='birthYear' onBlur={(e)=>{revalidateBirthYear()}} onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr className={birthYearErr}>
                        <td/>
                        <td className='max200 validationText'>
                            {birthYearErrMsg}
                        </td>
                    </tr>
                    <tr>
                        <td>Address1</td>
                        <td><input id='newAddress1' name='address1' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr className={address1Err}>
                        <td/>
                        <td className='max200 validationText'>
                            Address must be at least 6 characters
                        </td>
                    </tr>
                    <tr>
                        <td>Address2</td>
                        <td><input id='newAddress2' name='address2' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr>
                        <td>City</td>
                        <td><input id='newCity' name='city' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr className={cityErr}>
                        <td/>
                        <td className='max200 validationText'>
                            City must be at least 2 characters
                        </td>
                    </tr>
                    <tr>
                        <td>State</td>
                        {/* <td><input id='newState' name='state' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td> */}
                        <td>
                            <input list='stateList' id='newState' name='state' onBlur={()=>{revalidateState()}} onChange={(e)=>{updateNewUser(e)}}/>
                            <datalist id='stateList'>
                                <option value = 'NM'/>
                                <option value = 'AK'/>
                                <option value = 'AL'/>
                                <option value = 'AR'/>
                                <option value = 'AZ'/>
                                <option value = 'CA'/>
                                <option value = 'CO'/>
                                <option value = 'CT'/>
                                <option value = 'DE'/>
                                <option value = 'FL'/>
                                <option value = 'GA'/>
                                <option value = 'HI'/>
                                <option value = 'IA'/>
                                <option value = 'ID'/>
                                <option value = 'IL'/>
                                <option value = 'IN'/>
                                <option value = 'KS'/>
                                <option value = 'KY'/>
                                <option value = 'LA'/>
                                <option value = 'MA'/>
                                <option value = 'MD'/>
                                <option value = 'ME'/>
                                <option value = 'MI'/>
                                <option value = 'MN'/>
                                <option value = 'MO'/>
                                <option value = 'MS'/>
                                <option value = 'MT'/>
                                <option value = 'NC'/>
                                <option value = 'ND'/>
                                <option value = 'NE'/>
                                <option value = 'NH'/>
                                <option value = 'NJ'/>
                                <option value = 'NM'/>
                                <option value = 'NV'/>
                                <option value = 'NY'/>
                                <option value = 'OH'/>
                                <option value = 'OK'/>
                                <option value = 'OR'/>
                                <option value = 'PA'/>
                                <option value = 'RI'/>
                                <option value = 'SC'/>
                                <option value = 'SD'/>
                                <option value = 'TN'/>
                                <option value = 'TX'/>
                                <option value = 'UT'/>
                                <option value = 'VA'/>
                                <option value = 'VT'/>
                                <option value = 'WA'/>
                                <option value = 'WI'/>
                                <option value = 'WV'/>
                                <option value = 'WY'/>
                            </datalist>
                        </td>
                    </tr>
                    <tr className={stateErr}>
                        <td/>
                        <td className='max200 validationText'>
                            State must be a valid 2 character abbreviation
                        </td>
                    </tr>
                    <tr>
                        <td>Zip</td>
                        <td><input id='newZip' name='zip' onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr className={zipErr}>
                        <td/>
                        <td className='max200 validationText'>
                            Zip must be 5 consecutive numbers
                        </td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td><input id='newPhone' name='phone' onKeyDown={(e)=>catchDelete(e)} onBlur={(e)=>{updateValidateFields(e)}} onChange={(e)=>{updateNewUser(e)}}/></td>
                    </tr>
                    <tr className={phoneErr}>
                        <td/>
                        <td className='max200 validationText'>
                            Phone must follow ###-###-#### format
                        </td>
                    </tr>
                    <tr>
                        <td className={okToSubmit}><button onClick={()=>addNewUser()}>Submit</button></td>
                    </tr>
                    <tr>
                        <td/>
                    </tr>
                    <tr>
                        <td>Have an account?<br/><Link to='' onClick={()=>{setViewDiv('login'); clearInputFields();}}>Click here</Link></td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

export default Login;
