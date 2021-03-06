import React from 'react';
import './App.css';
import './index.css';
import {withRouter} from "react-router-dom";
/**
 * This is the home page. Loads a welcome message 
 * and options to either create or view certificates
 * 
 */
class Home extends React.Component{
	constructor(props) {
			super(props);
			this.state = {
				i : 0,
				maintxt :'Decentralized Certificates on the Ethereum Blockchain',
				speed : 100,
				displaytxt: '',
				tmpTitle: 'Al-eth-ia   ',
				fullTitle: 'Alethia',
				j: 0
			};


	}
	componentDidMount() {
		this.timeout = setInterval(() => {
		  	if (this.state.i < this.state.maintxt.length) {
			let newI = this.state.i+1;
			this.setState({ i: newI });
			  }
		}, 80);
		this.timeout = setInterval(() => {
		   if(this.state.j < this.state.tmpTitle.length){
			  let newJ = this.state.j+1;
			  this.setState({ j: newJ });
		   } 
	  }, 200);
	  }
	  componentWillUnmount() {
		clearInterval(this.timeout);
	  }
		
	goTo(event){
		var destination = event.target.value;
		this.props.history.push(`/${destination}`);
	}
	render() {
			let displaytext = this.state.maintxt.substring(0,this.state.i);
			let displayTitle ='';
			if(this.state.j >= this.state.tmpTitle.length){
				displayTitle = this.state.fullTitle;
			}else{
				displayTitle = this.state.tmpTitle.substring(0,this.state.j);
			}
			return (
				<div class="flex items-center h-full " >
				<div class="container-xl h-full mx-auto pt-24 bg-transparent rounded">

				<p class="w-full block text-white text-5xl font-fancy font-bold text-center justify-center mb-8">
        			{displayTitle}
        		</p>
				<span class="text-white text-3xl font-fancy font-bold text-center justify-center mb-8" >{displaytext}</span>
				<div class="mt-8 flex justify-center col-md-6 items-center" >
					<button class="inline-block h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 px-4 py-2 mr-2  font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" 
					value="create" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>Create Certificate</button>
					<button class="inline-block h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 px-4 py-2 ml-2 font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" 
					value="profile" style={{cursor:'pointer'}} onClick={e => this.goTo(e)}>View Certificate</button>
				</div>
				</div>
				</div>
			);
	}
}
export default withRouter(Home);
