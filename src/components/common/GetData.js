import React, { useState, useEffect } from 'react';
import axios from 'axios';


function GetData(page) {
    const [IP, setIP] = useState('');
    // const [user, setUser] = useState('unknown');
    // const [state, setState] = useState('');
    // const [timestamp, setTimestamp] = useState('');
    // const userData
    const getInfo = async (page) => {
        const res = await axios.get('https://geolocation-db.com/json/');
        // console.log(res.data);
        // alert(JSON.stringify(res.data));
        setIP(res.data.IPv4);
        // setState(res.data.state);
        // let currentDate = new Date;
        // alert(currentDate);
    }

    useEffect(()=> {
        getInfo();
        // let un = localStorage.getItem('userName');
        // if (un) {
        //     setUser(un);
        // }
    }, [])
}

export default GetData