import React, { Component } from 'react';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import { withStyles, CardContent } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free-regular';
import "./Details.css"


const styles = (theme => ({

    textRatingCost: { 
        'text-overflow': 'clip',
        'width': '145px',
        'color': 'grey'
    },
    restaurantName: { 
        'padding': '8px 0px 8px 0px',
        'font-size': '30px',
    },
    restaurantCategory: {
        'padding': '8px 0px 8px 0px'
    }, 
    avgCost: { 
        'padding-left': '5px'
    },
    itemPrice: { 
        'padding-left': '5px'
    },
    addButton: { 
        'margin-left': '25px',
    },
    menuItemName: { 
        'margin-left': '20px',
    },

    shoppingCart: { 
        color: 'black',
        'background-color': 'white',
        width: '60px',
        height: '50px',
        'margin-left': '-20px',
    },
    cartHeader: { 
        'padding-bottom': '0px',
        'margin-left': '10px',
        'margin-right': '10px'
    },
    cartItemButton: { 
        padding: '10px',
        'border-radius': '0',
        color: '#fdd835',
        '&:hover': {
            'background-color': '#ffee58',
        }
    },
    cardContent: { 
        'padding-top': '0px',
        'margin-left': '10px',
        'margin-right': '10px'
    },
    totalAmount: { 
        'font-weight': 'bold'
    },
    checkOutButton: { 
        'font-weight': '400'
    }




}))





// Creating Details class for home page 

class Details extends Component {
    constructor() {
        super()
        this.state = {
            restaurantDetails: [],
            categories: [],
            cartItems: [],
            totalAmount:0,
            snackBarOpen: false,
            snackBarMessage: "",
            transition: Fade,
            badgeVisible:false,
        }
    }


    //This method calls the api to get restaurant by rest id endpoints and updates the state with the relevant details.
    //Then the page is re-rendered with the data received from the api. 
    componentDidMount() {
        let data = null;
        let that = this;
        let xhrRestaurantDetails = new XMLHttpRequest()


        xhrRestaurantDetails.addEventListener("readystatechange", function () {
            if (xhrRestaurantDetails.readyState === 4 && xhrRestaurantDetails.status === 200) {
                let response = JSON.parse(xhrRestaurantDetails.responseText);
                let categoriesName = [];
                //Creating array of category.
                response.categories.forEach(category => {
                    categoriesName.push(category.category_name);
                });
                //Creating Restaurant object containing relevant details.
                let restaurantDetails = {
                    id: response.id,
                    name: response.restaurant_name,
                    photoURL: response.photo_URL,
                    avgCost: response.average_price,
                    rating: response.customer_rating,
                    noOfCustomerRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categoriesName: categoriesName.toString(),
                }
                let categories = response.categories;
                that.setState({
                    ...that.state,
                    restaurantDetails: restaurantDetails,
                    categories: categories,

                })
            }

        })

        //Calling the api to get details of the restaurant by id.
        xhrRestaurantDetails.open('GET', this.props.baseUrl + 'restaurant/' + this.props.match.params.id)
        xhrRestaurantDetails.send(data);

    }


    //This Method handles the add item button in the menu list.
   
