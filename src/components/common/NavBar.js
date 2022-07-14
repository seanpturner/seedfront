import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Logo from '../photos/Logo.png';

function NavBar() {
    const [menu, setMenu] = useState(false);
    const showMenu = menu ? 'showMenu' : 'hidden';
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
                    <div className='navLinksDivLandscape'>
                        <div className='linkDivLandscape'><Link className='navLink' to='/home'>HOME</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/about'>ABOUT</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/contact'>CONTACT</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/findseeds'>SEEDS</Link></div>
                        <div className='linkDivLandscape'><Link className='navLink' to='/login'>LOG IN</Link></div>
                    </div>
                    <div className='navLinksDivPortrait'>
                        <div className='cheeseburger'>
                            <Link to='' onClick={()=>setMenu(!menu)}>
                                <div className='tb'/>
                                <div className='mid'/>
                                <div className='tb'/>
                            </Link>
                            <div className={showMenu}>
                                {/* <ul> */}
                                    <span className='portraitLinks'><Link className='navLink' to='/home'>HOME</Link></span>
                                    <span className='portraitLinks'><Link className='navLink' to='/about'>ABOUT</Link></span><br/>
                                    <span className='portraitLinks'><Link className='navLink' to='/contact'>CONTACT</Link></span><br/>
                                    <span className='portraitLinks'><Link className='navLink' to='/findseeds'>SEEDS</Link></span>
                                    <span className='portraitLinks'><Link className='navLink' to='/login'>LOG IN</Link></span>
                                {/* </ul> */}
                            </div>

                        </div>
                        {/* <div className='linkDivPortrait'><Link className='navLink' to='/home'>HOME</Link></div>
                        <div className='linkDivPortrait'><Link className='navLink' to='/about'>ABOUT</Link></div>
                        <div className='linkDivPortrait'><Link className='navLink' to='/contact'>CONTACT</Link></div>
                        <div className='linkDivPortrait'><Link className='navLink' to='/findseeds'>SEEDS</Link></div>
                        <div className='linkDivPortrait'><Link className='navLink' to='/login'>LOG IN</Link></div> */}
                    </div>

                </div>
                
            </div>
        </div>
    )
}

export default NavBar