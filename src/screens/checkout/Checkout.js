import React, { Component } from "react";
import Header from "../../common/header/Header";
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';
import * as Utils from '../../common/Utils';
import * as Constants from '../../common/Constants';

import { withStyles } from "@material-ui/core/styles";
import { border } from '@material-ui/system';


//Stepper
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";

//Tabs
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { FormControl, InputLabel, Input, Select, AppBar } from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';

import SummaryCard from './SummaryCard';
import CustomerAddress from './CustomerAddress';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = muiBaseTheme => ({
  root: {
    width: "100%"
  },
  button: {
    marginTop: muiBaseTheme.spacing(),
    marginRight: muiBaseTheme.spacing()
  },
  actionsContainer: {
    marginBottom: muiBaseTheme.spacing(2)
  },
  resetContainer: {
    padding: muiBaseTheme.spacing(3)
  },
  connector: {
    display: "none"
  },
  step: {
    marginBottom: muiBaseTheme.spacing(5)
  },
  iconContainer: {
    transform: "scale(2)",
    marginRight: muiBaseTheme.spacing(5)
  },
  formControl:{
      width:"90%",
      minWidth:120
  },
  saveAddressButton:{
      display:"block",
      marginTop:30
  },
  summaryCard:{
    marginLeft:"-10px;"
  },
  divider:{
    marginTop:"10px",
    marginBottom:"10px",
    marginLeft:"auto"
  } 
});

const access_token = "eyJraWQiOiI5ZmIzNDkyOC1hYTkzLTQ1ZjAtOTVhNi0wYzg5YjNkZmQ1MmQiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiIzNzU2ZDRjYy0wODZmLTQxZWEtYWE5Mi02OTBjZDFkNWFmNzIiLCJpc3MiOiJodHRwczovL0Zvb2RPcmRlcmluZ0FwcC5pbyIsImV4cCI6MTU2MTkyNSwiaWF0IjoxNTYxODk2fQ.28egiqghFsWqlcyH8QWbU9-JsP-fioXXwslVfelHoCmJyo95mFVb9PHgmdRVTrTqizPOIYwk3hscvdrXM-gikw";
const req_header = {
  "Accept": "application/json;charset=UTF-8",
  "authorization": "Bearer " +  access_token,
  "Access-Control-Allow-Origin" : "*",
  "Content-Type": "application/json" 
}

const cust_address = [ { "id": "7b3fe6a4-6add-428f-8ba4-7428497270eb", "flat_building_name": "a-509", "locality": "BKC", "city": "bandra", "pincode": "400020", "state": { "id": "c860e78a-a29b-11e8-9a3a-720006ceb890", "state_name": "Maharashtra" } }, { "id": "cf38c624-4145-4a17-a15b-c4dc49fdeb73", "flat_building_name": "c-509", "locality": "Gopal Nager", "city": "worli", "pincode": "400018", "state": { "id": "c860e78a-a29b-11e8-9a3a-720006ceb890", "state_name": "Maharashtra" } } ]

