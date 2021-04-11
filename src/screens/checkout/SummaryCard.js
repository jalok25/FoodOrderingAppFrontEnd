import React, {Component} from 'react';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Typography from "@material-ui/core/Typography";


const SummaryCard = function(props){    
    const summary = props.summary;
    const index = props.index;
    const classes = props.classes;
    //card className={classes.summaryCard} key={summary.id}
    let data = JSON.parse(localStorage.getItem("orders"));
    let total = localStorage.getItem("OrderDataTotal");
    return(
        <Card>        
            <CardHeader title="Summary" />
            <CardContent>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                >                     
                 {data.map((item, index) => 
                            <Grid container item xs={12} spacing={1} key={index}>
                            <Grid item xs={1}>
                                {item.type === 'VEG' ?  <FiberManualRecord style={{ color: "#008000" }}/> : <FiberManualRecord style={{ color: "#b20505" }}/>}
                            </Grid>
                            <Grid item xs={5}>
                                
                                {item.name}                            
                            </Grid>
                            <Grid item xs={3}>
                                {item.qty}                            
                            </Grid>
                            <Grid item xs={3}>
                                {item.price}                            
                            </Grid>
                            </Grid>                                                
                 )} 
                 <Grid container item xs={12}>
                 <Grid item xs={12}>                    
                    <Divider variant="middle" className={classes.divider}/>
                 </Grid>                                           
                 </Grid>
                    
                    <Grid container item xs={12} spacing={3}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5}>
                            <Typography variant="h6">
                            Net Amount
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>                            
                        </Grid>
                        <Grid item xs={3}>
                        <Typography variant="h6">                                                       
                            {total}
                        </Typography>
                        </Grid>
                    </Grid>
                </Grid>                
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" className={classes.orderButton} onClick={props.checkoutHandler}>
                    Place Order
                </Button>
            </CardActions>
        </Card>
    )
};

export default SummaryCard;