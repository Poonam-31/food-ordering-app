import React, { Component } from 'react';

//importing the header component
import Header from '../../common/header/Header';

import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import '../font-awesome/css/font-awesome.min.css';

import './Home.css';

const styles = theme => ({
      media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
      },
      rating: {
          marginLeft: 10,
          color: 'white'
      },
      costForTwo: {
        marginLeft: 10
      }

})
class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurantList: [],
            restaurantName: ""
        }
    }

    componentWillMount(){
        // Get list of restaurants
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurantList: JSON.parse(this.responseText).restaurants
                });
            }
        });

        xhr.open("GET", this.props.baseUrl + "restaurant");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    searchHandler = event => {
        let that = this;
        let dataFilter = null;
        let xhrFilter = new XMLHttpRequest();
        xhrFilter.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurantList: JSON.parse(this.responseText).restaurants
                });
            }
        });

        xhrFilter.open("GET", this.props.baseUrl + "restaurant/name/" + event.target.value );
        xhrFilter.setRequestHeader("Cache-Control", "no-cache");
        xhrFilter.send(dataFilter);
    }
	
	 restaurantCardClicked = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }

    render() {
        const {classes} = this.props;
        return (
                <div>
                    <Header showSearchBox={true} searchHandler={this.searchHandler.bind(this)} baseUrl={this.props.baseUrl} />
                    {(this.state.restaurantList) != null ?

                <div className="flex-main-container">
                {this.state.restaurantList.map(restaurant => (
                    <Card className="restaurant-card" key={restaurant.id} onClick={() => this.restaurantCardClicked(restaurant.id)}>
                        <CardMedia
                            className={classes.media}
                            image={restaurant.photo_URL}
                            title={restaurant.restaurant_name}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {restaurant.restaurant_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {restaurant.categories}
                        </Typography>
                        <div className="ratingCurrencyContainer">
                            <div className="averageRating">
                                <FontAwesomeIcon icon={faStar} />
                                <Typography className={classes.rating} variant="body2" color="textSecondary" component="p">
                                {restaurant.customer_rating} ({restaurant.number_customers_rated})
                                </Typography>
                            </div>
                            <div className="currency">
                                <FontAwesomeIcon icon={faRupeeSign} />
                                <Typography className={classes.costForTwo} variant="body2" color="textSecondary" component="p">
                                {restaurant.average_price} for two
                                </Typography>
                            </div>
                        </div>
                        </CardContent>
                    </Card>

                ))}                       

                </div>
                :
                // else case for no restaurant found
                <div className="flex-main-container">
                    <p> No restaurant with the given name </p>
                </div>
                                
                }
                                    
                </div>

        )
    }
	
	
}

export default withStyles(styles) (Home);