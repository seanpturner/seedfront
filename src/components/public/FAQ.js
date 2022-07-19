import React, { useEffect } from 'react'
import NavBar from '../common/NavBar';

function FAQ() {
    useEffect(() => {
        let usrI = [
            {
                itemId: 1,
                quantity: 2
            },
            {
                itemId: 2,
                quantity: 4
            },
            {
                itemId: 3,
                quantity: 6
            }
        ];
        localStorage.setItem('userOrder', JSON.stringify(usrI))
    });
  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='pubContent'>
          FAQ
        </div>
    </div>
  )
}

export default FAQ