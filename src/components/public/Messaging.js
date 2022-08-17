import React, { useEffect, useState } from 'react';
import NavBar from '../common/NavBar';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Messaging(props) {
    const { firstFilter } = useParams();
    const [filter, setFilter] = useState(null);
    const showUnread = filter === 'unread' || filter === '' || !filter ? 'selectedMessages' : 'showUnread';
    const showUnarchived = filter === 'unarchived' ? 'selectedMessages' : 'showUnarchived';
    const showAll = filter === 'all' ? 'selectedMessages' : 'showAll';
    const showSent = filter === 'sent' ? 'selectedMessages' : 'showSent';
    const [allMessages, setAllMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [updateMessages, setUpdateMessages] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [userName, setUserName] = useState(null);
    const [nameHash, setNameHash] = useState(null);
    const [showDiv, setShowDiv] = useState('messageTable');
    const messageTable = showDiv === 'messageTable' ? 'messageTble' : 'hidden';
    const singleMessage = showDiv === 'singleMessage' ? 'singleMessage' : 'hidden';
    const [openMessage, setOpenMessage] = useState(null);

    const getNameHash = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("http://localhost:8080/users/nameHash", requestOptions)
            .then(response => response.json())
            .then(result => {
                setNameHash(result);
                getAllMessages();
            })
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const getAllMessages = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch('http://localhost:8080/messages/user/' + userName, requestOptions)
            .then(response => response.json())
            .then(result => sortMessages(result))
            // .then(result => setAllMessages(result))
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const sortMessages = (messageArray) => {
        messageArray.sort((a, b) => (a.id < b.id ? 1 : -1));
        setAllMessages(messageArray);
    }

    const filterMessages = () => {
        if (allMessages && allMessages !== undefined) {
            if (filter === 'unread') {
                let filteredArray = allMessages.filter(data => !data.read && crossReference(nameHash, 'userId', data.receiverId, 'userName') === userName)
                setFilteredMessages(filteredArray);
            }
            if (filter === 'unarchived') {
                let filteredArray = allMessages.filter(data => !data.archived && crossReference(nameHash, 'userId', data.receiverId, 'userName') === userName)
                setFilteredMessages(filteredArray);
            }
            if (filter === 'all') {
                let filteredArray = allMessages.filter(data => crossReference(nameHash, 'userId', data.receiverId, 'userName') === userName)
                setFilteredMessages(filteredArray);
            }

            if (filter === 'sent') {
                let filteredArray = allMessages.filter(data => crossReference(nameHash, 'userId', data.senderId, 'userName') === userName)
                setFilteredMessages(filteredArray);
            }
        }
        
    }

    const crossReference = (list, sentKey, sentValue, returnKey) => {
        let returnItem;
        list.forEach(item => {
            if (sentValue && sentValue !== undefined) {
                if (item[sentKey].toString() === sentValue.toString()) {
                returnItem =  item[returnKey];
                }
            }
        });
        return returnItem;
    }

    const maxLength = (message, length) => {
        if (message && message.length > length) {
            return (message.substring(0,length-3) + '...');
        }else{
            return (message);
        }
    }

    const updateRead = (message) => {
        let senderName = crossReference(nameHash, 'userId', message.senderId, 'userName');
        if (message.id && senderName !== userName && (!message.read || !message.timestampOpened)) {
            let requestOptions = {
                method: 'PUT',
                redirect: 'follow'
              };
              
              fetch('http://localhost:8080/messages/updateRead/' + message.id, requestOptions)
                .then(response => response.text())
                // .then(result => updateNav())
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }

    const updateArchived = (message) => {
        if (message.id && (!message.archived || !message.timestampArchived)) {
            let requestOptions = {
                method: 'PUT',
                redirect: 'follow'
              };
              
              fetch('http://localhost:8080/messages/updateArchived/' + message.id, requestOptions)
                .then(response => response.text())
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }

    useEffect(() => {
        setUserName(localStorage.getItem('userName'));
        // setFilter(firstFilter);
        if (!firstFilter) {
            setFilter('unread');
        }else{
            setFilter(firstFilter);
        }
    }, [])

    useEffect(() => {
        filterMessages();
    }, [allMessages, filter])

    useEffect(() => {
        let now = new Date();
        if (!lastUpdate || lastUpdate - now > 20000) {
            getNameHash();
        }
    }, [updateMessages, userName])

    return (
        <div className='pubPage'>
            <div id='messageNav' className='navBar'>
                <NavBar/>
            </div>
            {/* <p>{JSON.stringify(allMessages)}</p>
            <p>{JSON.stringify(filteredMessages)}</p> */}
            <div className='pubContent'>
                <div className={messageTable}>
                    <p>
                        <span>Show: </span>
                        <span className={showUnread}><Link to='' onClick={()=>{setFilter('unread')}}>Unread</Link></span>{' '}
                        <span className={showUnarchived}><Link to='' onClick={()=>{setFilter('unarchived')}}>Unarchived</Link></span>{' '}
                        <span className={showAll}><Link to='' onClick={()=>{setFilter('all')}}>All</Link></span>{' '}
                        <span className={showSent}><Link to='' onClick={()=>{setFilter('sent')}}>Sent</Link></span>{' '}
                    </p>
                    <table>
                        <tr>
                            <td className='messagePadding'/>
                            <td className='messagePadding'>Date</td>
                            <td className='messagePadding'>{filter === 'sent' ? 'To' : 'From'}</td>
                            <td className='messagePadding'>Subject</td>
                            <td className='messagePadding'>Message</td>
                        </tr>
                        {nameHash && filteredMessages?.map((message) => {
                            return(
                                <tr>
                                    {/* <td className='messagePadding'><Link to='' onClick={()=>{setOpenMessage(message); setShowDiv('singleMessage'); updateRead(message)}}>{message.id}</Link></td> */}
                                    <td className='messagePadding'><Link to='' onClick={()=>{setOpenMessage(message); setShowDiv('singleMessage'); updateRead(message)}}>Open</Link></td>
                                    <td className='messagePadding'>{message.timestampSent.substring(0,10)}</td>
                                    {filter === 'sent' ? <td className='messagePadding'>{maxLength(crossReference(nameHash, 'userId', message.receiverId, 'userName'),10)}</td> : <td className='messagePadding'>{!message.senderId ? '[user]' : maxLength(crossReference(nameHash, 'userId', message.senderId, 'userName'),10)}</td>}
                                    <td className='messagePadding'>{maxLength(message.messageSubject, 30)}</td>
                                    <td className='messagePadding'>{maxLength(message.messageBody, 40)}</td>
                                    <td className='messagePadding'>{message.read || filter === 'sent' ? '' : <Link to='' onClick={()=>{updateRead(message); window.location.replace('/messaging/' + filter)}}>Mark as read </Link>}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
                <div className={singleMessage}>
                    <p><Link to='' onClick={()=>{window.location.replace('/messaging/' + filter)}}>Back to Messages</Link></p>
                    <table>
                        <tr>
                            <td className='messagePadding'>Sent:</td>
                            <td className='messagePadding'>{openMessage?.timestampSent.substring(0,10)}</td>
                        </tr>
                        <tr>
                            <td className='messagePadding'>From:</td>
                            <td className='messagePadding'>{openMessage && openMessage.senderId ? crossReference(nameHash, 'userId', openMessage.senderId, 'userName').charAt(0).toUpperCase() + crossReference(nameHash, 'userId', openMessage.senderId, 'userName').slice(1) : 'user'}</td>
                        </tr>
                        <tr>
                            <td className='messagePadding'>To:</td>
                            <td className='messagePadding'>{openMessage && openMessage.receiverId ? crossReference(nameHash, 'userId', openMessage.receiverId, 'userName').charAt(0).toUpperCase() + crossReference(nameHash, 'userId', openMessage.receiverId, 'userName').slice(1) : 'user'}</td>
                        </tr>
                        <tr>
                            <td className='messagePadding'>Subject:</td>
                            <td className='messagePadding'>{openMessage?.messageSubject}</td>
                        </tr>
                        <tr>
                            <td className='messagePadding'>Message:</td>
                            <td className='messagePadding'>{openMessage?.messageBody}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Messaging