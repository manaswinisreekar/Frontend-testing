//Sample HomePage 

import React, {Component} from 'react';
//import './Home.css';
import Header from '../../common/header/Header';

class Home extends Component{
    render(){
        return(
            <div>
                            <Header showSearchBox={true}/>

            </div> 
        )    
    }
}

export default Home;