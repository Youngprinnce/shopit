import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home';
import ProductDetails from './components/Product/ProductDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { loadUser} from './actions/userActions';
import store from './store'
import Profile from './components/user/Profile';
import ProtectedRoute from './components/routes/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import VerifyPayment from './components/cart/VerifyPayment';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';

const App = () => {

  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  
  return (
    <Router>
      <div className="App">
        <Header/>
        <div className='container container-fluid'>
          <Route path='/' component={Home} exact/>
          <Route path='/cart' component={Cart} exact/>
          <Route path='/search/:keyword' component={Home} exact/>
          <Route path='/product/:id' component={ProductDetails} exact/>
          <Route path='/login' component={Login}/>
          <Route path='/register' component={Register}/>
          <Route path='/password/forgot' component={ForgotPassword}/>
          <Route path='/password/reset/:token' component={NewPassword}/>
          <Route path='/payment/verify' component={VerifyPayment}/>
          <ProtectedRoute path='/orders/me' exact component={ListOrders}/>
          <ProtectedRoute path='/me' exact component={Profile}/>
          <ProtectedRoute path='/me/update' exact component={UpdateProfile}/>
          <ProtectedRoute path='/password/update' exact component={UpdatePassword}/>
          <ProtectedRoute path='/shipping' exact component={Shipping}/>
          <ProtectedRoute path='/order/confirm' exact component={ConfirmOrder}/>
          <ProtectedRoute path='/success' component={OrderSuccess}/>
          <ProtectedRoute path='/order/details/:id' exact component={OrderDetails}/>
        </div>
        <ProtectedRoute path='/dashboard' isAdmin={true} exact component={Dashboard}/>
        <Footer/>
      </div>
    </Router>
  )
};

export default App;


