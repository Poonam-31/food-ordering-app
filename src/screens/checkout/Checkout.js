import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './Checkout.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormControl';
import Input from "@material-ui/core/Input";
import FormLabel from '@material-ui/core/FormLabel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { InputLabel } from '@material-ui/core';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import validator from 'validator';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free-regular';
import { Divider } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import { Redirect } from 'react-router-dom';

import '../font-awesome/css/font-awesome.min.css';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  itemPrice: {
    'padding-left': '5px'
  },
  totalAmount: {
    'font-weight': 'bold'
  },
  menuItemName: {
    'margin-left': '20px',
  },
  cardContent: {
    'padding-top': '0px',
    'margin-left': '10px',
    'margin-right': '10px'
  },
  cartHeader: {
    'padding-bottom': '0px',
    'margin-left': '10px',
    'margin-right': '10px'
  },
})

class Checkout extends Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      value: "0",
      flatNo: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
      paymentData: [],
      flatNoMessage: "dispNone",
      localityMessage: "dispNone",
      cityMessage: "dispNone",
      stateMessage: "dispNone",
      pinCodeMessage: "dispNone",
      stateData: [],
      pinCodeErrorMessage: "required",
      AddressData: [],
      isFinished: false,
      isPaymentSelected: false,
      isAddressAvailable: false,
      cartItems: [],
      orderStatus: true,
    }
  }

  getStates = () => {
    let data = null;
    let that = this;
    let xhrStates = new XMLHttpRequest();
    xhrStates.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let responseData = JSON.parse(this.responseText).states;
        that.setState({
          stateData: responseData
        });
      }
    });

    xhrStates.open("GET", "http://localhost:8080/api/" + "states");
    xhrStates.send(data);
  }

  getSteps = (index) => {
    return ['Delivery', 'Payment'];
  }

  handleNext = () => {
    let element = document.getElementsByClassName('MuiSvgIcon-root MuiSvgIcon-fontSizeSmall');
    for (let item of element) {
      let x = item.getElementsByTagName('path');
      if (x[0].style.color === 'green') {
        this.setState(() => {
          return { activeStep: 0 + 1 }
        });
      }
    }
  };

  handleBack = () => {
    this.setState(() => {
      return { activeStep: 0 }
    });
  };

  handleFinish = () => {
    if (this.state.isPaymentSelected === true) {
      this.setState(() => {
        return {
          activeStep: 2,
          isFinished: true
        }
      });
    }
  }

  handleReset = () => {
    this.setState(() => {
      return { activeStep: 0 }
    });
  };
  handleChange = (event, newValue) => {
    this.setState(() => {
      return { value: newValue }
    });
  };

  inputFlatNoChangeHandler = (e) => {
    this.setState({ flatNo: e.target.value });
    this.state.flatNo === "" ? this.setState({ flatNoMessage: "dispBlock" }) : this.setState({ flatNoMessage: "dispNone" });
  }

  inputLocalityChangeHandler = (e) => {
    this.setState({ locality: e.target.value });
    this.state.locality === "" ? this.setState({ localityMessage: "dispBlock" }) : this.setState({ localityMessage: "dispNone" });
  }
  inputCityChangeHandler = (e) => {
    this.setState({ city: e.target.value });
    this.state.city === "" ? this.setState({ cityMessage: "dispBlock" }) : this.setState({ cityMessage: "dispNone" });
  }
  inputStateChangeHandler = (e) => {
    this.setState({ state: e.target.value });
    this.state.state === "" ? this.setState({ stateMessage: "dispBlock" }) : this.setState({ stateMessage: "dispNone" });
  }
  inputPinCodeChangeHandler = (e) => {
    this.setState({ pincode: e.target.value });

    this.state.pincode === "" ? this.setState({ pinCodeMessage: "dispBlock", pinCodeErrorMessage: "required" })
      : ((!(validator.isNumeric(this.state.pincode))) || this.state.pincode.length !== 6) ? this.setState({ pinCodeErrorMessage: "Pincode must contain only numbers and must be 6 digits long", pinCodeMessage: "dispBlock" })
        : this.setState({ pinCodeMessage: "dispNone", pinCodeErrorMessage: "" });
  }

  addressClickHandler = () => {
    let that = this;
    that.state.flatNo === "" ? that.setState({ flatNoMessage: "dispBlock" }) : that.setState({ flatNoMessage: "dispNone" });
    that.state.locality === "" ? that.setState({ localityMessage: "dispBlock" }) : that.setState({ localityMessage: "dispNone" });
    that.state.city === "" ? that.setState({ cityMessage: "dispBlock" }) : that.setState({ cityMessage: "dispNone" });
    that.state.state === "" ? that.setState({ stateMessage: "dispBlock" }) : that.setState({ stateMessage: "dispNone" });
    that.state.pincode === "" ? that.setState({ pinCodeMessage: "dispBlock", pinCodeErrorMessage: "required" })
      : ((!(validator.isNumeric(that.state.pincode))) || that.state.pincode.length !== 6) ? that.setState({ pinCodeErrorMessage: "Pincode must contain only numbers and must be 6 digits long", pinCodeMessage: "dispBlock" })
        : that.setState({ pinCodeMessage: "dispNone", pinCodeErrorMessage: "" });
    let stateUid = ""
    for (let data of that.state.stateData) {
      if (that.state.state === data.state_name) {
        stateUid = data.id;
        break;
      }
    }

    let addressData = JSON.stringify({
      "flat_building_name": that.state.flatNo,
      "locality": that.state.locality,
      "city": that.state.city,
      "state_uuid": stateUid,
      "pincode": that.state.pincode
    });

    let xhrAddress = new XMLHttpRequest();
    xhrAddress.addEventListener("readystatechange", function () {
      if (that.readyState === 4) {
        let responseText = JSON.parse(that.responseText);
        if (that.status === 201) {
          that.setState({
            value: 0
          });
          that.clearAddressForm();
        }
      }
    });
    let url = "http://localhost:8080/api/" + 'address'
    xhrAddress.open("POST", url);
    xhrAddress.setRequestHeader("Content-Type", "application/json");
    xhrAddress.setRequestHeader("authorization", "Bearer " + sessionStorage.getItem("access-token"));
    xhrAddress.setRequestHeader("Cache-Control", "no-cache");
    xhrAddress.send(addressData);

  }

  placeOrderButtonClickHandler = () => {
    let that = this;
    let xhrOrder = new XMLHttpRequest();
    let data = null;
    xhrOrder.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let responseText = JSON.parse(this.responseText);

        if (this.status === 201) {
          that.setState({
            orderStatus: true
          });
        }
        else {
          that.setState({
            orderStatus: false
          });
        }
      }
    });
    let url = "http://localhost:8080/api/" + 'order'
    xhrOrder.open("GET", url);
    xhrOrder.setRequestHeader("Content-Type", "application/json");
    xhrOrder.setRequestHeader("authorization", "Bearer " + sessionStorage.getItem("access-token"));
    xhrOrder.setRequestHeader("Cache-Control", "no-cache");
    xhrOrder.send(data);
  }

  paymentSelection = () => {
    this.setState(() => {
      return { isPaymentSelected: true }
    });
  };

  getAddress = () => {
    let that = this;
    let xhrAddress = new XMLHttpRequest();
    let data = null;
    xhrAddress.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let responseData = JSON.parse(this.responseText).addresses;
        that.setState({
          AddressData: responseData
        });
        if (responseData != undefined) {
          if (responseData.length > 0) {
            that.setState({ isAddressAvailable: true });
          }
          else {
            that.setState({ isAddressAvailable: false });
          }
        }
      }
    });
    let url = "http://localhost:8080/api/" + 'address/customer'
    xhrAddress.open("GET", url);
    xhrAddress.setRequestHeader("Content-Type", "application/json");
    xhrAddress.setRequestHeader("authorization", "Bearer " + sessionStorage.getItem("access-token"));
    xhrAddress.send(data);
  }

  clearAddressForm = () => {
    this.setState({
      flatNo: "",
      flatNoMessage: "dispNone",
      city: "",
      cityMessage: "dispNone",
      state: [],
      stateMessage: "dispNone",
      pincode: "",
      pinCodeMessage: "dispNone",
      pinCodeErrorMessage: "",
      locality: "",
      localityMessage: "dispNone",
    });
  }

  onCircleClick = (e) => {
    let element = document.getElementsByClassName('MuiSvgIcon-root MuiSvgIcon-fontSizeSmall');
    for (let item of element) {
      let x = item.getElementsByTagName('path');
      x[0].style.color = 'grey';
    }
    if (e.target != null) {
      e.target.style.color = 'green';
    }
  }

  componentWillMount() {
    let data = null;
    let xhrPayment = new XMLHttpRequest();
    let that = this;
    xhrPayment.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let responseData = JSON.parse(this.responseText).paymentMethods;
        that.setState({
          paymentData: responseData
        });
      }
    });

    xhrPayment.open("GET", "http://localhost:8080/api/" + "payment");
    xhrPayment.send(data);
    this.getStates();
    this.getAddress();
  }


  render() {
    const { classes } = this.props;
    if (this.props.location.state === undefined || sessionStorage.getItem('access-token') === null) {
      return <Redirect to='/' />
    }
    return (
      <div className="parent">
        <Header showSearchBox={false} searchHandler={this.searchHandler} baseUrl={this.props.baseUrl} />
        <div className="right">
          <Stepper activeStep={this.state.activeStep} orientation="vertical">
            <Step key="Delivery">
              <StepLabel>Delivery</StepLabel>
              <StepContent>
                <TabContext value={this.state.value}>
                  <AppBar position="static">
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}>
                      <Tab label="Existing Address" value="0" />
                      <Tab label="New Address" value="1" />
                    </Tabs>
                  </AppBar>

                  <TabPanel value="0" className={classes.root}>
                    {this.state.isAddressAvailable === false && (
                      <paper square elevation={0}>
                        <Typography>
                          There are no saved addressed ! You can save an address using the 'New Address' tab or using your 'Profile' menu option.
                      </Typography>
                      </paper>
                    )}

                    {this.state.isAddressAvailable === true && (
                      <Paper square elevation={0}>
                        <GridList cellHeight={25} cols={3} className={classes.gridList}>
                          {this.state.AddressData.map(image => (
                            <GridListTile key={image.id} rows={7}>
                              <Typography>
                                {image.flat_building_name}
                              </Typography>
                              <Typography>
                                {image.locality}
                              </Typography>
                              <Typography>
                                {image.city}
                              </Typography>
                              <Typography>
                                {image.state.state_name}
                              </Typography>
                              <Typography>
                                {image.pincode}
                              </Typography>
                              <Typography>
                                <IconButton size="small" className={classes.circle}
                                  onClick={this.onCircleClick}>
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Typography>
                            </GridListTile>
                          ))}
                        </GridList>
                      </Paper>
                    )}
                  </TabPanel>
                  <TabPanel value="1">
                    <FormControl required>
                      <InputLabel htmlFor="flat">Flat / Building No</InputLabel>
                      <Input id="flat" type="text" value={this.state.flatNo}
                        flat={this.state.flatNo} onChange={this.inputFlatNoChangeHandler} />
                      <FormHelperText className={this.state.flatNoMessage}>
                        <span className="red">required</span>
                      </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                      <InputLabel htmlFor="locality">Locality</InputLabel>
                      <Input id="locality" type="text" value={this.state.locality}
                        locality={this.state.locality} onChange={this.inputLocalityChangeHandler} />
                      <FormHelperText className={this.state.localityMessage}>
                        <span className="red">required</span>
                      </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <Input id="city" type="text" value={this.state.city}
                        city={this.state.city} onChange={this.inputCityChangeHandler} />
                      <FormHelperText className={this.state.cityMessage}>
                        <span className="red">required</span>
                      </FormHelperText>
                    </FormControl><br /><br />
                    <FormControl required>
                      <InputLabel htmlFor="state">State</InputLabel>
                      <Select value={this.state.state} onChange={this.inputStateChangeHandler}>
                        {this.state.stateData.map(x => (
                          <MenuItem key={"state" + x.id} value={x.state_name}>
                            {x.state_name}
                          </MenuItem>
                        )

                        )}
                      </Select>
                      <FormHelperText className={this.state.stateMessage}>
                        <span className="red">required</span>
                      </FormHelperText>
                    </FormControl><br /><br />
                    <FormControl required>
                      <InputLabel htmlFor="pincode">Pincode</InputLabel>
                      <Input id="pincode" type="text" value={this.state.pincode}
                        pincode={this.state.pincode} onChange={this.inputPinCodeChangeHandler} />
                      <FormHelperText className={this.state.pinCodeMessage}>
                        <span className="red">{this.state.pinCodeErrorMessage}</span>
                      </FormHelperText>
                    </FormControl><br /><br />
                    <Button variant="contained" color="secondary" onClick={this.addressClickHandler}>SAVE ADDRESS</Button>
                  </TabPanel>
                </TabContext>
                <br></br>
                <div className="actionsContainer">
                  <div>
                    <Button
                      disabled={this.state.activeStep === 0}
                      onClick={this.handleBack} >
                      Back
                  </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext} className="button">
                      {'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
            <Step key="Payment">
              <StepLabel>Payment</StepLabel>
              <StepContent>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select Mode of Payment</FormLabel>
                  <RadioGroup aria-label="payment" name="payment" label="payment" onChange={this.paymentSelection}>
                    {this.state.paymentData.map(x => (
                      <FormControlLabel value={x.payment_name} control={<Radio />} label={x.payment_name} />
                    ))
                    }
                  </RadioGroup>
                </FormControl>

                <div className="actionsContainer">
                  <div>
                    <Button
                      onClick={this.handleBack} >
                      Back
                  </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleFinish} className="button">
                      {'Finish'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>

          </Stepper>

          {this.state.isFinished === true && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>View the summary & place your order now!</Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Change
          </Button>
            </Paper>
          )}

        </div>
        <div className="left">
          <Card variant="outlined">
            <CardHeader className={classes.cartHeader} title="SUMMARY" titleTypographyProps={{
              variant: 'h6'
            }}>
            </CardHeader><br />
            <CardContent className={classes.cardContent}>
              <Typography variant='h6' component='h3' color='textSecondary'
                style={{ textTransform: "capitalize", marginBottom: 15 }}>
                {this.props.location.state.restaurantName}
              </Typography>
              {(this.props.location.state.orderItems.items || []).map((item) => (
                <Grid key={item.id} container>
                  <Grid item xs={1}>
                    <i className="fa fa-stop-circle-o icon-type" aria-hidden="true"
                      style={item.type === 'VEG' ? { color: "green" } : { color: "red" }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color='textSecondary' style={{ textTransform: "capitalize" }}>
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography color='textSecondary'>
                      {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography color='textSecondary'>
                      <i className="fa fa-inr" aria-hidden="true"></i>
                      {item.priceForAll.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
              <Divider variant="inset" /><br />
              <Grid container>
                <Grid item xs={9}>
                  <Typography color='textPrimary'>
                    Net Amount
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                  <div className='payable-bill-amount'>
                    <Typography color='textSecondary'>
                      <i className="fa fa-inr" aria-hidden="true"></i>
                    </Typography>
                    <Typography style={{ marginRight: 10 }} color='textPrimary'>
                      {Number(this.props.location.state.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <FormControl className='place-order-button'>
                    <Button variant="contained" color="primary" onClick={this.placeOrderButtonClickHandler}>PLACE ORDER</Button>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Checkout);

