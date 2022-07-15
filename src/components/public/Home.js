import React from 'react'
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import HomeImage1 from '../photos/HomeImage1.jpeg';
import HomeImage2 from '../photos/HomeImage2.jpeg';

function Home() {
    return (
        <div className='pubPage noScroll'>
            <div className='navBar'>
                <NavBar/>
            </div>
            <div className='homeImageDiv'>
                <img className='homeImageLandscape' alt='cannabis going to seed' src={HomeImage1}/>
                <img className='homeImagePortrait' alt='cannabis going to seed' src={HomeImage2}/>
            </div>
            <div className='footerBlend'/>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Home