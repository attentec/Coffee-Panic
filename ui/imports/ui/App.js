import React, { PropTypes, Component } from 'react';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import  { Measurements } from '../api/measurements.js';

function RenderLoggedIn(props) {
    return (
      <div className="container">
        <AccountsUIWrapper />
        <header>
          <h1>Coffee-Panic</h1>
          <ShoppingList measurements={props.measurements}/>
        </header>
      </div>
    );
}

function RenderGuest(props) {
    return (
      <div className="container">
        <AccountsUIWrapper />
        <header>
          <h1>Coffee-Panic</h1>
          Please log in to view shopping list
        </header>
      </div>
    );
}

function CoffeeList(props) {
    const timeOption = { hour: "2-digit", minute: "2-digit"}

    const tableStyle = {
        borderCollapse: "collapse",
        width: "100%",
        marginBottom: 20
    }

    const cellStyle = {
        border: "1px solid #dddddd",
        textAlign: "left",
        padding: 8
    }

    const rowStyle = {
        backgroundColor: "#dddddd"
    }

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={cellStyle}>ScaleId</th>
                    <th style={cellStyle}>Timestamp</th>
                    <th style={cellStyle}>Coffe weight(g)</th>
                </tr>
            </thead>
            <tbody>
                {props.measurements.map((m, index) => 
                    <tr key={m._id._str} style={index % 2 == 0 ? rowStyle : {}}>
                        <td style={cellStyle}>
                            {m.scaleId}
                        </td>
                        <td style={cellStyle}>
                            {m.timestamp.toLocaleDateString('sv-SE', timeOption)}
                        </td>
                        <td style={cellStyle}>
                            {m.valueInGrams}  
                        </td>
                    </tr>
                )}
            </tbody>
      </table>
    );
}

// App component - represents the whole app
class App extends Component {
  render() {
  	if (this.props.user) {
      return <RenderLoggedIn measurements={this.props.measurements} />
  	}
    return <RenderGuest />;
  }
}

App.propTypes = {
   user: PropTypes.object,
   measurements: PropTypes.array
};

export default createContainer(() => {
  return {
    user: Meteor.user(),
    measurements: Measurements.find({}).fetch()
  };
}, App);


class ShoppingListItem extends Component {

	removeFromShoppingList() {
		this.props.callback(this.props.item.name);
	}

	render() {
		return(<div style={{background:"orange"}}>
				<div>{this.props.item.name}</div>
				<button onClick={this.removeFromShoppingList.bind(this)}>-</button>
			</div>
		);
	}
}

class InventoryItem extends Component {

	addToShoppingList() {
		this.props.callback(this.props.item.name);
	}

	render() {
		return(<div style={{background:"yellow"}}>
				<div>{this.props.item.name}</div>
				<button onClick={this.addToShoppingList.bind(this)}>+</button>
			</div>);
	}
}

class Inventory extends Component {

	render() {
		var items = this.props.items;
		var callback = this.props.callback;
		return (<div>{ items.map(function(item) {
			return <InventoryItem key={item.name} item={item} callback={callback} />
		}) }</div>);
	}
}


class ShoppingList extends Component {

	setStateOnItemInShoppingList(itemName, state) {
		this.setState({inkopslista: this.state.inkopslista.map(function(item) {
			if (item.name == itemName) {
				return { name: itemName, out_of_stock: state };
			}
			return item;
		})});
	}

	addItemToShoppingList(itemName) {
		this.setStateOnItemInShoppingList(itemName, true);
	}

	removeItemFromShoppingList(itemName) {
		this.setStateOnItemInShoppingList(itemName, false);
	}

	constructor(props) {
		super(props);
	
		this.state = {
			inkopslista: [
				{
					name: "Slem",
					out_of_stock: true
				},
				{
					name: "Kaffe",
					out_of_stock: true
				},
				{
					name: "Knekebroe",
					out_of_stock: true
				},
				{
					name: "Ost",
					out_of_stock: false
				},
				{
					name: "Frukt",
					out_of_stock: false
                },
            ]
		};
	}
 
    groupMeasurements(measurements) {
        let groupedMeasurements = {}
        for(let m of measurements){
            if (!groupedMeasurements[m.scaleId]){
                groupedMeasurements[m.scaleId] = [m]
            } else {
                groupedMeasurements[m.scaleId].push(m);                
            }
        }
        let listgroupedMeasurements = []
        for (const key of Object.keys(groupedMeasurements)) {
            listgroupedMeasurements.push(groupedMeasurements[key]);
        }
        return listgroupedMeasurements;
    }

	render() {
        let groupedMeasurements = this.groupMeasurements(this.props.measurements);
		var removeItemCallback = this.removeItemFromShoppingList.bind(this);
		var buylist = [];
		this.state.inkopslista.map(function (item) {if (item.out_of_stock) {buylist.push(item)}})
		return (<div>
				{buylist.map(function (item) { 
					return (<ShoppingListItem key={item.name} item={item} callback={removeItemCallback} />)})}
				<Inventory items={this.state.inkopslista} callback={this.addItemToShoppingList.bind(this)} />
                <div className="coffee">
                {groupedMeasurements.map((group) => <CoffeeList key={group[0].scaleId}measurements={group} />)}
                </div>
            </div>
		);
	}
}