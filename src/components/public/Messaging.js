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
    const showSend = filter === 'send' ? 'selectedMessages' : 'showSend';
    const [allMessages, setAllMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [nameHash, setNameHash] = useState(null);
    const [showDiv, setShowDiv] = useState('messageTable');
    const messageTable = showDiv === 'messageTable' ? 'messageTable' : 'hidden';
    const singleMessage = showDiv === 'singleMessage' ? 'singleMessage' : 'hidden';
    const [openMessage, setOpenMessage] = useState(null);
    const [messageReply, setMessageReply] = useState(null);
    const sendMessage = showDiv === 'sendMessage' ? 'sendMessage' : 'hidden';
    const [authLevel, setAuthLevel] = useState('user');
    const [newMessageReceiverId, setNewMessageReceiverId] = useState(null);
    const [newMessageSubject, setNewMessageSubject] = useState(null);
    const [newMessageBody, setNewMessageBody] = useState(null);
    const okToSendNewMessage = newMessageSubject && newMessageSubject.replace(/\s/g, '') !== "" && newMessageBody && newMessageBody.replace(/\s/g, '') !== "" && newMessageReceiverId ? 'okToSendNewMessage' : 'hidden';
    const showReplyButton = filter === 'sent' ? 'hidden' : 'showReplyButton';
    const newMessage = {
        id: null,
        senderId: userId,
        receiverId: newMessageReceiverId,
        messageSubject: newMessageSubject,
        messageBody: newMessageBody,
        read: false,
        archived: false,
        timestampSent: null,
        timestampArchived: null
    }

    const getNameHash = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch("http://www.boutiqueseedsnm.com/backend/users/nameHash", requestOptions)
            .then(response => response.json())
            .then(result => {
                filterNameHash(result);
                getAllMessages();
            })
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    const filterNameHash = (nameHash) => {
        nameHash.sort((a,b) => (a.userName > b.userName ? 1 : -1));
        setNameHash(nameHash);
    }

    const getAllMessages = () => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch('http://www.boutiqueseedsnm.com/backend/messages/user/' + userName, requestOptions)
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
        if (allMessages && allMessages !== undefined && allMessages.length > 0 && userName) {
            let uid = crossReference(nameHash, 'userName', userName, 'userId');
            let filteredArray;
            if (filter === 'unread' || !filter) {
                filteredArray = allMessages.filter(data => data.receiverId === uid && !data.read);
            }
            if (filter === 'unarchived') {
                filteredArray = allMessages.filter(data => data.receiverId === uid && !data.archived);
            }
            if (filter === 'all') {
                filteredArray = allMessages.filter(data => data.receiverId === uid);
            }
            if (filter === 'sent') {
                filteredArray = allMessages.filter(data => data.senderId === uid);
            }
            setFilteredMessages(filteredArray);
        }
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
              fetch('http://www.boutiqueseedsnm.com/backend/messages/updateRead/' + parseInt(message.id), requestOptions)
                .then(response => response.text())
                // .then(result => updateNav())
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }

    const updateArchived = (message) => {
        let senderName = crossReference(nameHash, 'userId', message.senderId, 'userName');
        if (message.id && senderName !== userName && (!message.archived || !message.timestampArchived)) {
            let requestOptions = {
                method: 'PUT',
                redirect: 'follow'
              };
              fetch('http://www.boutiqueseedsnm.com/backend/messages/updateArchived/' + message.id, requestOptions)
                .then(response => response.text())
                // .then(result => console.log(result))
                // .catch(error => console.log('error', error));
        }
    }

    const sendReply = (message) => {
        let messageSub = message.messageSubject;
        let subjectStart =  messageSub.substring(0,6);
        if (subjectStart !== 'Reply:') {
            messageSub = 'Reply: ' + messageSub;
        }
        const replyMessage = {
            id: null,
            senderId: message.receiverId,
            receiverId: message.senderId,
            messageBody: messageReply,
            messageSubject: messageSub,
            read: false,
            archived: false
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(replyMessage);
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://www.boutiqueseedsnm.com/backend/messages", requestOptions)
        .then(response => response.text())
        .then(result => window.location.replace('/messaging/' + filter))
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
    }

    const sendNewMessage = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(newMessage);
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://www.boutiqueseedsnm.com/backend/messages", requestOptions)
        .then(response => response.text())
        .then(result => window.location.replace('/messaging/' + filter))
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
    }

    const clearNewMessage = () => {
        document.getElementById('newMessageSubject').value = '';
        document.getElementById('newMessageBody').value = '';
        setNewMessageSubject(null);
        setNewMessageBody(null);
    }

    const updateUserList = () => {
        let dd = document.getElementById('usersSelect');
        if (authLevel && authLevel === 'admin') {
            dd.innerHTML = "";
            dd.options.add(new Option('Select', '', true));
            nameHash.forEach(user => {
                if (user.userName !== userName) {
                    dd.options.add(new Option(user.userName, user.userId));
                }
            });
            setNewMessageReceiverId(null);
        }else{
            dd.options.add(new Option('Boutique Seeds', 1));
            setNewMessageReceiverId(1);
        }
    }

    const checkAuth = () => {
        let requestOptions;
        let un = localStorage.getItem('userName');
        let token = localStorage.getItem('bearerToken');
        let myHeaders = new Headers();
        myHeaders.append("bearerToken", token);
        requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://www.boutiqueseedsnm.com/backend/users/checkUserLevel/" + un, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.userAccountType === 'admin') {
                setAuthLevel(result.userAccountType);
            }
        })
    }

    useEffect(() => {
        setUserName(localStorage.getItem('userName'));
        if (!firstFilter) {
            setFilter('unread');
        }else{
            setFilter(firstFilter);
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (allMessages) {
            filterMessages();
        }
        // eslint-disable-next-line
    }, [allMessages, filter])

    useEffect(() => {
        if (nameHash && nameHash !== undefined) {
            updateUserList();
        }
        // eslint-disable-next-line
    }, [nameHash])

    useEffect(() => {
        if (userName && userName !== undefined) {
            checkAuth();
        }
        getNameHash();
        // eslint-disable-next-line
    }, [userName])

    useEffect(() => {
        if (userName && userName !== undefined && nameHash && nameHash !== undefined) {
            setUserId(crossReference(nameHash, 'userName', userName, 'userId'));
        }
    }, [userName, nameHash])

    return (
        <div className='pubPage'>
            <div id='messageNav' className='navBar'>
                <NavBar/>
            </div>
            <div className='pubContent'>
                <div className='topCenteredDiv'>
                    <div className={messageTable}>
                        <p className='centerText'>
                            <span>Incoming: </span>
                            <span className={showUnread}><Link to='' onClick={()=>{setFilter('unread')}}>Unread</Link></span>{' '}
                            <span className={showUnarchived}><Link to='' onClick={()=>{setFilter('unarchived')}}>Unarchived</Link></span>{' '}
                            <span className={showAll}><Link to='' onClick={()=>{setFilter('all')}}>All</Link></span>{' '}
                        </p>
                        <p className='centerText'>
                            <span>Outgoing: </span>
                            <span className={showSent}><Link to='' onClick={()=>{setFilter('sent')}}>Sent</Link></span>{' '}
                            <span>|</span>{' '}
                            <span className={showSend}><Link to='' onClick={()=>{setShowDiv('sendMessage')}}>Send a message</Link></span>{' '}
                        </p>
                        <table className='messagesTable'>
                            <tr>
                                <td className='messagePadding boldText'/>
                                <td className='messagePadding boldText'>Date</td>
                                <td className='messagePadding boldText'>{filter === 'sent' ? 'To' : 'From'}</td>
                                <td className='messagePadding boldText'>Subject</td>
                                <td className='messagePadding boldText'>Message</td>
                            </tr>
                            {nameHash && filteredMessages?.map((message) => {
                                return(
                                    <tr>
                                        <td className='messagePadding'><Link to='' onClick={()=>{setOpenMessage(message); setShowDiv('singleMessage'); updateRead(message)}}>Open</Link></td>
                                        <td className='messagePadding'>{message.timestampSent.substring(0,10)}</td>
                                            {filter === 'sent' ? <td className='messagePadding'>{maxLength(crossReference(nameHash, 'userId', message.receiverId, 'userName'),10)}</td> : <td className='messagePadding'>{!message.senderId ? '[user]' : maxLength(crossReference(nameHash, 'userId', message.senderId, 'userName'),10)}
                                        </td>}
                                        <td className='messagePadding trunc'>{maxLength(message.messageSubject, 25)}</td>
                                        <td className='messagePadding'>{maxLength(message.messageBody, 40)}</td>
                                        <td className='messagePadding'>
                                            {message.read || filter === 'sent' ? '' : <Link to='' onClick={()=>{updateRead(message); window.location.replace('/messaging/' + filter)}}>+Read</Link>}{' '}
                                            {message.archived || filter === 'sent' ? '' : <Link to='' onClick={()=>{updateArchived(message); window.location.replace('/messaging/' + filter)}}>+Archive</Link>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                    <div className={singleMessage}>
                        <p><Link to='' onClick={()=>{window.location.replace('/messaging/' + filter)}}>Back to Messages</Link></p>
                        <table>
                            <tr className='topAlignTableRow'>
                                <td className='messagePadding'>Sent:</td>
                                <td className='messagePadding'>{openMessage?.timestampSent.substring(0,10)}</td>
                            </tr>
                            <tr className='topAlignTableRow'>
                                <td className='messagePadding'>From:</td>
                                <td className='messagePadding'>{openMessage && openMessage.senderId ? crossReference(nameHash, 'userId', openMessage.senderId, 'userName').charAt(0).toUpperCase() + crossReference(nameHash, 'userId', openMessage.senderId, 'userName').slice(1) : '[user]'}</td>
                            </tr>
                            <tr className='topAlignTableRow'>
                                <td className='messagePadding'>To:</td>
                                <td className='messagePadding'>{openMessage && openMessage.receiverId ? crossReference(nameHash, 'userId', openMessage.receiverId, 'userName').charAt(0).toUpperCase() + crossReference(nameHash, 'userId', openMessage.receiverId, 'userName').slice(1) : 'user'}</td>
                            </tr>
                            <tr className='topAlignTableRow'>
                                <td className='messagePadding'>Subject:</td>
                                <td className='messagePadding'>{openMessage?.messageSubject}</td>
                            </tr>
                        </table>
                        <div className='replyMessage'>
                            <textarea id='messageReply' className='messageReply' type='text' rows='15' defaultValue={openMessage && openMessage.messageBody ? '\n\n\n' + openMessage.messageBody : ''} onChange={(e)=>setMessageReply(e.target.value)}/>
                            <span className={showReplyButton}>
                                <Link className={showReplyButton} to='' onClick={()=>{sendReply(openMessage)}}>Send Reply</Link>
                                {' | '}
                                <Link to='' onClick={()=>{document.getElementById('messageReply').value=''; setMessageReply(null)}}>Clear</Link>
                            </span>
                        </div>
                    </div>
                    <div className={sendMessage}>
                            <p>
                                <span className={sendMessage}><Link to='' onClick={()=>{setShowDiv('messageTable')}}>Back to messages</Link></span>{' '}
                            </p>
                            <table>
                                <tr>
                                    <td className='messagePadding'>To:</td>
                                    <td className='messagePadding'><select id='usersSelect' onChange={(e)=>{setNewMessageReceiverId(e.target.value)}}/></td>
                                </tr>
                                <tr>
                                    <td className='messagePadding'>Subject:</td>
                                    <td className='messagePadding'><input id='newMessageSubject'  type='text' onChange={(e)=>{setNewMessageSubject(e.target.value)}}/></td>
                                </tr>
                                <tr>
                                    <td/>
                                    <td className='messagePadding'>
                                        <textarea id='newMessageBody' className='messageSend' type='text' rows='15' onChange={(e)=>setNewMessageBody(e.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td/>
                                    <td className='messagePadding'>
                                        <Link to='' className={okToSendNewMessage} onClick={()=>sendNewMessage()}>Send</Link> <Link to='' onClick={()=>clearNewMessage()}>Clear</Link>
                                    </td>
                                </tr>
                            </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messaging