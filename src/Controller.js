import React, { Component } from 'react'

import Home from "../screens/home/Home";
import Checkout from "../screens/checkout/Checkout";
import Details from "../screens/details/Details";
import Profile from "../screens/profile/Profile";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
class Controller extends Component {
    constructor(){
        super();
        this.baseUrl= "http://localhost:8080/api/";
    }

    render(){
        return(
            <Router>
                <div className= "main-container">
                    {/* Routing to the Home page */}
                    <Route exact path="/" render={props=> <Home {...props} baseUrl={this.baseUrl}/>} />
                    {/* Routing to the restaurant details page */}
                    <Route exact path="/restaurant/:id" render={props=> <Details {...props} baseUrl={this.baseUrl}/>} />
                    {/* Routing to the checkout page */}
                    <Route path='/checkout' render={(props) => (
                        sessionStorage.getItem('customer-cart') === null ? (
                            <Redirect to='/' />
                        ) : (
                            <Checkout {...props} baseUrl={this.baseUrl} />
                        )
                    )} />
                    {/* Routing to the profile page */}
                    <Route exact path="/profile" render={props=> <Profile {...props} baseUrl={this.baseUrl}/>}/>
                </div>
            </Router>

        );
    }

}
export default Controller;