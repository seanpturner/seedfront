import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './components/public/Home';
import About from './components/public/About';
import Admin from './components/admin/Admin';
import Comments from './components/admin/Comments';
import Content from './components/admin/Content';
import Discounts from './components/admin/Discounts';
import Lines from './components/admin/Lines';
import Logins from './components/admin/Logins';
import Messages from './components/admin/Messages';
import Plants from './components/admin/Plants';
import OpenOrders from './components/admin/OpenOrders';
import AllOrders from './components/admin/AllOrders';
import Seeds from './components/admin/Seeds';
import Users from './components/admin/Users';
import Pricing from './components/admin/Pricing';
import Shipper from './components/admin/Shipper';
import CreateOrder from './components/admin/CreateOrder';
import Login from './components/public/login';
import Contact from './components/public/Contact';
import FindSeeds from './components/public/FindSeeds';
import LoginSuccess from './components/public/LoginSuccess';
import LoginFailure from './components/public/LoginFailure';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='/comments' element={<Comments/>} />
        <Route path='/content' element={<Content/>} />
        <Route path='/discounts' element={<Discounts/>} />
        <Route path='/lines' element={<Lines/>} />
        <Route path='/logins' element={<Logins/>} />
        <Route path='/messages' element={<Messages/>} />
        <Route path='/plants' element={<Plants/>} />
        <Route path='/pricing' element={<Pricing/>} />
        <Route path='/openorders' element={<OpenOrders/>} />
        <Route path='/allorders' element={<AllOrders/>} />
        <Route path='/seeds' element={<Seeds/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/shipper' element={<Shipper/>} />
        <Route path='/createOrder' element={<CreateOrder/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/findseeds' element={<FindSeeds/>} />
        <Route path='/loginsuccess' element={<LoginSuccess/>} />
        <Route path='/loginfailure' element={<LoginFailure/>} />
      </Routes>
    </Router>

  );
}

export default App;
