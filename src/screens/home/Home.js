import React, {Component} from 'react';
import Header from '../../common/header/Header';
import * as Utils from "../../common/Utils";
import * as Constants from "../../common/Constants";
import RestaurantCard from './RestaurantCard';
import Grid from '@material-ui/core/Grid';
import {withStyles} from "@material-ui/core/styles";
import './Home.css';


const styles = {
    resCard: {width: "90%", cursor: "pointer"}
};

class Home extends Component {

    constructor() {
        super();
        this.state = {
            imageData: [],
            data: []
        }
    }

    componentDidMount() {
        this.getAllImageData();
    }

    /**Get all restaurants data**/
    getAllImageData = () => {
        const requestUrl = this.props.baseUrl + "restaurant";
        const that = this;
        Utils.makeApiCall(
            requestUrl,
            null,
            null,
            Constants.ApiRequestTypeEnum.GET,
            null,
            responseText => {
                that.setState(
                    {
                        imageData: JSON.parse(responseText).restaurants
                    }
                );
            },
            () => {
            }
        );
    };
    //Logout action from drop down menu on profile icon
    loginredirect = () => {
        sessionStorage.clear();
        this.props.history.push({
            pathname: "/"
        });
        window.location.reload();
    }

    // Restaurant search by name
    searchRestaurantsByName = event => {
        const searchValue = event.target.value;
        const requestUrl = this.props.baseUrl + "restaurant/name/" + searchValue;
        const that = this;
        if (!Utils.isEmpty(searchValue)) {
            Utils.makeApiCall(
                requestUrl, null, null, Constants.ApiRequestTypeEnum.GET, null,
                responseText => {
                    that.setState({imageData: JSON.parse(responseText).restaurants});
                }, () => {
                });
        } else {
            this.getAllImageData();
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Header logoutHandler={this.loginredirect} baseUrl={this.props.baseUrl}
                        searchRestaurantsByName={this.searchRestaurantsByName} showSearch={true}
                        history={this.props.history}/>
                <div className="mainContainer">
                    {
                        this.state.imageData === null ?
                            <span style={{fontSize: "20px"}}>No restaurant with the given name</span>
                            : (
                                (this.state.imageData || []).map((resItem, index) =>
                                    <div key={"div" + index} className="restaurantCard">
                                        <Grid className="gridCard" key={index}>
                                            <RestaurantCard
                                                resId={resItem.id}
                                                resURL={resItem.photo_URL}
                                                resName={resItem.restaurant_name}
                                                resFoodCategories={resItem.categories}
                                                resCustRating={resItem.customer_rating}
                                                resNumberCustRated={resItem.number_customers_rated}
                                                avgPrice={resItem.average_price}
                                                classes={classes}
                                                index={index}
                                            />
                                        </Grid>
                                    </div>
                                )
                            )
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Home);