import React, { useState, useEffect } from 'react'
import NavBar from '../common/NavBar';
import axios from 'axios';

function About() {
    const [userName, setUserName] = useState('');
    const [IP, setIP] = useState('');
    const [state, setState] = useState('');
    const page = 'About';
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

    useEffect(()=> {
        setUserName(localStorage.getItem('userName'));
        getData();
    }, [])

    return (
        <div className='pubPage noScroll'>
            <div className='navBar'>
                <NavBar/>
            </div>
            <div className='aboutImageDiv'>
                <div className='centeredDiv homePromo'>
                    <h3>Hello fellow grower!</h3>
                    <p>I started growing cannabis, like many of you, just because it made sense. It's less expensive to grow it than to buy it. That turned into a love of growing cannabis which then turned into a love of breeding cannabis.</p>
                    <p>At some point, I started sharing some of my seeds with my friends, and then a good friend pointed out to me that I could actually sell my seeds. I didn't really believe it at first, but not long after that, I became known as "the seed guy" and it seemed like everybody I knew was buying seeds from me. I really just fell into this that easily.</p>
                    <p>After a few years, my wife pointed out to me that if I were to run it like a business, and actually try to broaden my base, that I could probably quit my day job. For the second time, I was left wondering why I hadn't thought of it first. So, I pushed a little bit, made a few sales and even supplied a few farms with my seeds and breeds.</p>
                    <p>Now, this web site represents the latest step in my journey. I'm sticking with my own finely-cultivated breeds so that you can enjoy the best Boutique Seeds you can find.</p>
                </div>
            </div>
        </div>
    )
}

export default About