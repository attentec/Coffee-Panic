import React, { Component } from 'react';




// App component - represents the whole app
export default class App extends Component {

  render() {
    return (
      <div className="container">
        <header>
          <h1>Coffee-Panic</h1>
          <ShoppingList />
        </header>
      </div>
    );
  }
}


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
				}
			]
		};
	}
 
	render() {
		var removeItemCallback = this.removeItemFromShoppingList.bind(this);
		var buylist = [];
		this.state.inkopslista.map(function (item) {if (item.out_of_stock) {buylist.push(item)}})
		return (<div style={{background: "blue"}}>
				{buylist.map(function (item) { 
					return (<ShoppingListItem key={item.name} item={item} callback={removeItemCallback} />)})}
				<Inventory items={this.state.inkopslista} callback={this.addItemToShoppingList.bind(this)} />
			</div>
		);
	}
}