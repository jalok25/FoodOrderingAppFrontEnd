import React, { Component } from 'react';
import './Header.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

const styles = theme => ({
  SearchField: {
    width: '280px',
    color: 'white',
    fontSize: '0.9rem',
    height: '35px'
  },
  button: {
    width: '90px',
    marginTop: '3px'
  }
});

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid black"
        },
        "&:after": {
          borderBottom: "1px solid white"
        }
      }
    }
  }
});


const TabContainer = function (props) {
  return (
    <Typography container='div' style={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </Typography>
  );
}


class Header extends Component {

  constructor() {
    super();
    this.state = {
      contactNumber: "",
      loginPassword: "",
      firstname: "",
      lastname: "",
      email: "",
      signUpPassword: "",
      signUpContactNumber: "",
      firstnameRequired: "dispNone",
      emailRequired: "dispNone",
      contactNumberRequired: "dispNone",
      signUpContactNumberRequired: "dispNone",
      loginPasswordRequired: "dispNone",
      signUpPasswordRequired: "dispNone",
      invalidContact: "dispNone",
      invalidEmail: "dispNone",
      invalidPassword: "dispNone",
      invalidSignUpContact: "dispNone",
      failedSignUp: false,
      message: "dispNone",
      errorMessage: "",
      loginErrorMessage: "",
      successMessage: "",
      modalIsOpen: false,
      value: 0,
      responseData: [],
      searchedRestaurants: [],
      restaurantName: "",
      signUpSuccess: false,
      open: false,
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      loginText: "LOGIN"
    }
  }

  componentWillMount() {
  }

  searchRestaurantHandler = (e) => {
    console.log(e.target.value);
    this.setState({ restaurantName: e.target.value }, function () {

      let data = null;
      let xhrSearch = new XMLHttpRequest();
      let that = this;
      xhrSearch.addEventListener("readystatechange", function () {

        if (this.readyState === 4) {
          console.log(JSON.parse(this.responseText)); //convert this string to json object
          that.setState({ responseData: JSON.parse(this.responseText).restaurants })
        }

      })

      xhrSearch.open("GET", "http://localhost:8080/api/restaurant/name/" + this.state.restaurantName);
      xhrSearch.setRequestHeader("Content-Type", "application/json");
      xhrSearch.setRequestHeader("Cache-Control", "no-cache");
      xhrSearch.send(data);
    });

    console.log(this.state.responseData);
  }

  openTabHandler = (event, value) => {
    this.setState({ value })
  }

  closeModalHandler = () => {
    this.setState({ modalIsOpen: false });
  }

  openModalHandler = () => {
    this.setState({ modalIsOpen: true });
    this.setState({
      contactNumberRequired: 'dispNone',
      loginPasswordRequired: "dispNone",
      invalidContact: "dispNone",
      firstnameRequired: "dispNone",
      emailRequired: "dispNone",
      signUpPasswordRequired: "dispNone",
      signUpContactNumberRequired: "dispNone",
      invalidEmail: "dispNone",
      invalidPassword: "dispNone",
      invalidSignUpContact: "dispNone",
      failedSignUp: false,
      message: "dispNone",
      successMessage: "",
      firstname: "",
      lastname: "",
      email: "",
      signUpPassword: "",
      signUpContactNumber: "",
      loginPassword: "",
      contactNumber: "",
      value: 0
    });
  }

  inputContactNumberChangeHandler = (e) => {
    this.setState({ contactNumber: e.target.value })
  }

  inputLoginPasswordChangeHandler = (e) => {
    this.setState({ loginPassword: e.target.value })
  }

  loginClickHandler = () => {
    // Perform check for contact number
    var contactRegex = /^[0-9]{10}$/
    var contact = this.state.contactNumber;
    if (contact.match(contactRegex)) {
      this.setState({ invalidContact: 'dispNone', message: 'dispNone', loggedIn: false})
    }
    else {
      this.setState({ invalidContact: 'dispBlock' })
    }


    this.state.contactNumber === "" ? this.setState({
      contactNumberRequired: 'dispBlock',
      invalidContact: 'dispNone',
      message: 'dispNone',
    })
      : this.setState({ contactNumberRequired: 'dispNone' })

    this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: 'dispBlock',  message: 'dispNone', })
      : this.setState({ loginPasswordRequired: 'dispNone' })

    if (this.state.contactNumber !== "" && this.state.loginPassword !== "") {
      let dataLogin = null;
      let xhrLogin = new XMLHttpRequest();
      let that = this;
      xhrLogin.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
          sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
          sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
          that.setState({loggedIn: true });
          that.setState({ open: true })
          that.setState({successMessage: "Logged in successfully!" })
          that.setState({loginText: JSON.parse(this.responseText).first_name})
          that.closeModalHandler();
        }

        if (this.readyState === 4 && this.status !== 200) {
          console.log(this.responseText);
          that.setState({ loginErrorMessage: JSON.parse(this.responseText).message })
          that.setState({ loggedIn: false })

          if (that.state.invalidContact === 'dispNone') {
          that.setState({ message: 'dispBlock' })
          }
        }
      });

      xhrLogin.open("POST", "http://localhost:8080/api/customer/login");
      xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.contactNumber + ":" + this.state.loginPassword));
      xhrLogin.setRequestHeader("Content-Type", "application/json");
      xhrLogin.setRequestHeader("Cache-Control", "no-cache");
      xhrLogin.send(dataLogin);
    }
  }

  inputFirstNameChangeHandler = (e) => {
    this.setState({ firstname: e.target.value })
  }

  inputLastNameChangeHandler = (e) => {
    this.setState({ lastname: e.target.value })
  }

  inputEmailChangeHandler = (e) => {
    this.setState({ email: e.target.value })
  }

  inputSignUpContactNumberChangeHandler = (e) => {
    this.setState({ signUpContactNumber: e.target.value })
  }

  inputSignUpPasswordChangeHandler = (e) => {
    this.setState({ signUpPassword: e.target.value })
  }

  signUpClickHandler = () => {

    // Performing check for email

    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var mail = this.state.email;
    if (mail.match(emailRegex)) {
      this.setState({ invalidEmail: 'dispNone' });
    }
    else {
      this.setState({ invalidEmail: 'dispBlock' });
    }

    // Performing check for password 

    var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{5,})");
    var password = this.state.signUpPassword;
    if (password.match(passwordRegex)) {
      this.setState({ invalidPassword: 'dispNone' });
    }
    else {
      this.setState({ invalidPassword: 'dispBlock' });
    }

    // Performing check for Sign up contact number 

    var signUpContactRegex = /^[0-9]{10}$/
    var contact = this.state.signUpContactNumber;
    if (contact.match(signUpContactRegex)) {
      this.setState({ invalidSignUpContact: 'dispNone' })
    }
    else {
      this.setState({ invalidSignUpContact: 'dispBlock' })
    }

    this.state.firstname === "" ? this.setState({ firstnameRequired: 'dispBlock', message: 'dispNone' })
      : this.setState({ firstnameRequired: 'dispNone' })

    this.state.email === "" ? this.setState({
      emailRequired: 'dispBlock',
      invalidEmail: 'dispNone',
      message: 'dispNone',
    })
      : this.setState({ emailRequired: 'dispNone' })

    this.state.signUpContactNumber === "" ? this.setState({
      signUpContactNumberRequired: 'dispBlock',
      invalidSignUpContact: 'dispNone',
      message: 'dispNone',
    })
      : this.setState({ signUpContactNumberRequired: 'dispNone' })

    this.state.signUpPassword === "" ? this.setState({
      signUpPasswordRequired: 'dispBlock',
      invalidPassword: 'dispNone',
      message: 'dispNone',
    })
      : this.setState({ signUpPasswordRequired: 'dispNone' })

    let dataSignUp = JSON.stringify({
      "contact_number": this.state.signUpContactNumber,
      "email_address": this.state.email,
      "first_name": this.state.firstname,
      "last_name": this.state.lastname,
      "password": this.state.signUpPassword
    })

    if (this.state.firstname !== "" && this.state.email !== "" && this.state.signUpContactNumber !== ""
      && this.state.signUpPassword !== "") {
      let xhrSignUp = new XMLHttpRequest();
      let that = this;
      xhrSignUp.addEventListener("readystatechange", function () {

        if (this.readyState === 4 && this.status === 201) {
          console.log(this.responseText);
          that.setState({ signUpSuccess: true })
          that.setState({ open: true })
          that.setState({ value: 0 });
          that.setState({successMessage: "Registered successfully! Please login now!" });
        }
        if (this.readyState === 4 && this.status !== 201) {
          console.log(this.responseText);
          that.setState({ failedSignUp: true });
          that.setState({ errorMessage: JSON.parse(this.responseText).message })

          if (that.state.invalidPassword === 'dispNone' && that.state.invalidSignUpContact === 'dispNone'
          && that.state.invalidEmail === 'dispNone'){
          that.setState({ message: 'dispBlock' })
          }
        }

      })

      xhrSignUp.open("POST", "http://localhost:8080/api/customer/signup");
      xhrSignUp.setRequestHeader("Content-Type", "application/json");
      xhrSignUp.setRequestHeader("Cache-Control", "no-cache");
      xhrSignUp.send(dataSignUp);
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false })
  };



  render() {
    const { classes } = this.props;

    return (
      <header className="app-header">
        <div className="logo-container">
          <FastfoodIcon htmlColor="white" fontSize="large" />
        </div>
        <div className="search-box-container">
          <ThemeProvider theme={theme}>
            <Input
              id='search-field'
              type='text'
              placeholder="Search by Restaurant Name"
              className={classes.SearchField}
              value={this.state.restaurantName}
              onChange={this.searchRestaurantHandler}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon htmlColor="white" fontSize="default" />
                </InputAdornment>
              }
            />
          </ThemeProvider>
        </div>
        <div>
          <Button
            variant="contained"
            color="default"
            size="medium"
            className={classes.button}
            onClick={this.openModalHandler}
            startIcon={<AccountCircleIcon />}
          >
            {this.state.loginText}
                     </Button>
        </div>
        <Modal isOpen={this.state.modalIsOpen} contentLabel='Login Modal' ariaHideApp={false}
          onRequestClose={this.closeModalHandler}
          style={customStyles}>

          <Tabs className='tabs' value={this.state.value} onChange={this.openTabHandler}>
            <Tab label='LOGIN' />
            <Tab label='SIGNUP' />
          </Tabs>

          {this.state.value === 0 &&
            <TabContainer>
              <FormControl required fullWidth='true'>
                <InputLabel htmlFor='contactnumber'>Contact No.</InputLabel>
                <Input id='contactnumber' type='text' contactNumber={this.state.contactNumber}
                  onChange={this.inputContactNumberChangeHandler} />
                <FormHelperText className={this.state.contactNumberRequired}> <span className='red'>
                  required </span>
                </FormHelperText>

                <FormHelperText className={this.state.invalidContact}> <span className='red'>
                  Invalid Contact </span>
                </FormHelperText>

              </FormControl> <br /> <br />
              <FormControl required fullWidth='true'>
                <InputLabel htmlFor='loginPassword'>Password</InputLabel>
                <Input id='loginPassword' type='password' loginpassword={this.state.loginPassword}
                  onChange={this.inputLoginPasswordChangeHandler} />
                <FormHelperText className={this.state.loginPasswordRequired}> <span className='red'>
                  required </span>
                </FormHelperText>
                {this.state.loggedIn === false &&
                  <FormHelperText className={this.state.message}> <span className='red'>
                    {this.state.loginErrorMessage} </span>
                  </FormHelperText>
                }
              </FormControl><br /> <br />
              <Button variant='contained' color='primary' onClick={this.loginClickHandler}>LOGIN</Button>
            </TabContainer>
          }

          {this.state.value === 1 &&
            <TabContainer>
              <FormControl required fullWidth='true'>
                <InputLabel htmlFor='firstname'>First Name</InputLabel>
                <Input id='firstname' type='text' firstname={this.state.firstname}
                  onChange={this.inputFirstNameChangeHandler} />
                <FormHelperText className={this.state.firstnameRequired}> <span className='red'>
                  required </span>
                </FormHelperText>
              </FormControl> <br /> <br />
              <FormControl fullWidth='true'>
                <InputLabel htmlFor='lastname'>Last Name</InputLabel>
                <Input id='lastname' type='text' lastname={this.state.lastname}
                  onChange={this.inputLastNameChangeHandler} />
              </FormControl> <br /> <br />
              <FormControl required fullWidth='true'>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <Input id='email' type='email' email={this.state.email}
                  onChange={this.inputEmailChangeHandler} />
                <FormHelperText className={this.state.emailRequired}> <span className='red'>
                  required </span>
                </FormHelperText>

                <FormHelperText className={this.state.invalidEmail}> <span className='red'>
                  Invalid Email </span>
                </FormHelperText>

              </FormControl> <br /> <br />
              <FormControl required fullWidth='true'>
                <InputLabel htmlFor='signUpPassword'>Password</InputLabel>
                <Input id='signUpPassword' type='password' signUpPassword={this.state.signUpPassword}
                  onChange={this.inputSignUpPasswordChangeHandler} />
                <FormHelperText className={this.state.signUpPasswordRequired}> <span className='red'>
                  required </span>
                </FormHelperText>

                <FormHelperText className={this.state.invalidPassword}> <span className='red'>
                  Password must contain at least one capital letter, one small letter, one number, and one special character </span>
                </FormHelperText>
              </FormControl><br /> <br />
              <FormControl required fullWidth='true'>
                <InputLabel htmlFor='contactno'>Contact No</InputLabel>
                <Input id='contactno' type='text' contactno={this.state.signUpContactNumber}
                  onChange={this.inputSignUpContactNumberChangeHandler} />
                <FormHelperText className={this.state.signUpContactNumberRequired}> <span className='red'>
                  required </span>
                </FormHelperText> <br />

                <FormHelperText className={this.state.invalidSignUpContact}> <span className='red'>
                  Contact No. must contain only numbers and must be 10 digits long </span>
                </FormHelperText>
                <br /> <br />
                {this.state.failedSignUp === true &&
                  <FormHelperText className={this.state.message}> <span className='red'>
                    {this.state.errorMessage} </span>
                  </FormHelperText>
                }
              </FormControl> <br /> <br />
              <Button variant='contained' color='primary' onClick={this.signUpClickHandler}>SIGNUP</Button>
            </TabContainer>
          }
        </Modal>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={4000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.successMessage}</span>}
        />


      </header>
    )
  }
}

export default withStyles(styles)(Header);