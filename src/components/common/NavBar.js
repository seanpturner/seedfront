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
    const [messageCount, setMessageCount] = useState(null);
    const showMessageCount = messageCount ? 'showMessageCount' : 'hidden';
    const checkLoggedIn = () => {
        let un = localStorage.getItem('userName');
        setUserName(un);
    }

    const checkOpenCart = () => {
        let openCart = JSON.parse(sessionStorage.getItem('userOrder'));
        if (openCart && openCart.length > 0) {
            setHasOpenCart(true);
        }else{
            setHasOpenCart(false);
        }
    }

    const logUserOut = () => {
        sessionStorage.clear();
        localStorage.clear();
        setUserName('');
    }

    useEffect(()=> {
        if (userName) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
              
            fetch('http://www.boutiqueseedsnm.com/backend/messages/count/' + userName, requestOptions)
                .then(response => response.text())
                .then(result => setMessageCount(result))
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
            }else{
                setMessageCount(null);
            }
    }, [userName])

    useEffect(() => {
        checkLoggedIn();
        checkOpenCart()
    }, [hasOpenCart, userName])
    return (
        <div className='nav'>
            <div className='greenBar'>
                <span className='liu'>{userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : ''}</span>
                <span className='questions'><Link to='/faq' className='whiteLink'>Have questions? - FAQ's</Link></span>
            </div>
            <div className='logoLinks'>
                <div className='navLogoDiv'>
                    <Link to='/home'>
                        <img className='navLogo' src={Logo} alt='Logo'/>
                    </Link>
                </div>
                <div className='navLinksWrapper'>
                    <div className='navLinksDivLandscape'>
                        <div className='linkDivLandscape'><Link className='navLink' to='/home'>HOME</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/about'>ABOUT</Link></div>
                        <div className={logOutL}><Link className='navLink' to='/messaging'>MESSAGES <span className={showMessageCount}>{'(' + messageCount + ')'}</span></Link></div>
                        <div  className={logInL}><Link className='navLink' to='/contact'>CONTACT</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/findseeds'>SEEDS</Link></div>
                        <div className={logInL}><Link className='navLink' to='/login'>LOG IN</Link></div>
                        <div className={logOutL}><Link className='navLink' to='/login' onClick={()=>logUserOut()}>LOG OUT</Link></div>
                        <div className='linkDivLandscape openCart'><Link className='navLink' to='/shoppingcart'>MY CART</Link></div>
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
                                <span className={logInP + ' portraitLinks'}><Link className='navLink' to='/contact'>CONTACT</Link></span>
                                <span className={logOutP + ' portraitLinks'}><Link className='navLink' to='/messaging'>MESSAGES {'(' + messageCount + ')'}</Link></span><br/>
                                <span className='portraitLinks'><Link className='navLink' to='/findseeds'>SEEDS</Link></span>
                                <span className={logInP}><Link className='navLink' to='/login'>LOG IN</Link></span>
                                <span className={logOutP}><Link className='navLink' to='/login' onClick={()=>logUserOut()}>LOG OUT</Link></span><br/>
                                <span className='portraitLinks openCart'><Link className='navLink' to='/shoppingcart'>MY CART</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar