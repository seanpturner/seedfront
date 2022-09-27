import React, { useEffect, useState } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";
import axios from 'axios';


function Profile() {
    // const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [showInputs, setShowInputs] = useState(false);
    const [verified, setVerified] = useState(false);
    const [userName, setUserName] = useState(null);
    const [enteredPassword, setEnteredPassword] = useState(null);
    const userReceived = user.userName && user.userName !== undefined ? true : false;
    const [updatedInfo, setUpdatedInfo] = useState(false);
    const [validateFields, setValidateFields] = useState([]);
    const [helpText, setHelpText] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [errorsShowing, setErrorsShowing] = useState(false);
    const showSubmit = updatedInfo && !errorsShowing ? 'showSubmit centerText' : 'hidden';
    const [updatePassword, setUpdatePassword] = useState(false);
    const updateInfo = updatePassword ? 'hidden' : 'updateInfo';
    const updatePW = updatePassword ? 'updatePW' : 'hidden';
    const [newPassword, setNewPassword] = useState(null);
    const [confirmNewPassword, setConfirmNewPassword] = useState(null);
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
    const showNewPasswordError = newPasswordError === '' ? 'hidden' : 'showNewPasswordError validationText';
    const showConfirmNewPasswordError = confirmNewPasswordError === '' ? 'hidden' :  'showConfirmNewPasswordError validationText';
    const newPasswordSubmit = newPassword && confirmNewPassword && confirmNewPassword === newPassword && newPassword.length >= 8 && newPasswordError === '' ? 'newPasswordSubmit' : 'hidden';
    const [IP, setIP] = useState('');
    const [state, setState] = useState('');
    const page = 'Profile';
    const [trackerSent, setTrackerSent] = useState(false);
    const dataTracker = {
        ip: IP,
        state: state,
        page: page,
        userName: userName
    }

    const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/');
        setIP(res.data.IPv4);
        setState(res.data.state);
    }

    const getAllUsers = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("http://localhost:8080/users", requestOptions)
            .then(response => response.json())
            .then(result => createUserList(result))
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const createUserList = (users) => {
        let userList = [];
        users.forEach(user => {
           userList.push(user.userName.toLowerCase()); 
        });
        setAllUsers(userList);
    }

    const checkLoggedIn = () => {
        let un = localStorage.getItem('userName');
        setUserName(un);
        // if (un && un !== undefined && un !== '') {
            // setLoggedIn(true);
            // getUser(un);
        // }
    }

    const compareUser = () => {
        if (verified) {
            let difference = false;
            let vFields = [];
            let userKeys = Object.keys(user);
            userKeys.forEach(key => {
                if (user[key] !== updatedUser[key]) {
                    difference = true;
                    vFields.push(key);
                }
            });
            setUpdatedInfo(difference);
            setValidateFields(vFields);
        }
    }

    const getUser = () => {
        let md5 = require('md5');
        let hp = md5(enteredPassword);
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch('http://localhost:8080/users/user/' + userName, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (hp === result.password) {
                    setUser(result);
                    setUpdatedUser(JSON.parse(JSON.stringify(result)));
                    setVerified(true);
                    getAllUsers();
                }
                else{
                    logUserOut();
                }
            })
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const logUserOut = () => {
        sessionStorage.clear();
        localStorage.clear();
        setUserName('');
        window.location.replace('/login');
    }

    const resetInfo = (e) => {
        e.preventDefault();
        setUpdatedUser(JSON.parse(JSON.stringify(user)));
        let resetArray = ['userName', 'fName', 'lName', 'email', 'address1', 'address2', 'city', 'state', 'zip', 'phone'];
        resetArray.forEach(id => {
            document.getElementById(id).value = user[id];
        });
        setUpdatedInfo(false);
        setValidateFields([]);
        setHelpText([]);
    }

    const updateUser = (e) => {
        if (e.target.id === 'zip') {
            if (e.target.value.length > 0 && e.target.value.length <= 5) {
                if (isNaN(e.target.value)) {
                    e.target.value = updatedUser.zip;
                }
            }
            if (e.target.value.length > 5) {
                e.target.value = updatedUser.zip;
            }
            if (e.target.value.includes(' ') || e.target.value.includes('.')) {
                e.target.value = updatedUser.zip;
            }
        }
        if (e.target.id === 'phone') {
            if (e.target.value.length > 0) {
                if (e.target.value.length <= 3) {
                    if (isNaN(e.target.value)) {
                        e.target.value = updatedUser.phone;
                    }
                }
                if (e.target.value.length === 4) {
                    if (e.target.value[3] !== '-') {
                        if (isNaN(e.target.value[3])) {
                            e.target.value = updatedUser.phone;
                        }else{
                            e.target.value = e.target.value.substring(0,3) + '-' + e.target.value[3];
                        }
                        
                    }
                }
                if (e.target.value.length > 5 && e.target.value.length <= 7) {
                    for (let i = 5; i < e.target.value.length; i++) {
                        if (isNaN(e.target.value[i])) {
                            e.target.value = updatedUser.phone;
                        }
                    }
                }
                if (e.target.value.length === 8) {
                    if (e.target.value[7] !== '-') {
                        e.target.value = e.target.value.substring(0,7) + '-' + e.target.value[7];
                    }
                }
                if (e.target.value.length > 8 && e.target.value.length <= 12) {
                    for (let i = 8; i < e.target.value.length; i++) {
                        if (isNaN(e.target.value[i])) {
                            e.target.value = updatedUser.phone;
                        }
                    }
                }
                if (e.target.value.length > 12) {
                    e.target.value = updatedUser.phone;
                }
            }
        }
        let updated = updatedUser;
        updated[e.target.id] = e.target.value;
        setUpdatedUser(updated);
        compareUser();
    }

    const validate = () => {
        setErrorsShowing(false);
        if (verified && user && updatedUser && validateFields.length > 0) {
            let errors = {
                userName: null,
                fName: null,
                lName: null,
                email: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null
            }
            if (updatedUser.userName.includes(' ')) {
                errors.userName = 'No spaces allowed in username';
                setErrorsShowing(true);
            }
            if (!updatedUser.userName || updatedUser.userName.length < 5) {
                errors.userName = 'Username requires a minumum of 5 characters';
                setErrorsShowing(true);
            }
            if (allUsers.includes(updatedUser.userName.toLowerCase()) && updatedUser.userName.toLowerCase() !== userName.toLowerCase()) {
                errors.userName = 'This username is unavailable';
                setErrorsShowing(true);
            }
            if (!updatedUser.fName || updatedUser.fName.length < 2) {
                errors.fName = 'First name requires a minumum of 2 characters';
                setErrorsShowing(true);
            }
            if (!updatedUser.lName || updatedUser.lName.length < 2) {
                errors.lName = 'Last name requires a minumum of 2 characters';
                setErrorsShowing(true);
            }
            if (updatedUser.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedUser.email)) {
                errors.email = 'Email must be formatted correctly';
                setErrorsShowing(true);
            }
            if (!updatedUser.email) {
                errors.email = 'Email is required';
                setErrorsShowing(true);
            }
            if (!updatedUser.address1 || updatedUser.address1.length < 6) {
                errors.address1 = 'Address 1 requires a minumum of 6 characters';
                setErrorsShowing(true);
            }
            if (!updatedUser.city || updatedUser.city.length < 2) {
                errors.city = 'City requires a minumum of 2 characters';
                setErrorsShowing(true);
            }
            if (!/^((A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY]))$/.test(updatedUser.state.toUpperCase())) {
                errors.state = 'Please use an appropriate 2-digit state code';
                setErrorsShowing(true);
            }
            if (updatedUser.state) {
                updatedUser.state = updatedUser.state.toUpperCase();
                document.getElementById('state').value = updatedUser.state.toUpperCase();
            }
            if (!updatedUser.zip || updatedUser.zip.length < 5) {
                errors.zip = 'Zip code is required';
                setErrorsShowing(true);
            }
            if (!updatedUser.phone || updatedUser.phone.length < 12) {
                errors.phone = 'Phone number is required';
                setErrorsShowing(true);
            }
            setHelpText(errors);
        }
    }

    const updateUserInfo = () => {
        // if (!errorsShowing && verified && updatedInfo) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(updatedUser);
        // var raw = updatedUser;
        // alert(raw)

        let requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch('http://localhost:8080/users/updateUser/' + updatedUser.id, requestOptions)
            .then(response => response.json())
            .then(alert('updated'))
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));
        // }
    }

    const handleNewPassword = (e) => {
        setConfirmNewPasswordError('');
        let currentPW = user.password;
        let md5 = require('md5');
        if (e.target.id === 'newPassword') {
            let newPW = md5(e.target.value);
            setNewPassword(e.target.value);
            if(e.target.value.length < 8) {
                setNewPasswordError('Password must be at least 8 characters');
            }
            else if (newPW === currentPW) {
                setNewPasswordError('New password cannot match old password');
            }
            else{
                setNewPasswordError('');
            }
        }
        if (e.target.id === 'confirmNewPassword') {
            setConfirmNewPassword(e.target.value);
            if (e.target.value !== newPassword && newPasswordError === '') {
                setConfirmNewPasswordError('Passwords do not match');
            }
        }
        

    }

    useEffect(()=> {
        if (dataTracker.ip && dataTracker.state && !trackerSent) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            let raw = JSON.stringify(dataTracker);
            
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
            fetch("http://localhost:8080/tracking", requestOptions)
                .then(response => response.text())
                .then(setTrackerSent(true))
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }, [dataTracker])

    useEffect(()=> {
        checkLoggedIn();
        getData();
    }, [])

    useEffect(()=> {
        validate();
    }, [validateFields])

  return (
    <div className='pubPage noHorizontalScroll'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='pubContent'>
            {/* <p>{JSON.stringify(allUsers)}</p> */}
            {/* <p>{duplicateUserName.toString()}</p> */}
            {/* <p>{JSON.stringify(user)}</p> */}
            {/* <p>{'user Received: ' + userReceived.toString()}</p> */}
            {/* <p>{'User Name: ' + userName}</p> */}
            {/* <p>{enteredPassword}</p> */}
            {/* <p>{updatedInfo.toString()}</p> */}
            {/* <p>{validateFields.toString()}</p> */}
            {/* <p>{JSON.stringify(helpText)}</p> */}
            {/* <p>{JSON.stringify(IP)}</p> */}
            {verified ? 
                <div className='topCenteredDiv'>
                    {userReceived ? 
                        <p>
                            <div className={updateInfo}>
                                <table>
                                    <tr>
                                        <td>Username</td>
                                        {!showInputs ? <td>{user.userName}</td> : ''}
                                        {showInputs ? <td><input id='userName' type='text' defaultValue={user.userName} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('userName') &&  helpText.userName ? helpText.userName : null}</td>
                                    </tr>
                                    <tr>
                                        
                                    </tr>
                                    <tr>
                                        <td>First name</td>
                                        {!showInputs ? <td>{user.fName}</td> : ''}
                                        {showInputs ? <td><input id='fName' type='text' defaultValue={user.fName} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('fName') &&  helpText.fName ? helpText.fName : null}</td>
                                    </tr>
                                    <tr>
                                        <td>Last name</td>
                                        {!showInputs ? <td>{user.lName}</td> : ''}
                                        {showInputs ? <td><input id='lName' type='text' defaultValue={user.lName} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('lName') &&  helpText.lName ? helpText.lName : null}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        {!showInputs ? <td>{user.email}</td> : ''}
                                        {showInputs ? <td><input id='email' type='text' defaultValue={user.email} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('email') &&  helpText.email ? helpText.email : null}</td>
                                    </tr>
                                    <tr>
                                        <td>Address 1</td>
                                        {!showInputs ? <td>{user.address1}</td> : ''}
                                        {showInputs ? <td><input id='address1' type='text' defaultValue={user.address1} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('address1') &&  helpText.address1 ? helpText.address1 : null}</td>
                                    </tr>
                                        <tr>
                                            <td>Address2</td>
                                            {!showInputs ? <td>{user.address2}</td> : ''}
                                            {showInputs ? <td><input id='address2' type='text' defaultValue={user.address2} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        </tr>
                                    <tr>
                                        <td>City</td>
                                        {!showInputs ? <td>{user.city}</td> : ''}
                                        {showInputs ? <td><input id='city' type='text' defaultValue={user.city} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('city') &&  helpText.city ? helpText.city : null}</td>
                                    </tr>
                                    <tr>
                                        <td>State</td>
                                        {!showInputs ? <td>{user.state}</td> : ''}
                                        {showInputs ? <td><input id='state' type='text' defaultValue={user.state} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('state') &&  helpText.state ? helpText.state : null}</td>
                                    </tr>
                                    <tr>
                                        <td>Zip</td>
                                        {!showInputs ? <td>{user.zip}</td> : ''}
                                        {showInputs ? <td><input id='zip' type='text' defaultValue={user.zip} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('zip') &&  helpText.zip ? helpText.zip : null}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        {!showInputs ? <td>{user.phone}</td> : ''}
                                        {showInputs ? <td><input id='phone' type='text' defaultValue={user.phone} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                        <td className='validationText'>{validateFields.includes('phone') &&  helpText.phone ? helpText.phone : null}</td>
                                    </tr>
                                </table>
                                {!showInputs ? <div className='centerText'><Link to='' onClick={()=>setShowInputs(true)}>Update this information</Link></div> : ''}
                                {!showInputs ? <div className='centerText'><Link to='' onClick={()=>{setUpdatePassword(true)}}>Change my password</Link></div> : ''}
                                {showInputs && updatedInfo ? <div className='centerText'><Link to='' onClick={(e)=>resetInfo(e)}>Reset this information</Link></div> : ''}
                                <div className={showSubmit}><Link to='' onClick={()=>{updateUserInfo()}} className={showSubmit}>Submit</Link></div>
                            </div>
                            <div className={updatePW}>
                                <table>
                                    <tr>
                                        <td>New password</td>
                                        <td><input id='newPassword' type='password' onChange={(e)=>{handleNewPassword(e)}}/></td>
                                        <td className={showNewPasswordError}>{newPasswordError}</td>
                                    </tr>
                                    <tr>
                                        <td>Confirm new password</td>
                                        <td><input id='confirmNewPassword' type='password' onBlur={(e)=>{handleNewPassword(e)}}/></td>
                                        <td className={showConfirmNewPasswordError}>{confirmNewPasswordError}</td>
                                    </tr>
                                </table>
                                <div className='centerText'>
                                    <Link to='' onClick={()=>{
                                        setUpdatePassword(false);
                                        setNewPassword(null);
                                        setConfirmNewPassword(null);
                                        setNewPasswordError('');
                                        setConfirmNewPasswordError('');
                                        document.getElementById('newPassword').value = '';
                                        document.getElementById('confirmNewPassword').value = '';
                                        }}>Cancel</Link>
                                        {' '}
                                <Link to='' className={newPasswordSubmit}>Submit</Link>
                                </div>
                            </div>
                        </p>
                        :
                        <div className='notLoggedIn'>
                            We had difficulty receiving your information. Try refreshing this page or log in.
                        </div>
                    }
                </div>
                : 
                <div className='topCenteredDiv'>
                    <p>
                        <table>
                            <tr>
                                <td>Enter your password</td>
                                <td><input type='password' onChange={(e)=>{setEnteredPassword(e.target.value)}}/></td>
                            </tr>
                        </table>
                    <div className='centerText'><Link to='' onClick={()=>{getUser()}}>Submit</Link></div>
                    </p>
                </div>
                }
        </div>
    </div>
  )
}

export default Profile