function TabContainer(props) {
    return (
        <Typography component={'div'} variant={'body2'} style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

function getSteps() {
  return ["Delivery", "Payment"];
}

const baseURL = "http://localhost:8080/api/";

class Checkout extends Component {    
    constructor(){
        super();
        this.state = {            
            value:0, 
            activeStep : 0,            
            dataAddress:[],           
            selected:0,
            dataPayments:[],
            paymentMethod:"",
            dataStates:[], 
            flatBldNo : "",
            flatBldNoRequired : 'dispNone',
            locality:"",
            localityRequired : 'dispNone',
            city:"",
            cityRequired : 'dispNone',
            pincode:"",
            pincodeRequired : 'dispNone',
            saveAddressSuccess : false,
            saveAddressError : 'dispNone',
            saveAddressErrorMsg : '',
            checkOutAddressRequired : 'dispNone',
            selAddress : ""
        };
    }
    renderOptions() {
        return this.state.data.map((dt, i) => {         
          return (
              <MenuItem
                label="Select a country"
                value={dt.country_code}
               key={i} name={dt.country_name}>{dt.country_name}</MenuItem>
            
          );
        });
    }
      getAddresses(baseURL, access_token){      
      let data = null   
      let xhrAddresses = new XMLHttpRequest();
      let that = this;
      xhrAddresses.addEventListener("readystatechange", function () {  
          if (this.readyState === 4) {                                      
                let address = JSON.parse(xhrAddresses.response); 
                that.setState({dataAddress: address["addresses"]});
                
          }
      })
      xhrAddresses.open("GET", baseURL + "address/customer");
      xhrAddresses.setRequestHeader("Authorization", "Bearer " + access_token); //sessionStorage.getItem('access-token')
      xhrAddresses.setRequestHeader("Content-Type", "application/json");
      xhrAddresses.setRequestHeader("Cache-Control", "no-cache");
      xhrAddresses.setRequestHeader("Access-Control-Allow-Origin", "*");  
      xhrAddresses.send(data);
    }
    getStates(){
      const url = baseURL + 'states'
      const that = this;

      Utils.makeApiCall(
        url, 
        null,
        null,
        Constants.ApiRequestTypeEnum.GET,
        null,
        responseText => {
          that.setState({
            dataStates : JSON.parse(responseText).states
          })
          }
        )
    }
    getPaymentMethods(){
      const url = baseURL + 'payment'
      const that = this;
    
      Utils.makeApiCall(
        url, 
        null,
        null,
        Constants.ApiRequestTypeEnum.GET,
        req_header,
        responseText => {
          that.setState({
            dataPayments : JSON.parse(responseText).paymentMethods
          })
          }
        )
    }
    onStateChange = (event) => {
        this.setState({selected:event.target.value})
    };

    componentDidMount(){
      this.getAddresses(baseURL, access_token);
      this.getPaymentMethods();
      this.getStates();
    }

    handleChange = (event) => {
      this.setState({paymentMethod:event.target.value})
      sessionStorage.setItem("paymentMethod", event.target.value);
    }

    flatBldNoChangeHandler = (e) => {
      this.setState({ flatBldNo: e.target.value })    
    }
    localityChangeHandler = (e) => {
      this.setState({locality : e.target.value })
    }
    cityChangeHandler = (e) => { 
      this.setState({city : e.target.value })
    }
    pinCodeChangeHandler = (e) => {
      this.setState({pincode : e.target.value })
    }
    addressClickHandler = () =>    
    {
      this.state.flatBldNo === "" ? this.setState({ flatBldNoRequired: "dispBlock" }) : this.setState({ flatBldNoRequired: "dispNone" });      
      this.state.locality === "" ? this.setState({ localityRequired: "dispBlock" }) : this.setState({ localityRequired: "dispNone"});
      this.state.city === "" ? this.setState({ cityRequired: "dispBlock" }) : this.setState({ cityRequired: "dispNone" });
      this.state.pincode === "" ? this.setState({ pincodeRequired: "dispBlock" }) : this.setState({ pincodeRequired: "dispNone" });
      this.state.selected === 0 ? this.setState({ stateRequired: "dispBlock" }) : this.setState({ stateRequired: "dispNone" });
      
      if(this.state.flatBldNo === "" || this.state.locality === "" || this.state.city === "" || this.state.pincode === ""  || this.state.selected === ""){return}
      
      let dataAddress = JSON.stringify({            
          "city": this.state.city,
          "flat_building_name": this.state.flatBldNo,
          "locality": this.state.locality,
          "pincode": this.state.pincode,
          "state_uuid": this.state.selected       
      })
      let that = this;
      let xhrSaveAddress = new XMLHttpRequest();
      xhrSaveAddress.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {              
              let saveAddressResponse = JSON.parse(this.response);
              if(saveAddressResponse.code === 'SAR-002' || saveAddressResponse.code === 'SAR-002'){
                that.setState({saveAddressError : "dispBlock"});
                that.setState({"saveAddressErrorMsg":saveAddressResponse.message});            
              }else{
                that.setState({ saveAddressSuccess: true });                
              }
          }
      })
  
      xhrSaveAddress.open("POST", this.props.baseUrl + "address");
      xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
      xhrSaveAddress.setRequestHeader("Cache-Control", "no-cache");
      xhrSaveAddress.setRequestHeader("Access-Control-Allow-Origin", "*");  
      xhrSaveAddress.send(dataAddress);  
    }
    addressChangeHandler = () => {
        this.setState({selAddress: sessionStorage.getItem("selected")});
    }
    checkoutHandler = () => {      
      let dataItem = [];      
      if(this.state.selAddress == ""){
        this.setState({saveOrderResponse : "Please select Address"})        
        this.openMessageHandler();   
        return;                        
      }else if(this.state.paymentMethod === ""){
        this.setState({saveOrderResponse : "Please select payment method"})        
        this.openMessageHandler();                   
        return;
      }
      
      let orders = JSON.parse(localStorage.getItem("orders"));            
      let dataCheckout = JSON.stringify({                    
          "address_id": this.state.selAddress,
          "bill": localStorage.getItem("OrderDataTotal"),
          "coupon_id": "",
          "discount": 0,
          "item_quantities": 
            orders.map(item => (
              {
              "item_id":  item.id,
              "price" : item.price,
              "quantity" : item.qty
              }))
          ,
          "payment_id": this.state.paymentMethod,
          "restaurant_id": sessionStorage.getItem("selRestaurant")        
      })       
      let that = this;
      let xhrCheckout = new XMLHttpRequest();
      xhrCheckout.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {              
              let checkoutResponse = JSON.parse(this.response);              
                that.setState({saveOrderResponse : checkoutResponse.message});
                that.openMessageHandler();                              
          }
      })
  
      xhrCheckout.open("POST", this.props.baseUrl + "order");
      xhrCheckout.setRequestHeader("Authorization", "Bearer " + access_token); //sessionStorage.getItem('access-token')
      xhrCheckout.setRequestHeader("Content-Type", "application/json");
      xhrCheckout.setRequestHeader("Cache-Control", "no-cache");
      xhrCheckout.setRequestHeader("Access-Control-Allow-Origin", "*");  
      xhrCheckout.send(dataCheckout);
    }
    openMessageHandler = () => {
      this.setState({snackBarOpen:true})  
    }
    handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({snackBarOpen:false})
    }
    getStepContent= (step) => {       
      
        switch (step) {
          case 0:
            return (
                <div>
                    <AppBar position={"static"}>
                    <Tabs className={this.props.tabs} value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Existing Address" />
                        <Tab label="New Address" />
                    </Tabs>
                    </AppBar>
                    {this.state.value === 0 && 
                        <TabContainer>
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                          className={this.props.root}
                          >
                            <Grid container spacing={10}>
                              {
                                this.state.dataAddress.map((val, idx) => ( 
                                  <Grid item xs={4} key={val.id}>
                                    <CustomerAddress address={val} key={val.id + "_" + idx} changeAddress={this.addressChangeHandler}/>                                 
                                  </Grid>                                       
                              ))            
                              }
                          </Grid>
                        </Grid>
                        </TabContainer>
                    },
                    {this.state.value === 1 && 
                        <TabContainer>
                            <div className="login">                            
                                <FormControl required className={this.props.formControl}>
                                    <InputLabel htmlFor="FltBldNo">Flat/Build No.</InputLabel>
                                    <Input 
                                        id="FlatBldNo"
                                        type="text"
                                        onChange={this.flatBldNoChangeHandler}  
                                    />
                                    <FormHelperText className={this.state.flatBldNoRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br/><br />
                                <FormControl required className={this.props.formControl}>
                                    <InputLabel htmlFor="Locality">Locality</InputLabel>
                                    <Input 
                                        id="Locality"
                                        type="text"
                                        onChange={this.localityChangeHandler}  
                                    />
                                    <FormHelperText className={this.state.localityRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br/><br/>
                                <FormControl required className={this.props.formControl}>
                                    <InputLabel htmlFor="city">City</InputLabel>
                                    <Input 
                                        id="City"
                                        type="text"
                                        onChange={this.cityChangeHandler}  
                                    />
                                    <FormHelperText className={this.state.cityRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br/><br/>                                
                                <FormControl required className={this.props.formControl}>
                                    <InputLabel htmlFor="State" shrink>State</InputLabel>
                                    <Select 
                                        value={this.state.selected}
                                        onChange={this.onStateChange}                                        
                                        input={<Input name="state" id="state" />} 
                                        style={{width:'200px'}} 
                                        placeholder="Select State"                                      
                                        >
                                            <MenuItem selected value="0">
                                                Select State
                                            </MenuItem>                                   
                                            {this.state.dataStates.map((state,i) => (                                                
                                            <MenuItem key={"state_" + state.id + "_" + i} value={state.id}>
                                                {state.state_name}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText className={this.state.stateRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br/><br/>
                                <FormControl required className={this.props.formControl}>
                                    <InputLabel htmlFor="Pincode">Pin Code</InputLabel>
                                    <Input 
                                        id="Pincode"
                                        type="text"
                                        onChange={this.pinCodeChangeHandler}  
                                    />
                                    <FormHelperText className={this.state.pincodeRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br/><br/>
                                <FormControl className={this.props.formControl}>
                                  <Typography variant="subtitle1" color="error" className={this.state.saveAddressError} align="left">{this.state.saveAddressErrorMsg}</Typography>                                                              
                                </FormControl>}<br /><br />
                                <Button variant="contained" fullWidth={true} color="primary" onClick={this.addressClickHandler} className={this.props.formControl}>
                                  SAVE ADDRESS
                                </Button>                                                        
                            </div>
                        </TabContainer>
                    }
                </div>
              );
          case 1:
            return (
              <div>
               <FormControl component="fieldset" className={this.props.formControl}>
               <FormLabel component="legend">Select Mode of Payment</FormLabel>
               <RadioGroup
                  aria-label="Payment Method"
                  name="payment"
                  className={this.props.group}
                  value={this.state.paymentMethod}
                  onChange={this.handleChange}
                >
              {this.state.dataPayments.map((val, index) => (                
                <FormControlLabel value={val.id} control={<Radio />} label={val.payment_name} key={index}/>                
              ))}
              </RadioGroup>
              </FormControl>
              </div>
            )
          default:
            return "Unknown step";
        }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: this.state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: this.state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  tabChangeHandler = (event, value) => {
    this.setState({value})
  };

  searchRestaurantsByName = event => {        
    const searchValue = event.target.value;    
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;        
    return (
      <div>
        <Header showSearch = {false} searchRestaurantsByName = {this.searchRestaurantsByName}/>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <div className={classes.root}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map(label => {
                  return (
                    <Step key={label} className={classes.step}>
                      <StepLabel classes={{iconContainer: classes.iconContainer}}>
                        <Typography component={'div'} variant={"h5"}>
                          {label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography component={'div'}>{this.getStepContent(activeStep)}</Typography>
                        <div>
                            <div>
                            <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={this.handleNext} className={classes.button}>
                                {activeStep === steps.length - 1 ? "Finish" : "Next"}
                            </Button>
                            </div>
                        </div>               
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>                                    
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard className={classes.summaryCard} checkoutHandler = {this.checkoutHandler}
            key="test"
            index="1"
            classes={classes}    
            />
          </Grid>
        </Grid>
        <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={this.state.snackBarOpen}
                  autoHideDuration={6000}
                  onClose={this.handleClose}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">{this.state.saveOrderResponse}</span>}
                  action={[              
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleClose}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
      </div>
    );
  }
}


Checkout.propTypes = {
    classes: PropTypes.object,
  };
export default withStyles(styles)(Checkout);
