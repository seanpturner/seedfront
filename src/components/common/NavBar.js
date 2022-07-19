import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Logo from '../photos/Logo.png';

function NavBar() {
    

    const [userName, setUserName] = useState('');
    const logInL = userName ? 'hidden' : ' linkDivLandscape logIn';
    const logOutL = userName ? 'linkDivLandscape logOut' : 'hidden';
    const logInP = userName ? 'hidden' : ' portraitLinks logIn';
    const logOutP = userName ? 'portraitLinks logOut' : 'hidden';
    const [menu, setMenu] = useState(false);
    const showMenu = menu ? 'showMenu' : 'hidden';
    const [hasOpenCart, setHasOpenCart] = useState(false);
    const openCartL = hasOpenCart ? 'linkDivLandscape openCart' : 'hidden';
    const openCartP = hasOpenCart ? 'portraitLinks openCart' : 'hidden';
    const checkLoggedIn = () => {
        let un = sessionStorage.getItem('userName');
        if (un) {
            un = 'user: ' + un;
        }
        setUserName(un);
    }

    const checkOpenCart = () => {
        let openCart = JSON.parse(localStorage.getItem('userOrder'));
        if (openCart && openCart.length > 0) {
            setHasOpenCart(true);
        }else{
            setHasOpenCart(false);
        }
    }

    const logUserOut = () => {
        sessionStorage.clear();
        setUserName('');
    }

    useEffect(() => {
        checkLoggedIn();
        checkOpenCart()
    }, [])
    return (
        <div className='nav'>
            <div className='greenBar'>
                <span className='liu'>{userName}</span>
                <span className='questions'><Link to='/faq' className='whiteLink'>Have questions?</Link></span>
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
                        <div className={logInL}><Link className='navLink' to='/login'>LOG IN</Link></div>
                        <div className={logOutL}><Link className='navLink' to='/login' onClick={()=>logUserOut()}>LOG OUT</Link></div>
                        <div className={openCartL}><Link className='navLink' to='/shoppingcart'>MY CART</Link></div>
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
                                <span className='portraitLinks'><Link className='navLink' to='/contact'>CONTACT</Link></span>
                                <span className='portraitLinks'><Link className='navLink' to='/findseeds'>SEEDS</Link></span><br/>
                                <span className={logInP}><Link className='navLink' to='/login'>LOG IN</Link></span>
                                <span className={logOutP}><Link className='navLink' to='/login' onClick={()=>logUserOut()}>LOG OUT</Link></span>
                                <span className={openCartP}><Link className='navLink' to='/shoppingcart'>MY CART</Link></span>
                            </div>
                        </div>

                    </div>

                </div>
                
            </div>
        </div>
    )
}

export default NavBar