import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import { Link } from "react-router-dom";

function BulkUpdate() {
    const [openPurchases, setOpenPurchases] = useState([]);
    const [updateIdArray, setUpdateIdArray] = useState([]);
    const [purchasesToUpdate, setPurchasesToUpdate] = useState([]);
    // const [selectedPurchases, setSelectedPurchases] = useState([]);
    const [allStatuses, setAllStatuses] = useState([]);
    // const [existingStatus, setExistingStatus] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const getOpenPurchases = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("http://localhost:8080/purchases/openpurchases", requestOptions)
            .then(response => response.json())
            .then(response => sortPurchases(response, 'id'))
            .then(result => setOpenPurchases(result))
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const sortPurchases = (purchases, sortBy) => {
        purchases.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
        return purchases;
    }

    const getAllStatuses = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("http://localhost:8080/purchasestatuses", requestOptions)
            .then(response => response.json())
            .then(result => setAllStatuses(result))
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const filterOpenPurchases = () => {
        // if (!existingStatus) {
            setPurchasesToUpdate(openPurchases);
        // }
    }

    const setUpdateArray = (id, sortBy) => {
        let currentArray = updateIdArray;
        if (currentArray.includes(id)) {
            currentArray = currentArray.filter(data => data !== id);
        }else{
            currentArray.push(id);
        }
        setUpdateIdArray(currentArray);
    }

    const setStatusDropdown = () => {
        let dd = document.getElementById('statusSelect');
        dd.innerHTML = '';
        dd.options.add(new Option('Select new status', '', true));
        allStatuses.forEach(status => {
            dd.options.add(new Option(status.label, status.statusCode));
        });
    }

    const crossReference = (list, sentKey, sentValue, returnKey) => {
        let returnItem;
        list.forEach(item => {
            if (sentValue && sentValue !== undefined) {
                if (item[sentKey].toString().toLowerCase() === sentValue.toString().toLowerCase()) {
                returnItem =  item[returnKey];
                }
            }
        });
        return returnItem;
    }

    const bulkUpdateStatuses = () => {
        let ordersToUpdate = [];
        updateIdArray.forEach(id => {
            openPurchases.forEach(purchase => {
                if (purchase.id === id) {
                    ordersToUpdate.push(purchase);
                }
            });
        });
        // setSelectedPurchases(ordersToUpdate);
        console.log(ordersToUpdate);
        ordersToUpdate.forEach(order => {
            
            order.orderNotes = [...order.orderNotes, {
                date: getDateTime(true),
                note: 'Bulk change ' + order.orderStatus + ' > ' + newStatus,
                user: localStorage.getItem('userName')
            }]
            //paid
            if (newStatus === '101') {
                order.paymentDate = getDateTime(false);
            }
            //picked
            if (newStatus === '102') {
                order.orderPickedDate = getDateTime(false);
            }
            //shipped
            if (newStatus === '103') {
                order.shippedDate = getDateTime(false);
            }
            //cancelled
            if (newStatus === '300') {
                order.orderCancelledDate = getDateTime(false);
            }
            order.orderStatus = parseInt(newStatus);
            updatePurchase(order);
        });
        // setSelectedPurchases(ordersToUpdate);
        // console.log(ordersToUpdate);
    }

    const getDateTime = (includeTime) => {
        let today = new Date();
        let dash1 = '-';
        let dash2 = '-';
            let day = today.getDate();
            let month = today.getMonth() +1;
            let year = today.getFullYear();
            let hours = today.getHours();
            let minutes = today.getMinutes();
            let seconds = today.getSeconds();
        if (month < 10) {
            dash1 = '-0';
        }
        if (day < 10) {
            dash2 = '-0';
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (includeTime) {
            let newDate = year + dash1 + month + dash2 + day + 'T' + hours + ':' + minutes + ':' + seconds + '.000000';
            return newDate
        }else{
            let newDate = year + dash1 + month + dash2 + day;
            return newDate
        }
    }

    const updatePurchase= (order) => {
        // alert(JSON.stringify(order));
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(order);

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch('http://localhost:8080/purchases/' + order.id, requestOptions)
        .then(response => response.text())
        .then(result => window.location.reload())
        // .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getOpenPurchases();
        getAllStatuses();
        // eslint-disable-next-line
    }, [])
    
    useEffect(() => {
        if (openPurchases.length > 0) {
            filterOpenPurchases();
        }
        // eslint-disable-next-line
    }, [openPurchases])

    useEffect(() => {
        setStatusDropdown();
        // eslint-disable-next-line
    }, [allStatuses])
    return (
        <div className='adminPage'>
            <div className="adminNavDiv">
                <AdminNav />
            </div>
            {/* {JSON.stringify(openPurchases)} */}
            {/* {JSON.stringify(purchasesToUpdate)} */}
            {/* {updateIdArray.toString()} */}
            {/* {JSON.stringify(updateIdArray)} */}
            {/* {JSON.stringify(allStatuses)} */}
            {/* {JSON.stringify(selectedPurchases)} */}
            <table>
                <tr>
                    <td/>
                    <td>ID</td>
                    <td>Locator</td>
                    <td>Date</td>
                    <td>Status</td>
                    <td>Customer</td>
                    <td>UserName</td>
                    <td>Total</td>
                </tr>
                {purchasesToUpdate.map((order) =>{
                    return(
                        <tr>
                            <td><input type='checkbox' onChange={()=>{setUpdateArray(order.id)}}/></td>
                            <td>{order.id}</td>
                            <td>{order.recordLocator}</td>
                            <td>{order.purchaseDate}</td>
                            <td>{order.orderStatus}</td>
                            <td>{order.userId}</td>
                            <td>{order.userName}</td>
                            <td>{order.total}</td>
                        </tr>
                    )
                })}
            </table>
            <p>New status: <select id='statusSelect' onChange={(e)=>{setNewStatus(e.target.value)}}/></p>
            <p className={newStatus && newStatus !== '' && purchasesToUpdate.length > 0 ? 'updateStatus' : 'hidden'}><Link to='' onClick={()=>bulkUpdateStatuses()}>Update selected orders to {crossReference(allStatuses, 'statusCode', newStatus, 'label')}</Link></p>
        </div>
    )
}

export default BulkUpdate