import React, { Component } from 'react';

//importing the header component
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';


class Home extends Component {
	
	constructor() {
        super();
        this.state = {
            restaurants: []
        }
    }

    render() {
        return (
			<div>
				<Header showSearchBox={true} searchHandler={this.searchHandler} baseUrl={this.props.baseUrl} />
				{this.state.restaurants.length === 0 && this.state.loading === false ? 
					<Typography variant="h6">No restaurant with given name.</Typography> :
					<div> Display Restaurants...</div>
				}
			</div>
        )
    }
	
	 searchHandler = (event) => {
         const _searchText = (event.target.value).toLowerCase();
		 let _restaurants = JSON.parse(JSON.stringify(this.state.restaurants));
         let _filteredRestaurants = [];
		 if(_restaurants !== null && _restaurants.length > 0){
			  _filteredRestaurants = _restaurants.filter((restaurant) => 
                 (restaurant.restaurant_name.toLowerCase()).indexOf(_searchText) > -1 
            );
			this.setState({
                restaurants: [..._filteredRestaurants]
            });
			 
		 }
	}
}

export default Home;