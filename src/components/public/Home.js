import React, { useEffect, useState } from 'react'
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import { Link } from "react-router-dom";
import axios from 'axios';

function Home() {
    const [userName, setUserName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [IP, setIP] = useState('');
    const [state, setState] = useState('');
    const page = 'Home';
    const [trackerSent, setTrackerSent] = useState(false);
    const dataTracker = {
        ip: IP,
        state: state,
        page: page,
        userName: userName
    }

    const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/');
        setIP(res.data.IPv4);
        setState(res.data.state);
    }

    useEffect(()=> {
        if (dataTracker.ip && dataTracker.state && !trackerSent) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            let raw = JSON.stringify(dataTracker);
            
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
            fetch("http://localhost:8080/tracking", requestOptions)
                .then(response => response.text())
                .then(setTrackerSent(true))
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }, [dataTracker])

    const checkLoggedIn = () => {
        let un = localStorage.getItem('userName');
        if (un && un !== undefined && un !== '') {
            setLoggedIn(true);
        }
    }

    useEffect(() => {
        setUserName(localStorage.getItem('userName'));
        checkLoggedIn();
        getData();
    }, [])
    return (
        <div className='pubPage noHorizontalScroll'>
            <div className='navBar'>
                <NavBar className='z3'/>
            </div>
            <div className='homeImageDiv'>
                <div className='centeredDiv homePromo'>
                    <p className='centerText'><h2>Thank you for choosing Boutique Seeds</h2></p>
                    {loggedIn ? '' : <p><span className='alertRedText'>New Users </span>- <Link to='/login'>Create an account</Link> and receive free standard shipping or discounted expedited shipping on all orders over $50.</p>}
                    {loggedIn ? <p><span className='alertRedText'>Businesses and frequent buyers </span>- <Link to='/messaging'>message us</Link> for discounted pricing.</p> : <p><span className='alertRedText'>Businesses and frequent buyers </span>- <Link to='/contact'>contact us</Link> for discounted pricing.</p>}
                    <p>We do seeds differently. See our <Link to='/faq'>FAQ's</Link> to learn more.</p>
                    <p>Browse our selection of carefully curated <Link to='/findSeeds'>Boutique Seeds</Link>.</p>
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Home