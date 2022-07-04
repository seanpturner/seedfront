import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Admin from './components/admin/Admin';
import Comments from './components/admin/Comments';
import Content from './components/admin/Content';
import Discounts from './components/admin/Discounts';
import Lines from './components/admin/Lines';
import Logins from './components/admin/Logins';
import Messages from './components/admin/Messages';
import Plants from './components/admin/Plants';
import OpenOrders from './components/admin/OpenOrders';
import Seeds from './components/admin/Seeds';
import Users from './components/admin/Users';
import Pricing from './components/admin/Pricing';
import Shipper from './components/admin/Shipper';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route  path='/home' element={<Home/>} />
        <Route  path='/about' element={<About/>} />
        <Route  path='/admin' element={<Admin/>} />
        <Route  path='/comments' element={<Comments/>} />
        <Route  path='/content' element={<Content/>} />
        <Route  path='/discounts' element={<Discounts/>} />
        <Route  path='/lines' element={<Lines/>} />
        <Route  path='/logins' element={<Logins/>} />
        <Route  path='/messages' element={<Messages/>} />
        <Route  path='/plants' element={<Plants/>} />
        <Route  path='/pricing' element={<Pricing/>} />
        <Route  path='/openorders' element={<OpenOrders/>} />
        <Route  path='/seeds' element={<Seeds/>} />
        <Route  path='/users' element={<Users/>} />
        <Route  path='/shipper' element={<Shipper/>} />
      </Routes>
    </Router>

  );
}

export default App;
