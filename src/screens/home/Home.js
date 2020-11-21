import React, { Component } from 'react';

//importing the header component
import Header from '../../common/header/Header';


class Home extends Component {

    render() {
        return (
                <div>
                    <Header showSearchBox={true} searchHandler={this.searchHandler} baseUrl={this.props.baseUrl} />
                </div>
        )
    }
}

export default Home;