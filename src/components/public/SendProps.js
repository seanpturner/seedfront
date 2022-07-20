import React from 'react'
import { Link } from "react-router-dom";

function SendProps() {
  return (
    <div>
        {/* <Link to='/receiveprops/6'>Send 6</Link> */}
        <Link to={'/receiveprops/7/8'}>send id 7-8 to receiveProps</Link>
    </div>
  )
}

export default SendProps