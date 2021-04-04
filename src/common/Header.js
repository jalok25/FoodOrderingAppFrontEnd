import React, {Component} from 'react';
import './Header.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {createMuiTheme} from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


const styles = theme => ({

    SearchField :{
        width: '280px',
        color: 'white',
        fontSize:'0.9rem',
        height: '35px'
      },
      button : {
        width:'90px',
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


class Header extends Component {


    render () {
        const { classes } = this.props;

        return (
            <header className="app-header">
                <div className = "logo-container">
                    <FastfoodIcon htmlColor="white" fontSize="large"/>
                </div>
                <div className="search-box-container">
                    <ThemeProvider theme = {theme}>
                    <Input
                     id='search-field' 
                     type='text'
                     placeholder="Search by Restaurant Name" 
                     className={classes.SearchField}   
                     startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon htmlColor="white" fontSize="default"/>
                        </InputAdornment>
                    }
                    />
                    </ThemeProvider>
                </div>
                <div>
                <Button
                 variant="contained"
                 color="default"
                 size = "medium"
                 className= {classes.button}
                 startIcon= {<AccountCircleIcon  />}
                 >
                     LOGIN
                     </Button>
                </div>
            </header>
        )
    }
}

export default withStyles(styles)(Header);