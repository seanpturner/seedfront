import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Logo from '../photos/Logo.png';

function NavBar() {
    

    const [userName, setUserName] = useState('');
    const logIn = userName ? 'hidden' : ' linkDivLandscape logIn';
    const logOut = userName ? 'linkDivLandscape logOut' : 'hidden';
    const [menu, setMenu] = useState(false);
    const showMenu = menu ? 'showMenu' : 'hidden';
    const checkLoggedIn = () => {
        let un = sessionStorage.getItem('userName');
        if (un) {
            un = 'user: ' + un;
        }
        setUserName(un);
    }

    const logUserOut = () => {
        sessionStorage.clear();
        setUserName('');
    }

    useEffect(() => {
        checkLoggedIn();
    }, [])
    return (
        <div className='nav'>
            <div className='greenBar'>
                <span className='liu'>{userName}</span>
                <span className='questions'>Have questions?</span>
            </div>
            <div className='logoLinks'>
                <div className='navLogoDiv'>
                    <img className='navLogo' src={Logo} alt='Logo'/>
                </div>
                <div className='navLinksWrapper'>
                    <div className='navLinksDivLandscape'>
                        <div className='linkDivLandscape'><Link className='navLink' to='/home'>HOME</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/about'>ABOUT</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/contact'>CONTACT</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/findseeds'>SEEDS</Link></div>
                        <div className={logIn}><Link className='navLink' to='/login'>LOG IN</Link></div>
                        <div className={logOut}><Link className='navLink' to='/login' onClick={()=>logUserOut()}>LOG OUT</Link></div>
                    </div>
                    <div className='navLinksDivPortrait'>
                        <div className='cheeseburger'>
                            <Link to='' onClick={()=>setMenu(!menu)}>
                                <div className='tb'/>
                                <div className='mid'/>
                                <div className='tb'/>
                            </Link>
                            <div className={showMenu}>
                                <span className='portraitLinks'><Link className='navLink' to='/home'>HOME</Link></span>
                                <span className='portraitLinks'><Link className='navLink' to='/about'>ABOUT</Link></span><br/>
                                <span className='portraitLinks'><Link className='navLink' to='/contact'>CONTACT</Link></span><br/>
                                <span className='portraitLinks'><Link className='navLink' to='/findseeds'>SEEDS</Link></span>
                                <span className='portraitLinks'><Link className='navLink' to='/login'>LOG IN</Link></span>
                            </div>
                        </div>

                    </div>

                </div>
                
            </div>
        </div>
    )
}

export default NavBar