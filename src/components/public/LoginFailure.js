import React, { useEffect } from 'react';
import NavBar from '../common/NavBar';

function LoginFailure() {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace('./login');
        }, 3000);
    }, [])
  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='loginResult'>
            <h3>Unbable to log you in with the credentials you supplied.</h3><br/>
            <h3>You will be redirected back to the login page in a moment.</h3>
        </div>
    </div>
  )
}

export default LoginFailure