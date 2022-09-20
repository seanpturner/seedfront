import React, { useEffect, useState } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {

        setLoading(true);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch("http://www.boutiqueseedsnm.com/users/active", requestOptions)
            .then((response) => setData(response.data))
            .finally(() => setLoading(false));

            
            // .then(result => console.log(result))
            // .then(result => setActiveUsers(result))
            // .catch(error => console.log('error', error));
    }, url);

    return {data, loading};
}

export default useFetch