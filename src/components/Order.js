import React, { Component } from 'react'
import { formatPrice } from '../helpers'
import PropTypes from 'prop-types';

import { TransitionGroup , CSSTransition } from '../../node_modules/react-transition-group'

 class Order extends Component {
     
    renderOrder = this.renderOrder.bind(this);
    
    renderOrder(key){
        const fish = this.props.fishes[key];
        const count = this.props.order[key];
       
        // Transition Options
        const transitionOptions = {
          classNames: "order",
          key,
          timeout: { enter: 500, exit: 500 }
        };

        if (!fish) return null;

        if(!fish || fish.status === 'unavailable'){
          return(
            <CSSTransition {...transitionOptions}>
              <li key={key}>
                Sorry {fish ? fish.name : "fish"} is no longer available
              </li>
            </CSSTransition>
          )
        }

        return (
          <CSSTransition {...transitionOptions}>
            <li key={key}>
              <span>
                <TransitionGroup component="span" className="count">
                  <CSSTransition
                    classNames="count"
                    key={count}
                    timeout={{ enter: 500, exit: 500 }}
                  >
                    <span>{count}</span>
                  </CSSTransition>
                </TransitionGroup>
                 lbs {fish.name}
                {formatPrice(count * fish.price)}
                <button onClick={() => this.props.removeFromOrder(key)}>
                  &times;
                </button>
              </span>
            </li>
          </CSSTransition>
        );
    }
    render() {
        const orderIds = Object.keys(this.props.order); 
        const total = orderIds.reduce((prevTotal, key) =>{
            const fish = this.props.fishes[key];
            const count = this.props.order[key];
            const isAvailable = fish && fish.status === 'available';
            if(isAvailable){
                return prevTotal + (count*fish.price || 0)
            }
            return prevTotal;
        }, 0);
        return (
            
            <div className="order-wrap">
              <h2>Order</h2>
              <TransitionGroup component="ul" className="order">
                {orderIds.map(this.renderOrder)}
              </TransitionGroup>
              <div className="total">
                Total:
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
        )
    }
}


Order.propTypes  = {
    fishes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    removeFromOrder: PropTypes.func.isRequired
};

export default Order;