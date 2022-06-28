import React from 'react'
import { Link } from 'react-router-dom';

function AdminNav() {
  return (
    <div className ="adminDiv">
        <table>
          <tr>
            <td><Link to= '/home'>Public Site</Link></td>
            <td><Link to= '/admin'>Admin Home</Link></td>
            <td><Link to= '/comments'>Comments</Link></td>
            <td><Link to= '/content'>Content</Link></td>
            <td><Link to= '/discounts'>Discounts</Link></td>
            <td><Link to= '/lines'>Lines</Link></td>
            <td><Link to= '/logins'>Logins</Link></td>
            <td><Link to= '/messages'>Messages</Link></td>
            <td><Link to= '/plants'>Plants</Link></td>
            <td><Link to= '/pricing'>Pricing</Link></td>
            <td><Link to= '/orders'>Orders</Link></td>
            <td><Link to= '/seeds'>Seeds</Link></td>
            <td><Link to= '/users'>Users</Link></td>
          </tr>
        </table>
    </div>
  )
}

export default AdminNav