    itemAddButtonClickHandler = (item) => {
        let cartItems = this.state.cartItems;
        let itemPresentInCart = false;
        cartItems.forEach(cartItem => { 
            if (cartItem.id === item.id) { 
                itemPresentInCart = true;
                cartItem.quantity++; 
                cartItem.totalAmount = cartItem.price * cartItem.quantity; 
            }
        })
        if (!itemPresentInCart) { 
            let cartItem = {
                id:item.id,
                name: item.item_name,
                price: item.price,
                totalAmount:item.price,
                quantity: 1,
                itemType: item.item_type,
            }
            cartItems.push(cartItem);
        }
        let totalAmount = 0;
        cartItems.forEach(cartItem =>{
            totalAmount = totalAmount + cartItem.totalAmount; 
        })

        //Updating the state.
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item added to cart!",
            totalAmount:totalAmount,
        
        })
    }

    //This Method is called when the minus button in the cart is clicked.
    minusButtonClickHandler =  (item) => {
        let cartItems = this.state.cartItems;
        let index =  cartItems.indexOf(item);
        let itemRemoved = false;
        cartItems[index].quantity--; //Reducing the quantity of the item
        if(cartItems[index].quantity === 0){ //Checking if the quantity is zero to remove from the cart
            cartItems.splice(index,1);
            itemRemoved = true;
        }else{
            cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity; //Updating the Price of the item
        }

        // updating the total amount of the cart
        let totalAmount = 0;
        cartItems.forEach(cartItem =>{
            totalAmount = totalAmount + cartItem.totalAmount;
        })

        //Updating the state
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: itemRemoved ? "Item removed from cart!" :"Item quantity decreased by 1!",
            totalAmount:totalAmount,

        })
    }

    //This method is called when the add button in the cart is clicked.
   
    cartAddButtonClickHandler = (item) => {
        let cartItems = this.state.cartItems;
        let index =  cartItems.indexOf(item);
        cartItems[index].quantity++; //Updating the quantity
        cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity; //updating the total price of the item
        
        //Updating the Total amount ofthe cart 
        let totalAmount = 0;
        cartItems.forEach(cartItem =>{
            totalAmount = totalAmount + cartItem.totalAmount;
        })

        //Updating the state
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item quantity increased by 1!",
            totalAmount:totalAmount,

        })
    } 

    //This Method is called when the checkout button in the cart is clicked
    checkOutButtonClickHandler= () => {
        let cartItems =  this.state.cartItems;
        let isLoggedIn = sessionStorage.getItem("access-token") == null ? false : true;
        if(cartItems.length === 0){ //Checking if cart is empty 
            this.setState({
            ...this.state,
            snackBarOpen: true,
            snackBarMessage: "Please add an item to your cart!",
            })
        }else if(!isLoggedIn){ //Checking if customer is not loggedIn.
            this.setState({
                ...this.state,
                snackBarOpen: true,
                snackBarMessage: "Please login first!",
            })
        }else{ //If all the condition are satisfied user pushed to the checkout screen
            this.props.history.push({
                pathname: '/checkout',
                cartItems: this.state.cartItems,
                restaurantDetails: this.state.restaurantDetails,
            })
        }
    }


    snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        })
    }

    changeBadgeVisibility = () => {
        this.setState({
            ...this.state,
            badgeVisible:!this.state.badgeVisible,
        })
    }

