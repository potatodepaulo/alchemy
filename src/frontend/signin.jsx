import React, { Component } from 'react';
import Button from './button.jsx'
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false
    }

    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
  }


  async componentWillMount() {
    let loggedIn = await this.checkLoggedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async checkLoggedIn() {
    return this.props.wallet.isSignedIn();
  }

  signedOutFlow() {
    this.setState({
      loggedIn: false,
      loaded: true
    });
  }

  async signedInFlow() {
    const accountId = await this.props.wallet.getAccountId()
    this.setState({
      loggedIn: true,
      loaded: true
    })
  }

  async requestSignIn() {
    console.log("It's trying");
    this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      window.nearConfig.appName);
    this.signedInFlow();
  }

  requestSignOut() {
    this.props.wallet.signOut();
    this.signedOutFlow();
  }

  render() {
    if (this.state.loaded && this.state.loggedIn) {
      return (
        <div>
          <Button action={this.requestSignOut} description="Sign out" />
        </div>
      )
    } else if (this.state.loaded) {
      return (
        <Button action={this.requestSignIn} description="Please Log In" />
      )
    } else {
      return ("Loading...");
    }
  }
}
