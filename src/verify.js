import React, { Component } from 'react';
import './App.css';
import { Router, Route, Link, RouteHandler } from 'react-router-dom';
import './index.css';
import create from './Images/create.png';
import verify from './Images/verify.png';
import { withRouter } from "react-router-dom";
import { deploy } from './deploy';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
let util = require('util')
let ethjsUtil = require('ethereumjs-util')
let keypair = require('keypair');



class Verify extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			createdContractAddress: "",
			transactionHash: "",
			publicKey: "",
			metadataLoaded: false,
			compiled: false,
			verified: false,
			displayResults:false
		};
		this.setUpDeploy();
		this.setCompiled = this.setCompiled.bind(this)
		this.setVerified = this.setVerified.bind(this)
		this.setDisplayResults = this.setDisplayResults.bind(this)
	}

	async setUpDeploy() {
		let returns = await deploy();
		console.log(`returns is ${util.inspect(returns)}`);
		this.setState({
			createdContractAddress: returns.receipt.contractAddress,
			transactionHash: returns.transactionHash,
			metadataLoaded: true
		})

		// let hash =  "0x" + returns.compiledFactory.bytecode
		// let prefix = "\x19Ethereum Signed Message:\n" + hash.length
		// let prefixedHash = web3.utils.soliditySha3( hash + prefix)
		// let pk = ethjsUtil.ecrecover(  ethjsUtil.toBuffer(prefixedHash), returns.receipt.v, ethjsUtil.toBuffer(returns.receipt.r), ethjsUtil.toBuffer(returns.receipt.s))
		// let addrBuf = ethjsUtil.pubToAddress(pk)
		// let addr = ethjsUtil.bufferToHex(addrBuf)
		// console.log(`addr is ${addr}`)
		let pair = keypair();
		setTimeout( this.setCompiled,3000)
		this.setState({
			publicKey:pair.public
		})

	}
	downLoad= (e) => {

		html2canvas(document.querySelector("#transaction"),{width: 1200,
			height: 900
	  }).then(canvas => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({orientation:'l',unit:'px'});
	
			console.log(`canvas.width is ${canvas.width}`);
			console.log(`canvas.height is ${canvas.height}`)
			// console.log(imgData);
			console.log("second" + pdf.internal.pageSize.width);
			// var imgOffset = (pdf.internal.pageSize.width) / 8;
			// console.log("HMM" + imgOffset);
			pdf.addImage(imgData,'PNG',0,0,1030,964,"a","FAST");
			pdf.save("transaction.pdf");
		});
	
	}
	componentWillMount(){
        let test = JSON.parse(localStorage.getItem("logged"));
        if(!test){
            this.props.history.push('/');
        }
     }
	backTrack() {
		this.props.history.goBack();
	}
	goTo(event) {
		var destination = event.target.value;
		this.props.history.push(`/${destination}`);
	}
	setCompiled(){
		this.setState({
			compiled:true
		})
		setTimeout(this.setVerified,3000)
	}

	setVerified(){
		this.setState({
			verified:true
		})
		setTimeout(this.setDisplayResults,3000)
	}
	setDisplayResults(){
		this.setState({
			displayResults:true
		})
	}
	render() {
		if (!this.state.metadataLoaded) {

			return (
				<div class="flex items-center h-full " >
					<div class="container-xl h-full mx-auto pt-24 bg-transparent rounded">
						<VerifyHeader />
						<LoadingComponent />
						<br />
						<div class="mt-8  justify-center col-md-6 items-center" >
							<button class="inline-block h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 px-4 py-2 mr-2  font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" value="create" style={{ cursor: 'pointer' }} onClick={e => this.backTrack(e)}>Go Back</button>
						</div>
					</div>
				</div>
			)
		}
		else {
			return (
				<div class="flex items-center h-full justify-center" >
					<div class="h-full  mx-auto pt-24 bg-transparent rounded">
						<VerifyHeader />
						<div id="transaction" class="container-xl bg-white font-fancy text-lg rounded text-center h-full px-6 py-4 border border-grey-dark">
						<span class="font-bold">Compiling Keypair... {this.state.compiled ? "Done!" : null} </span>

						{this.state.compiled ?
							(
								<span>
									<br />
									<span class="font-bold "> Verifying Keypair... {this.state.verified ? "Done!" : null} </span>

									{this.state.verified ? (
										
										<span>
											<br/>
											<span class="font-bold "> Success! Cert has been verified!</span>
											{this.state.displayResults ? (
												<span>
													<span>
														<div class="font-bold mt-2">Contract Address: </div>{this.state.createdContractAddress}
														<div class="flex flex-col items-center mt-4 mb-4">
															<div class="w-5/6  border-b "/>
														</div>
														<div class="font-bold ">Transaction Hash:</div> {this.state.transactionHash}
														<div class="flex flex-col items-center mt-4 mb-4">
															<div class="w-5/6  border-b "/>
														</div>
														<div class="font-bold">Public Key:</div>
														<span class="mb-2" style={{"white-space":"pre-line"}}> {this.state.publicKey}
														</span>
													</span>
													<br />	
												</span>

											) : null}
											
										</span>
									) : null}
								</span>
							) : null
						}
</div>
						<div class="mt-8  flex w-full justify-between col-md-6 items-center" >
							<button class="inline-block h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 px-4 py-2 mr-2  font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" value="create" style={{ cursor: 'pointer' }} onClick={e => this.backTrack(e)}>Go Back</button>
							{this.state.displayResults  && (
							<button class="inline-block ml-8 h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" value="profile" style={{cursor:'pointer'}} onClick={this.downLoad}>Download</button>
							)
							}
						</div>
					</div>
				</div>
			)

		}
	}
}
export default withRouter(Verify);

const LoadingComponent = (props) => {
	return (
		<div class="container-xl bg-white font-fancy font-bold text-lg rounded text-center h-full px-4 py-4 border border-grey-dark">
		<span class="font-fancy font-bold text-lg"> Loading cert metadata ... </span>
		</div>
	)
}

const VerifyHeader = (props) => {
	return (
		<div>
			<p class="w-full block text-white text-5xl font-fancy font-bold text-center justify-center mb-8">
				Verify Certificate
        		</p>
			<span class="text-white text-3xl font-fancy font-bold text-center justify-center mb-8" > </span>
		</div>
	)
}