render() {
    const { classes } = this.props;
    return (

        <div>
            {/* Rendering the header and passing the parameter showHeaderSearchBox as false to not render the searchBox 
            also changeBadgeVisibility function is passed to change the visibility when the modal is open. */}
            <Header baseUrl={this.props.baseUrl} showHeaderSearchBox={false} changeBadgeVisibility = {this.changeBadgeVisibility}></Header>
            {/* Restaurant Details Container */}
            <div className="restaurant-details-container">
                <div>
                    <img src={this.state.restaurantDetails.photoURL} alt="Restaurant" height="215px" width="275px" />
                </div>
                <div className="restaurant-details">
                    <div className="restaurant-name">
                        <Typography variant="h5" component="h5" className={classes.restaurantName}>{this.state.restaurantDetails.name}</Typography>
                        <Typography variant="subtitle1" component="p" className={classes.restaurantLocation}>{this.state.restaurantDetails.locality}</Typography>
                        <Typography variant="subtitle1" component="p" className={classes.restaurantCategory}>{this.state.restaurantDetails.categoriesName}</Typography>
                    </div>
                    <div className="restaurant-rating-cost-container">
                        <div className="restaurant-rating-container">
                            <div className="restaurant-rating">
                                <FontAwesomeIcon icon="star" size="sm" color="black" />
                                <Typography variant="subtitle1" component="p">{this.state.restaurantDetails.rating}</Typography>
                            </div>
                            <Typography variant="caption" component="p" className={classes.textRatingCost}  >AVERAGE RATING BY {<span className="restaurant-NoOfCustomerRated">{this.state.restaurantDetails.noOfCustomerRated}</span>} CUSTOMERS</Typography>
                        </div>
                        <div className="restaurant-avg-cost-container">
                            <div className="restaurant-avg-cost">
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                <Typography variant="subtitle1" component="p" className={classes.avgCost}>{this.state.restaurantDetails.avgCost}</Typography>
                            </div>
                            <Typography variant="caption" component="p" className={classes.textRatingCost} >AVERAGE COST FOR TWO PEOPLE</Typography>
                        </div>
                    </div>
                </div>
            </div>
            {/* Menu and Cart Card Container */}
            <div className="menu-details-cart-container">

                <div className="menu-details">
                    {this.state.categories.map(category => ( //Iterating for each category in the categories array to display each category
                        <div key={category.id}>
                            <Typography variant="overline" component="p" className={classes.categoryName} >{category.category_name}</Typography>
                            <Divider />
                            {category.item_list.map(item => ( //Iterating over each item to display each items in the category.
                                <div className='menu-item-container' key={item.id}>
                                    <FontAwesomeIcon icon="circle" size="sm" color={item.item_type === "NON_VEG" ? "#BE4A47" : "#5A9A5B"} />
                                    <Typography variant="subtitle1" component="p" className={classes.menuItemName} >{item.item_name[0].toUpperCase() + item.item_name.slice(1)}</Typography>
                                    <div className="item-price">
                                        <i className="fa fa-inr" aria-hidden="true"></i>
                                        <Typography variant="subtitle1" component="p" className={classes.itemPrice} >{item.price.toFixed(2)}</Typography>
                                    </div>
                                    <IconButton className={classes.addButton} aria-label="add" onClick={() => this.itemAddButtonClickHandler(item)}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {/* Cart Card */}
                <div className="my-cart">
                    <Card className={classes.myCart}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="shopping-cart" className={classes.shoppingCart}>
                                    <Badge badgeContent={this.state.cartItems.length} color="primary" showZero = {true} invisible={this.state.badgeVisible} className={classes.badge}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                </Avatar>
                            }
                            title="My Cart"
                            titleTypographyProps={{
                                variant: 'h6'
                            }}
                            className={classes.cartHeader}
                        />
                        <CardContent className={classes.cardContent}>
                            {this.state.cartItems.map(cartItem => ( //Iterating over each item in cartItem to show in the cart.
                            <div className="cart-menu-item-container" key={cartItem.id}>
                                <i className="fa fa-stop-circle-o" aria-hidden="true" style={{color:cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B"}}></i>
                                <Typography variant="subtitle1" component="p" className={classes.menuItemName} id="cart-menu-item-name" >{cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}</Typography>
                                <div className="quantity-container">
                                <IconButton className={classes.cartItemButton} id="minus-button" aria-label="remove" onClick = {() => this.minusButtonClickHandler(cartItem)} >
                                    <FontAwesomeIcon icon="minus" size="xs" color="black" />
                                </IconButton>
                                <Typography variant="subtitle1" component="p" className={classes.itemQuantity}>{cartItem.quantity}</Typography>
                                <IconButton className={classes.cartItemButton} aria-label="add"  onClick = {() => this.cartAddButtonClickHandler(cartItem)}>
                                    <FontAwesomeIcon icon="plus" size="xs" color="black" />
                                </IconButton>
                                </div>
                                <div className="item-price">
                                    <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                                    <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                                </div>
                            </div>
                            ))}
                            <div className="total-amount-container">
                                <Typography variant="subtitle2" component="p" className={classes.totalAmount}>TOTAL AMOUNT</Typography>
                                <div className="total-price">
                                    <i className="fa fa-inr" aria-hidden="true" ></i>
                                    <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-total-price">{this.state.totalAmount.toFixed(2)}</Typography>
                                </div>
                            </div>

                            <Button variant="contained" color='primary' fullWidth={true} className={classes.checkOutButton} onClick = {this.checkOutButtonClickHandler}>CHECKOUT</Button>
                        </CardContent>

                    </Card>
                </div>
            </div>
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={4000}
                    onClose={this.snackBarClose}
                    TransitionComponent={this.state.transition}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackBarMessage}</span>}
                    action={
                        <IconButton color='inherit' onClick={this.snackBarClose}>
                            <CloseIcon/>
                        </IconButton>
                    }
                />
            </div>
        </div>
    )
}
}

export default withStyles(styles)(Details);