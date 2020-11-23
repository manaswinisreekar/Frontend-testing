import React from 'react';
import "./RestaurantCard.css";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import '../../assets/font-awesome-4.7.0/css/font-awesome.min.css';


const RestaurantCard = function(props){
    const index = props.index;
    const classes = props.classes;

    return (
        <div className="cardContainer" onClick={() => {let detailsPageUrl = '/restaurant/'+ props.resId; return props.history.push(detailsPageUrl)}} key={index}>
            <Card style={{width:"95%",height:"95%"}} className={classes.resCard} key={index}>
                <CardMedia
                    component="img"
                    alt={props.resName}
                    height="160"
                    image={props.resURL}
                />
                <CardContent >
                    <Typography gutterBottom variant="h4" component="h2">
                        {props.resName}
                    </Typography>
                    <div><br/>
                        <Typography style={{height:"18px",display:"block"}}variant="h6" >
                            {props.resFoodCategories}
                        </Typography>
                    </div>
                    <br /><br />
                </CardContent>
                <div className="rating-main-contnr">
                    <div className="rating-bg-color">
                        <span><i className="fa fa-star"></i></span>
                        <span> {props.resCustRating} ({props.resNumberCustRated})</span>
                    </div>
                    <div className="avg-price">
                        <span><i className="fa fa-inr"></i><span style={{fontSize:"100%",fontWeight:"bold"}}>{props.avgPrice} for two </span></span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
export default withRouter(RestaurantCard);