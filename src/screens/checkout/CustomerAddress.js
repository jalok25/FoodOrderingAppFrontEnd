import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { CardActions } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CheckCircle from '@material-ui/icons/CheckCircle'



const styles = muiBaseTheme => ({
  card: {
    maxWidth: 250,        
    boxShadow: "3px -3px 0px 6px rgba(255,0,102,1)",    
  },
  media: {
    height:0,
    paddingTop: "56.25%"
  },
  content: {
    textAlign: "left"    
  },
  divider: {
    margin: `${muiBaseTheme.spacing.unit * 3}px 0`
  },
  heading: {
    fontWeight: "bold"
  },
  subheading: {
    lineHeight: 1.8
  },
  CardAction:{
    marginLeft : "auto",
    flex:1
  },
  IconButton:{
    color:"#009999"
  }  
});


function TestCard( props ) {
    const classes = props.classes;
    const address = props.address;   
    const [value, setValue] = React.useState(0);
        
  function onAddressClick(address, value){    
    sessionStorage.setItem("selAddress",JSON.stringify(address));  
    sessionStorage.setItem("selected", address.id);  
    setValue(1);
    props.changeAddress();
  }
    
  return (    
    <div className="App">
      <Card className={classes.card} key={address.id}>
        <CardContent className={classes.content}>
          <Typography
            className={"MuiTypography--heading"}
            variant={"h6"}
            gutterBottom
          >
            {address.flat_building_name} {address.locality} <br />
            {address.city} <br />
            {address.state.state_name} <br />
            {address.pincode} <br />
          </Typography>          
          <Divider className={classes.divider} light />          
        </CardContent>
        <CardActions disableSpacing className={classes.CardAction}>
          <IconButton aria-label="Select Address" onClick={() => onAddressClick(address) }>            
            {address.id === sessionStorage.getItem("selected") ? <CheckCircle  style={{color:"#009000"}}/> : <CheckCircle style={{color:"#999999"}} />}            
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}

export default withStyles(styles)(TestCard);


