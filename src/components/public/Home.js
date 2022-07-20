import React from 'react'
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

function Home() {
    return (
        <div className='pubPage noScroll'>
            <div className='navBar'>
                <NavBar className='z3'/>
            </div>
            <div className='homeImageDiv'>

            </div>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Home