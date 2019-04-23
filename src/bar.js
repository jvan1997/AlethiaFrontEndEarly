
import React, { Component } from 'react';
import {firebaseApp} from "./firebase";
import { Button} from 'react-bootstrap';
import './App.css';
import { withRouter } from 'react-router-dom';
import logo from './headerIcon.png';
import ethereum from './Images/ethereum.png'

function user() {
	   // console.log("What:" + firebaseApp.auth().currentUser.email);
		return firebaseApp.auth().currentUser;
	}
	function db() {
		return firebaseApp.firestore().collection('users');
	}
	function entry() {
		return db().doc(user().email);
	}
class Bar extends React.Component {
	constructor(props){
		  super(props);

		  this.state = {name:"",logged:false,}
  	
 }
 loadInfo(){
	var that = this;
	firebaseApp.auth().onAuthStateChanged(function(user) {
		if (user) {
			var data = {};
			var getName = entry().get().then(function(doc) {
				//console.log(doc.data().length);
				data = doc.data();
		//        console.log(people);
				return data;
			});
			var namePromise = getName.then(function(datas){
			//	console.log(datas);
				that.setState({
					...that.state,
					name:datas['information']['name']
			})});
		} else {
			// No user is signed in.
		}
		});
 }
 componentDidMount() {
	let test = JSON.parse(localStorage.getItem("logged"));
	console.log("bar"  + test);
	this.setState({logged:test});
}
	goTo(event){
		var destination = event.target.value;
		this.props.history.push(`/${destination}`);
	}
	goToImg(event){
		var destination = event.target.alt;
		this.props.history.push(`/${destination}`);
	}
	signOutUser(){

        firebaseApp.auth().signOut().then(function() {
						console.log('Signed Out');
						let tokenKey = "logged";
						let tokenValue = false;
						window.localStorage.setItem(tokenKey, JSON.stringify(tokenValue));
						this.props.history.push('/');
          }.bind(this), function(error) {
            console.error('Sign Out Error', error);
					});

    }
	render() {
    let test = JSON.parse(localStorage.getItem("logged"));
		if(test){
	return(
	<nav class="flex items-center justify-between flex-wrap bg-transparent p-2">
	<div class="flex items-center flex-no-shrink text-white pl-6 mr-6">
	<img class="border rounded fill-current mr-2 " width="60" height="60" alt="" style={{cursor:'pointer'}} onClick={e => this.goToImg(e)} src={logo} />
	<button class="text-grey-darkest -mt-1 font-fancy font-bold  ml-2 mr-3 text-4xl cursor-pointer" value="" onClick={e => this.goTo(e)} > X </button>

	<img class="rounded fill-current mr-2 " width="40" height="40" alt="" style={{cursor:'pointer'}} onClick={e => this.goToImg(e)} src={ethereum} />

		</div>
<div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
	<div class="text-sm lg:flex-grow">
	</div>
	<div>
	<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>Home</button>
	<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="about" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>About</button>
<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="profile" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>Profile</button>
		<button class="inline-block px-4 py-2 ml-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" style={{cursor:'pointer'}} onClick={() => this.signOutUser()}>Sign Out</button>
	</div>
</div>
</nav>
);
    
	}
else{
	return(
		<nav class="flex items-center justify-between flex-wrap bg-transparent p-2">
		<div class="flex items-center flex-no-shrink text-white pl-6 mr-6">
	<img class="border rounded fill-current mr-2 " width="60" height="60" alt="" style={{cursor:'pointer'}} onClick={e => this.goToImg(e)} src={logo} />
		</div>
<div class="block lg:hidden">
	<button class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
		<svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
	</button>
</div>
<div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
	<div class="text-sm lg:flex-grow">

	</div>
	<div>
	<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>Home</button>
	<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="about" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>About</button>

	<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="login" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>Login</button>
		<button class="inline-block px-4 py-2 ml-2 mr-2 leading-none font-fancy font-bold text-lg border rounded text-white border-white hover:border-grey-dark hover:text-grey-dark mt-4 lg:mt-0" value="signup" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>Sign Up</button>
	</div>
</div>
</nav>
);
}}
}

export default withRouter(Bar);
// 	return (
		// <div class="text-right">
		// Welcome {this.state.name}      
		// <Button value="" class="float-right" onClick={e => this.goTo(e)}> Home</Button>
		// <Button value="profile" class="float-right" onClick={e => this.goTo(e)}> Profile</Button>
    //     <Button class="float-right" onClick={() => this.signOutUser()}> Logout</Button>
		// </div>
		// )	