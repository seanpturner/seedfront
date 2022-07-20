import React from 'react'
import { useParams } from 'react-router-dom'

function ReceiveProps() {
  const { id } = useParams();
  const { otherid } = useParams();
  // const { otherId} = useParams();
  console.log(id)
  return (
    <div>
    receiveProps<br/>
    {id}<br/>
    {otherid}
    </div>
  )
}

export default ReceiveProps