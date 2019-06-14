import React, { Component } from 'react';
import SignIn from './signin.jsx'
import Button from './button.jsx'
class ItemObj {
  constructor(id) {
    this.id = id;
    this.name = "Thing " + id;
  }

}

export default class Alchemy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      allItems: this.generateItems(),
      selectedItems: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.deselectItem = this.deselectItem.bind(this);
    this.craftItems = this.craftItems.bind(this);
  }

  generateItems() {
    let items = [];
    for (let i=0;i<10;i++) {
      items.push(new ItemObj(i));
    }
    return items;
  }

  async getItem(itemId) {
    await this.props.contract.getItem({ itemId: itemId });
  }

  async getItems(itemIds) {
    await this.props.contract.getItems({ itemIds: itemIds })
  }

  async craftItems() {
    let itemIds = this.state.selectedItems.map(item => item.id).sort();
    await this.props.contract.craft({
      sortedIds: itemIds
    })
  }

  selectItem(index) {
    if (this.state.selectedItems.length >= 2) {
      console.log("nah");
      return null;
    }
    console.log(item);
    let item = this.state.allItems[index]
    let items = this.state.selectedItems;
    items.push(item);
    this.setState({
      selectedItems: items
    })
  }

  deselectItem(index) {
    let items = this.state.selectedItems;
    items.splice(index, 1);
    this.setState({
      selectedItems:items
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  randomInt() {
    return Math.floor(Math.random() * 10000000) + 1;
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO
  }

  render() {
    return (
      <React.Fragment>
        <nav>Top Nav</nav>
        <SignIn wallet={this.props.wallet} />
        <div className="Alchemy">
          <ContentContainer>
            {this.state.selectedItems.length > 0 ?
              <div>
                {this.state.selectedItems.map((item, i) => {
                  return (
                    <DeselectWrapper key={item.id} last={i + 1 === this.state.selectedItems.length} >
                      <Item
                        index={i}  
                        callback={this.deselectItem}
                        id={item.id}
                        name={item.name}
                        image={item.image} />
                    </DeselectWrapper>)
                })}
                <Button disabled={this.state.selectedItems.length < 2} action={this.craftItems} description="Craft" />
              </div>
              :
              <p >
                Select items to craft
              </p>
            }
          </ContentContainer>
          <RightSideNav>
            <List callback={this.selectItem} items={this.state.allItems} />
          </RightSideNav>
        </div>
      </React.Fragment>
      )
  }
}

class DeselectWrapper extends Component {
  render() {
    return(
      <div className="DeselectWrapper">
        <div className="DeselectItem">
          { this.props.children }
        </div>
        {this.props.last ? "" : 
          <p className="plus">+</p>
        }
      </div>
    )
  }
}

class ContentContainer extends Component {
  render() {
    return(
      <div className="ContentContainer">
        { this.props.children }
      </div>
    )
  }
}

class RightSideNav extends Component {
  render() {
    return(
      <div className="RightSideNav">
        { this.props.children }
      </div>
    )
  }
}

class List extends Component {

  compareArray(_a, _b) {
    let a,b;
    [a,b] = [_a.id, _b.id];
    if (a < b || a == null)
      return 1;
    if (a > b)
      return -1;
    return 0;
  }

  sortArray() {
    return this.props.items.sort(this.compareArray);
  }

  render() {
    let sortedItems = this.sortArray();
    let items = sortedItems.map((item, i) => {
      return <Item
        callback={this.props.callback}
        index={i}
        key={item.id}
        id={item.id}
        name={item.name}
        image={item.image} />
    });
    return (
      <ul>
        {items}
      </ul>
    );
  }
}

class Item extends React.Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault(e);
    console.log(this.props.index);
    // TODO: Non-shitty events and shit
    this.props.callback(this.props.index);
  }

  render() {
    return (
      <li className="Item" onClick={ this.handleClick } >
        <div className="Image"
          style={{ backgroundImage: 'url(' + this.props.image + ')' }} > </div>
        <div className="Name" > {this.props.name} </div>
      </li>
    );
  }
}