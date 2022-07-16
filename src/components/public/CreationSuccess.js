import React, { useEffect } from 'react';
import NavBar from '../common/NavBar';

function CreationSuccess() {
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
            <h3>You've successfully created an account.</h3><br/>
            <h3>You will be redirected to log in shortly.</h3>
        </div>
    </div>
  )
}

export default CreationSuccess