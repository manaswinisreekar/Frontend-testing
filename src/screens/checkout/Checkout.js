import React, { Component } from 'react';
import './Checkout.css';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = theme => ({
    stepperButton: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    tabRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    existingAddressTabContainer: {
        float: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        overflowY: 'hidden',
    },
    existingAddressGridListTile: {
        marginBottom: '50px',
        cursor: 'pointer',
    },
    existingAddressGridListTileTile: {
        padding: '25px',
    },
    existingAddressCheckCircle: {
        float: 'right',
        marginRight: '10px',
    },
    newAddressStateSelect: {
        width: '194px',
    },
    radioRoot: {
        display: 'flex',
    },
    radioFormControl: {
        margin: theme.spacing.unit * 3,
    },
    radioGroup: {
        margin: `${theme.spacing.unit}px 0`,
    },
    summaryCardDivider: {
        marginTop: '5px',
    },
    netAmount: {
        marginTop: '15px',
    },
    placeOrderButton: {
        marginTop: '20px',
    },
});

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4 + 8,
            width: 250,
        },
    },
};

function getSteps() {
    return ['Delivery', 'Payment'];
};

function TabContainer(props) {
    return (
        <Typography component='div' style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    )
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class Checkout extends Component {

    constructor() {
        super();
        this.state = {
            customerCart: JSON.parse(sessionStorage.getItem('customer-cart')),
            activeStep: 0,
            tabValue: 0,
            selectedExistingAddress: null,
            flatBuildingNoRequired: 'display-none',
            flatBuildingNo: '',
            localityRequired: 'display-none',
            locality: '',
            cityRequired: 'display-none',
            city: '',
            stateRequired: 'display-none',
            newAddressState: '',
            pincodeRequired: 'display-none',
            pincodeRequiredMsg: 'required',
            pincode: '',
            customerExistingAddresses: [],
            states: [],
            paymentModes: [],
            radioValue: '',
            selectedPaymentMode: null,
            openPlaceOrderMsg: false,
            orderId: '',
            placeOrderMsg: '',
        }
    };

    preState = {
        activeStep: 0,
    };

    componentWillMount() {
        let that = this;

        // Customers' existing address
        let dataCustomerAddress = null;
        let xhrCustomerAddress = new XMLHttpRequest();
        xhrCustomerAddress.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                that.setState({
                    customerExistingAddresses: JSON.parse(this.responseText).addresses,
                });
            }
        });
        xhrCustomerAddress.open('GET', `${this.props.baseUrl}address/customer`);
        xhrCustomerAddress.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrCustomerAddress.send(dataCustomerAddress);

        // States
        let dataStates = null;
        let xhrStates = new XMLHttpRequest();
        xhrStates.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                that.setState({
                    states: JSON.parse(this.responseText).states,
                });
            }
        });
        xhrStates.open('GET', `${this.props.baseUrl}states`);
        xhrStates.send(dataStates);

        // Request Payment Modes
        let dataPaymentModes = null;
        let xhrPaymentModes = new XMLHttpRequest();
        xhrPaymentModes.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                that.setState({
                    paymentModes: JSON.parse(this.responseText).paymentMethods,
                });
            }
        });
        xhrPaymentModes.open('GET', `${this.props.baseUrl}payment`);
        xhrPaymentModes.send(dataPaymentModes);
    };

    componentWillUnmount() {
        sessionStorage.removeItem('customer-cart');
    }

    stepperNextHandler = () => {
        // Checking if address not selected
        if (this.state.activeStep === 0 && this.state.selectedExistingAddress === null) {
            return;
        }

        // Checking if payment mode not selected
        if (this.state.activeStep === 1 && this.state.selectedPaymentMode === null) {
            return;
        }

        this.setState(preState => ({
            activeStep: preState.activeStep + 1,
        }));
    };

    stepperBackHandler = () => {
        this.setState(preState => ({
            activeStep: preState.activeStep - 1,
        }));
    };

    stepperResetHandler = () => {
        this.setState({
            activeStep: 0,
        });
    };

    tabChangeHandler = (event, value) => {
        this.setState({ tabValue: value });
    };

    existingAddressOnClickHandler = (addressId) => {
        this.setState({
            [this.state.selectedExistingAddress]: 'unselect-address',
            selectedExistingAddress: addressId,
            [addressId]: 'select-address',
        });
    };

    flatBuildingNoChangeHandler = event => {
        this.setState({ flatBuildingNo: event.target.value });
    };

    localityChangeHandler = event => {
        this.setState({ locality: event.target.value });
    };

    cityChangeHandler = event => {
        this.setState({ city: event.target.value });
    };

    stateChangeHandler = event => {
        this.setState({ newAddressState: event.target.value });
    };

    pincodeChangeHandler = event => {
        this.setState({ pincode: event.target.value });
    };

    saveAddressOnClickHandler = () => {
        let flatBuildingNoReq = false;
        if (this.state.flatBuildingNo === '') {
            this.setState({ flatBuildingNoRequired: 'display-block' });
            flatBuildingNoReq = true;
        } else {
            this.setState({ flatBuildingNoRequired: 'display-none' });
        }

        let localityReq = false;
        if (this.state.locality === '') {
            this.setState({ localityRequired: 'display-block' });
            localityReq = true;
        } else {
            this.setState({ localityRequired: 'display-none' });
        }

        let cityReq = false;
        if (this.state.city === '') {
            this.setState({ cityRequired: 'display-block' });
            cityReq = true;
        } else {
            this.setState({ cityRequired: 'display-none' });
        }

        let stateReq = false;
        if (this.state.newAddressState === '') {
            this.setState({ stateRequired: 'display-block' });
            stateReq = true;
        } else {
            this.setState({ stateRequired: 'display-none' });
        }

        let pincodeReq = false;
        if (this.state.pincode === '') {
            this.setState({
                pincodeRequired: 'display-block',
                pincodeRequiredMsg: 'required'
            });
            pincodeReq = true;
        } else {
            this.setState({ pincodeRequired: 'display-none' });
        }

        let validatePincode = new RegExp('^[1-9][0-9]{5}$');
        if (pincodeReq === false && validatePincode.test(this.state.pincode) === false) {
            this.setState({
                pincodeRequired: 'display-block',
                pincodeRequiredMsg: 'Pincode must contain only numbers and must be 6 digits long'
            });
            return;
        }

        if (flatBuildingNoReq || localityReq || cityReq || stateReq || pincodeReq) {
            return;
        }

        let stateUUID = '';
        for (let state of this.state.states) {
            if (state.state_name === this.state.newAddressState) {
                stateUUID = state.id;
            }
        }

        // Adding Address
        let that = this;
        let dataNewAddress = {
            'city': this.state.city,
            'flat_building_name': this.state.flatBuildingNo,
            'locality': this.state.locality,
            'pincode': this.state.pincode,
            'state_uuid': stateUUID
        }
        let xhrNewAddress = new XMLHttpRequest();
        xhrNewAddress.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let dataCustomerAddress = null;
                let xhrCustomerAddress = new XMLHttpRequest();
                xhrCustomerAddress.addEventListener('readystatechange', function () {
                    if (this.readyState === 4) {
                        that.setState({
                            customerExistingAddresses: JSON.parse(this.responseText).addresses,
                        });
                    }
                });
                xhrCustomerAddress.open('GET', `${that.props.baseUrl}address/customer`);
                xhrCustomerAddress.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
                xhrCustomerAddress.send(dataCustomerAddress);
                window.alert('New address added!');
            }
        });
        xhrNewAddress.open('POST', `${this.props.baseUrl}address`);
        xhrNewAddress.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrNewAddress.setRequestHeader('Content-Type', 'application/json');
        xhrNewAddress.send(JSON.stringify(dataNewAddress));
    };

    radioChangeHandler = event => {
        this.setState({ radioValue: event.target.value });
    };

    radioClickHandler = (paymentId) => {
        this.setState({ selectedPaymentMode: paymentId });
    };

    placeOrderOnClickHandler = () => {
        let that = this;
        let itemQuantities = this.state.customerCart.cartItems.map(
            function (i) {
                return {
                    'item_id': i.id,
                    'price': i.totalItemPrice,
                    'quantity': i.count
                }
            }
        );
        let dataPlaceOrder = {
            'address_id': this.state.selectedExistingAddress,
            'bill': 0,
            'coupon_id': '',
            'discount': 0,
            'item_quantities': itemQuantities,
            'payment_id': this.state.selectedPaymentMode,
            'restaurant_id': this.state.customerCart.restaurantDetails.id
        }
        let xhrPlaceOrder = new XMLHttpRequest();
        xhrPlaceOrder.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);
                if (responseText.status === 'ORDER SUCCESSFULLY PLACED') {
                    that.setState({
                        openPlaceOrderMsg: true,
                        orderId: responseText.id,
                        placeOrderMsg: `Order placed successfully! Your order ID is ${responseText.id}.`
                    });
                } else {
                    that.setState({
                        openPlaceOrderMsg: true,
                        orderId: '',
                        placeOrderMsg: 'Unable to place your order! Please try again!'
                    });
                }
            }
        })
        xhrPlaceOrder.open('POST', `${this.props.baseUrl}order`);
        xhrPlaceOrder.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrPlaceOrder.setRequestHeader('Content-Type', 'application/json');
        xhrPlaceOrder.send(JSON.stringify(dataPlaceOrder));
    };

    placeOrderMsgOnCloseHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openPlaceOrderMsg: false });
    };

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        const { tabValue } = this.state;

        return (
            <div>
                <Header />

                <Grid container={true} >
                    <Grid item={true} xs={9}>
                        <div>
                            <Stepper activeStep={activeStep} orientation='vertical'>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            {index === 0 ?

                                                // Tabs for existing and New Address
                                                <div className={classes.tabRoot}>
                                                    <AppBar position='static'>
                                                        <Tabs value={tabValue} onChange={this.tabChangeHandler}>
                                                            <Tab label='EXISTING ADDRESS' />
                                                            <Tab label='NEW ADDRESS' />
                                                        </Tabs>
                                                    </AppBar>

                                                    {/* Existing Address */}
                                                    {tabValue === 0 &&
                                                    <TabContainer className={classes.existingAddressTabContainer}>
                                                        {this.state.customerExistingAddresses === null ?
                                                            <Typography variant='h6' color='textSecondary'>
                                                                There are no saved addresses! You can save an address using the 'New Address' tab or using your 'Profile' menu option.
                                                            </Typography>
                                                            :
                                                            <GridList
                                                                className={classes.gridList}
                                                                cols={3}
                                                                cellHeight='auto'
                                                            >
                                                                {this.state.customerExistingAddresses.map(address => (
                                                                    <GridListTile
                                                                        key={'address' + address.id}
                                                                        id={this.state[address.id] || 'unselect-address'}
                                                                        onClick={() => this.existingAddressOnClickHandler(address.id)}
                                                                        className={classes.existingAddressGridListTile}
                                                                        classes={{ tile: classes.existingAddressGridListTileTile }}
                                                                    >

                                                                        {/* Existing Address  -  Details*/}
                                                                        <Typography variant='subtitle1'>
                                                                            {address.flat_building_name}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.locality}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.city}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.state.state_name}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.pincode}
                                                                        </Typography>

                                                                        {/* Check Existing address */}
                                                                        <CheckCircleIcon
                                                                            className={classes.existingAddressCheckCircle}
                                                                            nativeColor={this.state[address.id] === 'select-address' ? 'green' : 'grey'}
                                                                        />

                                                                    </GridListTile>
                                                                ))}
                                                            </GridList>
                                                        }
                                                    </TabContainer>
                                                    }

                                                    {/* New Address */}
                                                    {tabValue === 1 &&
                                                    <TabContainer>

                                                        {/* New address - Details */}
                                                        <FormControl required>
                                                            <InputLabel htmlFor='flatBuildingNo'>Flat / Building No.</InputLabel>
                                                            <Input
                                                                id='flatBuildingNo'
                                                                type='text'
                                                                flatbuildingno={this.state.flatBuildingNo}
                                                                value={this.state.flatBuildingNo}
                                                                onChange={this.flatBuildingNoChangeHandler}
                                                            />
                                                            <FormHelperText className={this.state.flatBuildingNoRequired} error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br /><br />

                                                        <FormControl required>
                                                            <InputLabel htmlFor='locality'>Locality</InputLabel>
                                                            <Input
                                                                id='locality'
                                                                type='text'
                                                                locality={this.state.locality}
                                                                value={this.state.locality}
                                                                onChange={this.localityChangeHandler}
                                                            />
                                                            <FormHelperText className={this.state.localityRequired} error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br /><br />

                                                        <FormControl required>
                                                            <InputLabel htmlFor='city'>City</InputLabel>
                                                            <Input
                                                                id='city'
                                                                type='text'
                                                                city={this.state.city}
                                                                value={this.state.city}
                                                                onChange={this.cityChangeHandler}
                                                            />
                                                            <FormHelperText className={this.state.cityRequired} error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br /><br />

                                                        <FormControl required className={classes.newAddressFormControl}>
                                                            <InputLabel htmlFor='newAddressstate'>State</InputLabel>
                                                            <Select
                                                                id='newAddressstate'
                                                                newaddressstate={this.state.newAddressState}
                                                                value={this.state.newAddressState}
                                                                onChange={this.stateChangeHandler}
                                                                className={classes.newAddressStateSelect}
                                                                MenuProps={MenuProps}
                                                            >
                                                                {this.state.states.map(state => (
                                                                    <MenuItem key={'state' + state.id} value={state.state_name}>
                                                                        {state.state_name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            <FormHelperText className={this.state.stateRequired} error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br /><br />

                                                        <FormControl required>
                                                            <InputLabel htmlFor='pincode'>Pincode</InputLabel>
                                                            <Input
                                                                id='pincode'
                                                                type='text'
                                                                pincode={this.state.pincode}
                                                                value={this.state.pincode}
                                                                onChange={this.pincodeChangeHandler}
                                                            />
                                                            <FormHelperText className={this.state.pincodeRequired} error={true}>
                                                                <span>{this.state.pincodeRequiredMsg}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br /><br />

                                                        <Button
                                                            variant='contained'
                                                            color='secondary'
                                                            onClick={this.saveAddressOnClickHandler}
                                                        >
                                                            Save Address
                                                        </Button>
                                                    </TabContainer>
                                                    }
                                                </div>
                                                : ''
                                            }

                                            {index === 1 ?
                                                <div className={classes.radioRoot}>
                                                    <FormControl component='fieldset' className={classes.radioFormControl}>
                                                        <FormLabel component='legend'>Select Mode of Payment</FormLabel>
                                                        <RadioGroup
                                                            aria-label='paymentModes'
                                                            name='paymentModes'
                                                            className={classes.radioGroup}
                                                            value={this.state.radioValue}
                                                            onChange={this.radioChangeHandler}
                                                        >
                                                            {this.state.paymentModes.map(paymentMode => (
                                                                <FormControlLabel
                                                                    key={'paymentMode' + paymentMode.id}
                                                                    value={paymentMode.payment_name.toLowerCase()}
                                                                    control={<Radio />}
                                                                    label={paymentMode.payment_name}
                                                                    onClick={() => this.radioClickHandler(paymentMode.id)}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                                : ''
                                            }

                                            {/* Buttons for Step */}
                                            <div className={classes.actionsContainer}>
                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={this.stepperBackHandler}
                                                        className={classes.stepperButton}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        onClick={this.stepperNextHandler}
                                                        className={classes.stepperButton}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === steps.length && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                    <Typography variant='h6'>
                                        View the summary &#38; place your order now!
                                    </Typography>
                                    <Button onClick={this.stepperResetHandler} className={classes.stepperButton}>
                                        CHANGE
                                    </Button>
                                </Paper>
                            )}
                        </div>
                    </Grid>

                    {/* Cart Summary */}
                    <Grid item={true} xs>
                        <Card id='summary-card'>
                            <CardContent>
                                <Typography variant='h5'>
                                    Summary
                                </Typography>
                                <br />

                                {/* Restaurant Name */}
                                <Typography variant='h6' color='textSecondary' gutterBottom>
                                    {this.state.customerCart.restaurantDetails.restaurant_name}
                                </Typography>

                                {this.state.customerCart.cartItems.map(item => (
                                    <div key={'item' + item.id + item.category_name} className='flex width-100 pd-1-per'>
                                        <div className='width-10'><i className={item.item_type === 'NON_VEG' ? 'fa fa-stop-circle-o non-veg' : 'fa fa-stop-circle-o veg'}></i></div>
                                        <div className='width-50 capital checkout-grey-color'>{item.item_name}</div>
                                        <div className='width-25 checkout-grey-color'>{item.count}</div>
                                        <div className='width-4 checkout-grey-color'><i className='fa fa-inr'></i></div>
                                        <div className='checkout-grey-color'>{item.totalItemPrice}.00</div>
                                    </div>
                                ))}

                                <Divider className={classes.summaryCardDivider} />

                                {/* Net Amount */}
                                <div className={classes.netAmount}>
                                    Net Amount
                                    <span className='right'>
                                        <span className='width-5 checkout-grey-color'>
                                            <i className='fa fa-inr'></i>
                                        </span> {this.state.customerCart.totalPrice}.00
                                    </span>
                                </div>

                                {/* Place Order */}
                                <Button
                                    variant='contained'
                                    color='primary'
                                    className={classes.placeOrderButton}
                                    fullWidth={true}
                                    onClick={this.placeOrderOnClickHandler}
                                >
                                    Place Order
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Order Placed */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openPlaceOrderMsg}
                    autoHideDuration={5000}
                    onClose={this.placeOrderMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>{this.state.placeOrderMsg}</span>}
                    action={[
                        <IconButton
                            key='close'
                            aria-label='Close'
                            color='inherit'
                            onClick={this.placeOrderMsgOnCloseHandler}
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
