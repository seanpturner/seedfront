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
import Econ from './components/admin/Econ';
import CreateOrder from './components/admin/CreateOrder';
import Login from './components/public/login';
import Contact from './components/public/Contact';
import FindSeeds from './components/public/FindSeeds';
import LoginSuccess from './components/public/LoginSuccess';
import LoginFailure from './components/public/LoginFailure';
import CreationSuccess from './components/public/CreationSuccess';
import FAQ from './components/public/FAQ';
import ShoppingCart from './components/public/ShoppingCart';
import SendProps from './components/public/SendProps';
import ReceiveProps from './components/public/ReceiveProps';
import PaymentSuccess from './components/public/PaymentSuccess';
import OrderSuccess from './components/public/OrderSuccess';
import Messaging from './components/public/Messaging';
import Payment from './components/public/Payment';
import BulkUpdate from './components/admin/BulkUpdate';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/comments' element={<Comments/>}/>
        <Route path='/content' element={<Content/>}/>
        <Route path='/discounts' element={<Discounts/>}/>
        <Route path='/lines' element={<Lines/>}/>
        <Route path='/logins' element={<Logins/>}/>
        <Route path='/messages' element={<Messages/>}/>
        <Route path='/plants' element={<Plants/>}/>
        <Route path='/pricing' element={<Pricing/>}/>
        <Route path='/openorders' element={<OpenOrders/>}/>
        <Route path='/allorders' element={<AllOrders/>}/>
        <Route path='/seeds' element={<Seeds/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/shipper' element={<Shipper/>}/>
        <Route path='/econfirm' element={<Econ/>}/>
        <Route path='/createOrder' element={<CreateOrder/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/findseeds' element={<FindSeeds/>}/>
        <Route path='/loginsuccess' element={<LoginSuccess/>}/>
        <Route path='/loginfailure' element={<LoginFailure/>}/>
        <Route path='/creationsuccess' element={<CreationSuccess/>}/>
        <Route path='/faq' element={<FAQ/>}/>
        <Route path='/shoppingcart' element={<ShoppingCart/>}/>
        <Route path='/sendprops' element={<SendProps/>}/>
        <Route path='/receiveprops/:id/:otherid' element={<ReceiveProps/>}/>
        <Route path='/paymentSuccess/' element={<PaymentSuccess/>}/>
        <Route path='/orderSuccess/:locator' element={<OrderSuccess/>}/>
        <Route path='/messaging/:firstFilter' element={<Messaging/>}/>
        <Route path='/messaging' element={<Messaging/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/bulkupdate' element={<BulkUpdate/>}/>

      </Routes>
    </Router>

  );
}

export default App;
