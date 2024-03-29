import React  from 'react'
// import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';


class App extends React.Component {
    // get initial state
    state = {
        fishes: {},
        order: {}

    }
    addFish = this.addFish.bind(this);
    loadSamples = this.loadSamples.bind(this);
    addToOrder = this.addToOrder.bind(this);
    updateFish = this.updateFish.bind(this);
    removeFish = this.removeFish.bind(this);
    //removeFromOrder = this.removeFromOrder.bind(this);

    
    componentWillMount() {
        //this run right before the the <App> is rendered
        this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`
        , {
            context: this,
            state: 'fishes'
        });
        // check if there is any order in localStroge
        const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);
        if (localStorageRef) {
            // Update our App component's order state
            this.setState({
                order: JSON.parse(localStorageRef) 
            });
        }
    }


    componentWillUnmount(){
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProp, nextState){
        localStorage.setItem(`order-${this.props.match.params.storeId}`, JSON.stringify(nextState.order));
    }
    


    addFish(fish) {
        // update our state
        const fishes = {...this.state.fishes};
        // add in our new fishes
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // set our state
        this.setState({fishes});
    }

    updateFish(key, updatedFish){
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes})
    }

    removeFish(key){
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({fishes});
    }

    loadSamples(){
        this.setState({
            fishes: sampleFishes
        });
    }
   

    addToOrder(key){
        // take a copy of our state
        const order = {...this.state.order};
        // Add or Update the new number of Fish Order
        order[key] = order[key] + 1 || 1;
        // update our order
        this.setState({order})
    }

    removeFromOrder = (key) => {
        const order = {...this.state.order};
        delete order[key];
        this.setState({order});
    }

    render() {
        // comments here...
        return (
            <div>
                <div className="catch-of-the-day">
                    <div className="menu">
                        <Header age="5000" cool={true} tagline="Fresh Seafood Market" />
                        <ul className="list-of-fishes">
                            {
                                Object
                                .keys(this.state.fishes)
                                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder = {this.addToOrder} />)
                            }
                        </ul>
                    </div>
                    <Order 
                        fishes={this.state.fishes} 
                        order={this.state.order} 
                        // params={this.props.match.params}
                        removeFromOrder={this.removeFromOrder}
                        />
                    <Inventory 
                        addFish = {this.addFish} 
                        loadSamples = {this.loadSamples} 
                        fishes = {this.state.fishes}
                        updateFish = {this.updateFish} 
                        removeFish = {this.removeFish} 
                        removeFromOrder = {this.removeFromOrder} 
                        storeId = {this.props.match.params.storeId}
                    />
                </div> 
            </div>
        ) 
    }
}


export default App;



