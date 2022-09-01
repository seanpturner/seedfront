import React, { useEffect, useState } from 'react'
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import { Link } from "react-router-dom";

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);

    const checkLoggedIn = () => {
        let un = localStorage.getItem('userName');
        if (un && un !== undefined && un !== '') {
            setLoggedIn(true);
        }
    }

    useEffect(() => {
        checkLoggedIn();
    }, [])
    return (
        <div className='pubPage noScroll'>
            <div className='navBar'>
                <NavBar className='z3'/>
            </div>
            <div className='homeImageDiv'>
                <div className='centeredDiv homePromo'>
                    <p className='centerText'><h2>Thank you for choosing Boutique Seeds</h2></p>
                    <p>Welcome to our brand-new site. So, if you find a bug or encounter an issue, please let me know via the contact/messages page. It's probably legit. </p>
                    {loggedIn ? '' : <p><Link to='/login'>Create an account</Link> and choose free standard shipping or discounted expedited shipping on all orders over $50.</p>}
                    {loggedIn ? <p>Businesses and frequent buyers - <Link to='/messaging'>message us</Link> for discounted pricing.</p> : <p>Businesses and frequent buyers - <Link to='/contact'>contact us</Link> for discounted pricing.</p>}
                    <p>We do seeds differently. See our <Link to='/faq'>FAQ's</Link> to learn more.</p>
                    <p>Browse our selection of carefully curated and deliberately selected <Link to='/findSeeds'>Boutique Seeds</Link>.</p>
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Home