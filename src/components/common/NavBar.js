import React from 'react';
import { Link } from "react-router-dom";
import Logo from '../photos/Logo.png';

function NavBar() {
  return (
    <div className='nav'>
        <div className='greenBar'>
            <span className='questions'>Have questions?</span>
        </div>
        <div className='logoLinks'>
            <div className='navLogoDiv'>
                <img className='navLogo' src={Logo} alt='Logo'/>
            </div>
            <div className='navLinksWrapper'>
                <div className='navLinksDiv'>
                <div className='linkDiv'><Link className='navLink' to='/home'>HOME</Link></div>
                <div className='linkDiv'><Link className='navLink' to='/about'>ABOUT</Link></div>
                <div className='linkDiv'><Link className='navLink' to='/contact'>CONTACT</Link></div>
                <div className='linkDiv'><Link className='navLink' to='/findseeds'>SEEDS</Link></div>
                <div className='linkDiv'><Link className='navLink' to='/login'>LOG IN</Link></div>
            </div>
            </div>
            
        </div>
    </div>
  )
}

export default NavBar