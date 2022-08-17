import React, { useEffect, useState } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function Contact() {
    const [showDiv, setShowDiv] = useState('contactForm');
    const contactForm = showDiv === 'contactForm' ? 'contactForm' : 'hidden';
    const submitSuccess = showDiv === 'submitSuccess' ? 'submitSuccess' : 'hidden';
    const [contactType, setContactType] = useState(null);
    const [contactSubject, setContactSubject] = useState(null);
    const [contactMessage, setContactMessage] = useState(null);
    const [contactName, setContactName] = useState(null);
    const [contactEmail, setContactEmail] = useState(null);
    // const [timeStamp, setTimeStamp] = useState(null);
    const [showValidationText, setShowValidationText] = useState(false);
    const validateType = showValidationText && (!contactType || contactType === '') ? 'validateType' : 'hidden';
    const validateSubject = showValidationText && (!contactSubject || contactSubject.replace(/\s/g, '') === '') ? 'validateSubject' : 'hidden';
    const validateMessage = showValidationText && (!contactMessage || contactMessage.replace(/\s/g, '') === '') ? 'validateMessage' : 'hidden';
    const validateName = showValidationText && (!contactName || contactName.replace(/\s/g, '') === '') ? 'validateName' : 'hidden';
    const validateEmail = showValidationText && (!contactEmail || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contactEmail)) ? 'validateEmail' : 'hidden';
    const contactObject = {
        id: null,
        senderId: null,
        receiverId: 1,
        read: false,
        archived: false,
        messageSubject: contactType + ' - ' + contactSubject,
        messageBody: contactMessage + ' - ' + contactName + ' - ' + contactEmail
    }
    
    const clearFormInputs= () => {
        let fi = document.getElementsByClassName('contactFormInput');
        fi.forEach(element => {
            element.value =  '';
        });
        setShowValidationText(false);
        setContactType(null);
        setContactSubject(null);
        setContactMessage(null);
        setContactEmail(null);
        setContactName(null);
        // setTimeStamp(null);
    }

    const validateFormInputs = () => {
        setShowValidationText(true);
        // setTimeStamp(getDateTime());
        if (
            contactType && contactType !== '' 
            && contactSubject && contactSubject.replace(/\s/g, '') !==  ''
            && contactMessage && contactMessage.replace(/\s/g, '') !==  ''
            && contactName && contactName.replace(/\s/g, '') !==  ''
            && contactEmail && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contactEmail)
            // && timeStamp
        ) {
            submitForm();
        }
    }
    const submitForm = () => {
        contactObject.timestampSent = getDateTime();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(contactObject);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:8080/messages", requestOptions)
            .then(response => response.text())
            .then(response => setShowDiv('submitSuccess'))
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));
    }

    // const showSuccess = () => {
    //     setShowDiv('submitSuccess');
    // }

    const getDateTime = () => {
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
        return year + dash1 + month + dash2 + day + 'T' + hours + ':' + minutes + ':' + seconds + '.000000';
    }

    useEffect(() => {
        if (showDiv === 'submitSuccess') {
            setTimeout(() => {
                // setShowDiv('contactForm');
                // alert('it happened');
                window.location.reload();
            }, 1500);
        }
    }, [showDiv])

    return (
        <div className='pubPage'>
            <div className='navBar'>
                <NavBar/>
            </div>
            <div className='pubContent'>
            {/* <p>{JSON.stringify(contactObject)}</p> */}
                <div className={contactForm}>
                    <span>Please share your questions or comments with us</span>
                    <table className='topAlignTable'>
                        <tr className='topAlignTableRow'>
                            <td>Type</td>
                            <td>
                            <select autofocus className='contactFormInput' onChange={(e)=>{setContactType(e.target.value)}}>
                                <option value='' selected >Select</option>
                                <option value='seeds'>Seeds</option>
                                <option value='ordering'>Ordering Issues</option>
                                <option value='site'>Site Issues</option>
                                <option value='other'>General/Other</option>
                            </select></td>
                            <td className={validateType}><span className='validationText'>Required</span></td>
                        </tr>
                        <tr className='topAlignTableRow'>
                            <td>Subject</td>
                            <td><input id='contactType' className='contactFormInput' type='text' onBlur={(e)=>{setContactSubject(e.target.value)}}/></td>
                            <td className={validateSubject}><span className='validationText'>Required</span></td>
                        </tr>
                        <tr className='topAlignTableRow'>
                            <td>Message</td>
                            <td><textarea id='messageBody' className='contactFormInput' type='text' rows='5' onChange={(e)=>{setContactMessage(e.target.value)}}/></td>
                            <td className={validateMessage}><span className='validationText'>Required</span></td>
                        </tr>
                        <tr className='topAlignTableRow'>
                            <td>Name</td>
                            <td><input id='contactName' className='contactFormInput' type='text' onBlur={(e)=>{setContactName(e.target.value)}}/></td>
                            <td className={validateName}><span className='validationText'>Required</span></td>
                        </tr>
                        <tr className='topAlignTableRow'>
                            <td>Email</td>
                            <td><input id='contactEmail' className='contactFormInput' type='text' onBlur={(e)=>{setContactEmail(e.target.value)}}/></td>
                            <td className={validateEmail}><span className='validationText'>Must be a valid email address</span></td>
                        </tr>
                        <tr className='topAlignTableRow'>
                            <td/>
                            <td><Link to='' onClick={()=>validateFormInputs()}>Send</Link>{' '}<Link to='' onClick={()=>clearFormInputs()}>Clear</Link></td>
                            <td/>
                        </tr>
                    </table>
                </div>
                <div className={submitSuccess}>
                    <h3>Your form was submitted successfully</h3>
                </div>
            </div>
        </div>
    )
}

export default Contact