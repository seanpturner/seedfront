import React, { useState } from 'react';
import NavBar from '../common/NavBar';

function Login() {

    const [inputs, setInputs] = useState({
        userName: null,
        password: null
    });
    // useEffect(() => {
        // sessionStorage.clear();
        // clearFields();
        // alert('loaded');
    // }, [])
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
        // document.getElementById('userName').value = '';
        // document.getElementById('password').value = '';
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
            redirect: 'follow'
        };
          
        fetch(baseUrl + inputs.userName + '/' + inputs.password, requestOptions)
            .then(response => response.text())
            .then(response => {
                sessionStorage.setItem('bearerToken', response)
                sessionStorage.setItem('userName', inputs.userName);
        })
        .then(() => clearFields()) 
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const clearFields = () => {
        document.getElementById('userName').value = '';
        document.getElementById('password').value = '';
    }
    
    const timeOutLogIn = (n) => {
        let tokenCheck = sessionStorage.getItem('bearerToken');
        if (n > 0) {
            if (tokenCheck === 'invalid') {
                sessionStorage.clear();
                alert('bad username or password');
            }
            if (tokenCheck === '' || tokenCheck === null) {
                console.log(n);
                n--
                setTimeout(() => {
                    timeOutLogIn(n);
                }, 100);
            }
        }
        else{
            alert('unable to log you in');
            sessionStorage.clear();
        }    
    }

    return (
        <div className='pubPage'>
            <div className='navBar'>
                <NavBar/>
            </div>
            <div className='loginInputs'>
                <input id='userName' type='text' name='userName' onChange={(e)=>{handleChange(e)}}/><br/>
            <input id='password' type='password' name='password' onChange={(e)=>{handleChange(e)}}/><br/>
            <button onClick={()=>checkPassword()}>Submit</button>
            </div>
            
        </div>
    );
}

export default Login;