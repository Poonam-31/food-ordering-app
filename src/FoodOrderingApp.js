import React, {Component} from 'react'

import {Route, Switch} from "react-router-dom";

import Home from './screens/home/Home';
import Profile from './screens/profile/Profile';
import Details from "./screens/details/Details";


class FoodOrderingApp extends Component {
    constructor() {
        super();
        this.baseUrl = 'http://localhost:8080/api/'
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' render={(props) => <Home {...props} baseUrl={this.baseUrl}/>}/>
                <Route exact path='/profile' render={(props) => <Profile {...props} />}/>
                <Route exact path='/restaurant/:restaurantId'
                       render={(props) => <Details {...props} baseUrl={this.baseUrl}/>}/>
            </Switch>
        )
    }
}

export default FoodOrderingApp;
