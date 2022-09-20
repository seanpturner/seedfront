import React, { useEffect, useState } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function Profile() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [showInputs, setShowInputs] = useState(false);
    const [verified, setVerified] = useState(false);
    const [userName, setUserName] = useState(null);
    const [enteredPassword, setEnteredPassword] = useState(null);
    const userReceived = user.userName && user.userName !== undefined ? true : false;
    const [updatedInfo, setUpdatedInfo] = useState(false);
    const checkLoggedIn = () => {
        let un = localStorage.getItem('userName');
        setUserName(un);
        if (un && un !== undefined && un !== '') {
            // setLoggedIn(true);
            // getUser(un);
        }
    }

    const compareUser = () => {
        if (verified) {
           if (
            updatedUser.userName === user.userName
            && updatedUser.userName === user.userName
            && updatedUser.fName === user.fName
            && updatedUser.lName === user.lName
            && updatedUser.email === user.email
            && updatedUser.address1 === user.address1
            && updatedUser.address2 === user.address2
            && updatedUser.city === user.city
            && updatedUser.state === user.state
            && updatedUser.zip === user.zip
            ) {
                setUpdatedInfo(false);
            }else{
                setUpdatedInfo(true);
            } 
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
                    setUpdatedUser(result);
                    setVerified(true);
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
        setUpdatedUser(user);
        let resetArray = ['userName', 'fName', 'lName', 'email', 'address1', 'address2', 'city', 'state', 'zip', 'phone'];
        resetArray.forEach(id => {
            document.getElementById(id).value = user[id];
        });
    }

    const updateUser = (e) => {
        let updated = updatedUser;
        updated[e.target.id] = e.target.value;
        setUpdatedUser(updated);
        // alert(JSON.stringify(updatedUser))
    }

    useEffect(()=> {
        checkLoggedIn();
    }, [])

    useEffect(()=> {
        compareUser();
    },[updatedUser])
  return (
    <div className='pubPage noHorizontalScroll'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='pubContent'>
            {/* <p>{JSON.stringify(updatedUser)}</p> */}
            {/* <p>{'user Received: ' + userReceived.toString()}</p> */}
            {/* <p>{'User Name: ' + userName}</p> */}
            {/* <p>{enteredPassword}</p> */}
            <p>{updatedInfo.toString()}</p>
            {verified ? 
                <div className='topCenteredDiv'>
                    {userReceived ? 
                        <p>
                            <div className='updateInfo'>
                                <table>
                                    <tr>
                                        <td>Username</td>
                                        {!showInputs ? <td>{user.userName}</td> : ''}
                                        {showInputs ? <td><input id='userName' type='text' defaultValue={user.userName} onChange={(e)=>{updateUser(e)}}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>First name</td>
                                        {!showInputs ? <td>{user.fName}</td> : ''}
                                        {showInputs ? <td><input id='fName' type='text' defaultValue={user.fName}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>Last name</td>
                                        {!showInputs ? <td>{user.lName}</td> : ''}
                                        {showInputs ? <td><input id='lName' type='text' defaultValue={user.lName}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        {!showInputs ? <td>{user.email}</td> : ''}
                                        {showInputs ? <td><input id='email' type='text' defaultValue={user.email}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>Address 1</td>
                                        {!showInputs ? <td>{user.address1}</td> : ''}
                                        {showInputs ? <td><input id='address1' type='text' defaultValue={user.address1}/></td> : ''}
                                    </tr>
                                        <tr>
                                            <td>Address2</td>
                                            {!showInputs ? <td>{user.address2}</td> : ''}
                                            {showInputs ? <td><input id='address2' type='text' defaultValue={user.address2}/></td> : ''}
                                        </tr>
                                    <tr>
                                        <td>City</td>
                                        {!showInputs ? <td>{user.city}</td> : ''}
                                        {showInputs ? <td><input id='city' type='text' defaultValue={user.city}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>State</td>
                                        {!showInputs ? <td>{user.state}</td> : ''}
                                        {showInputs ? <td><input id='state' type='text' defaultValue={user.state}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>Zip</td>
                                        {!showInputs ? <td>{user.zip}</td> : ''}
                                        {showInputs ? <td><input id='zip' type='text' defaultValue={user.zip}/></td> : ''}
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        {!showInputs ? <td>{user.phone}</td> : ''}
                                        {showInputs ? <td><input id='phone' type='text' defaultValue={user.phone}/></td> : ''}
                                    </tr>
                                </table>
                                {!showInputs ? <div className='centerText'><Link to='' onClick={()=>setShowInputs(true)}>Update this information</Link></div> : ''}
                                {showInputs ? <div className='centerText'><Link to='' onClick={(e)=>resetInfo(e)}>Reset this information</Link></div> : ''}
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