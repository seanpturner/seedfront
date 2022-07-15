import React, { useEffect } from 'react';
import NavBar from '../common/NavBar';

function LoginSuccess() {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace('./home');
        }, 3000);
    }, [])
  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='loginResult'>
            <h3>You've successfully logged in.</h3><br/>
            <h3>You will be redirected to the home page in a moment.</h3>
        </div>
    </div>
  )
}

export default LoginSuccess