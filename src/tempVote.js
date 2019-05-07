
import React, { Component } from 'react';
import {firebaseApp} from "./firebase";
import './App.css';
import { withRouter } from 'react-router-dom';
import {user,db,entry} from './functions';
import logo from './headerIcon.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
  
class TempVote extends React.Component {
	constructor(props){
    super(props);
    this.state = {
		loading: true,
        inputField: '',
        data: {},
        verified: false,
        inputtedUser: null,
        voted:[],
        errorMessage:'',
        users:[],
        viewing: false,
        certificate:null
    };
    this.removeSelection = this.removeSelection.bind(this);
}
removeSelection(){
    this.setState({viewing:false,certificate:null})
}

voteFor(){
    let voted = this.state.voted;
    voted.push(this.state.inputtedUser);
    console.log(voted);
    firebaseApp.firestore().collection('approved').doc('voted').set({voted}).then((returns) =>{
        alert("You have verified this user");
        this.removeSelection();
    })
}
/**
   * When the App component mounts, we listen for any authentication
   * state changes in Firebase.
   * Once subscribed, the 'user' parameter will either be null 
   * (logged out) or an Object (logged in)
   */
  componentWillMount() {
        let test = JSON.parse(localStorage.getItem("logged"));
        if(!test){
            this.props.history.push('/');
            
        }
     else{
    this.authSubscription = firebaseApp.auth().onAuthStateChanged((user2) => {
		firebaseApp.firestore().collection('approved').doc('voted').get().then((doc) => {
			if (doc.exists) {
                if(doc.data()['voted'].indexOf(user2.email) > -1){
                    this.setState({verified:true});
                }
                this.setState({voted:doc.data()['voted'], loading:false, currentUser:user2.email});
			} else {
				this.setState({ voted: null });
			}
			this.setState({
				loading: false,
			  });
		})
        firebaseApp.firestore().collection('users').get().then((doc) => {
            let UsersArr = []
            console.log(doc.docs);
            for(let aDoc in doc.docs){
                console.log(doc.docs[aDoc].id);
                UsersArr.push(doc.docs[aDoc].id);
            }
            this.setState({users:UsersArr});
        });
            
        
    });
  }}
  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
  componentWillUnmount() {
    this.authSubscription();
  }
isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

  handleNameFind(e){
      console.log(this.state.users);
      e.preventDefault();
      let email = this.refs.email.value;
      if(this.state.currentUser === email){
        this.setState({errorMessage:'Cannot verify yourself.'});
      }
      else if(this.state.voted.indexOf(email) > -1){
          this.setState({errorMessage:'This user is already verified.'});
      }
      else if(!(this.state.users.indexOf(email) > -1)){
          this.setState({errorMessage:'This user does not exist.'});
      }
      else{
          console.log("Looking for: " + email);
        firebaseApp.auth().onAuthStateChanged((user2) => {
            firebaseApp.firestore().collection('users').doc(email).get().then((doc) => {
                if (doc.exists) {
                    let data = doc.data()['certificate'];
                    console.log(data);
                    if(this.isEmpty(data)){
                        this.setState({errorMessage:'This user has not uploaded their certificate yet.'});
                    }
                    else{
                        if(data['major'] && data['name'] && data['surname'] && data['units']){
                            this.setState({certificate:data,viewing:true, inputtedUser:email, errorMessage:''});
                        }
                        else{
                            this.setState({errorMessage:'This user is missing information in their certificate'});
                        }
                    }
                }
                else{
                    this.setState({errorMessage:'This user has no information on their account.'});
                }
            }
            )
        }
        )
      }
  }
getStatus(){
    let statusArr = [];
    if(this.state.verified === false){
        statusArr.push(
            <p className="text-red text 3xl"> Unverified</p>
        )
    }
    else{
        statusArr.push(
            <p className="text-green text 3xl"> Verified</p>
        )
    }
    return statusArr;
}

goTo(event){
	var destination = event.target.value;
	this.props.history.push(`/${destination}`);
}

editCert = (e) => {
	this.props.history.push("/profile/editCert");
}
createCert = (e) => {
	this.props.history.push("/create");
}
render() {
    if(this.state.loading){
        return null;
    }
    if(this.state.viewing){
        let dataUI = this.state.certificate;
            let major = dataUI["major"];
			let fname = dataUI["name"];
			let lname = dataUI["surname"];
            return(
                <div class="flex items-flex  h-full " >
                <div class="h-full  mx-auto pt-20 bg-transparent rounded text-center">
                 <div>
                  <h1 class=" font-fancy font-bold text-lg text-white mb-8 ml-8 text-5xl "> Vote Page </h1>
                  </div>
            <div class="flex pb-4">
            <div class="container-sm flex flex-col rounded border-4 ">
            <div id="certificate" class="w-auto align-center bg-white container-sm shadow-lg text-center font-fancy font-bold  px-8 pt-6 pb-8 m-auto">
                <div class="text text-xs mb-2"> This certificate is intended for verification purposes.</div>
                <div class="flex flex-col items-center mt-2 mb-8">
                    <div class="w-1/2  border-b mt-2"/>
                </div>
                
                <div class="text text-3xl mb-2"> {fname} </div>
                
                <div class="text text-3xl mb-2"> {lname} </div>
                <div class="text text-xl mt-2 mb-2"> {major}</div>
                <div class="text text-2xl mt-2 mb-6"> San Jose State University</div>
                <div class="flex flex-col items-center">
                </div>
                <div class="flex flex-col items-center mt-2 mb-8">
                    <div class="w-1/2  border-b mt-2"/>
                </div>
                <div class="text-base italic mb-14"> This certifies that the named individual's college degree is valid.</div>
                <img class="border rounded fill-current mr-2 " width="100" height="100" src={logo} />
            </div>
            
            </div>	
            <div class="mt-8 flex flex-col">
            <button class="inline-block ml-8 h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" 
            value="profile" style={{cursor:'pointer'}} onClick={(e) => this.removeSelection()}>Abstain Vote</button>
            <button class="inline-block ml-8 h-16 w-48 border-b-2 border-t-2 border-l-2 border-r-2 font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" 
            value="verify" style={{cursor:'pointer'}} onClick={(e) => this.voteFor(e)}>Vote</button>
            </div>
            </div>
            </div>
            </div>
            )
    }
            return(
                <div class="flex items-flex  h-full " >
                <div class="h-full  mx-auto pt-20 bg-transparent rounded text-center">
                 <div>
                  <h1 class=" font-fancy font-bold text-lg text-white mb-8 ml-8 text-5xl "> Vote Page </h1>
                  </div>
                  <div class="w-full">
    <div class="flex items-center justify-center">
      <div class="container mx-24 bg-white rounded shadow-lg">
        <div class="px-12 py-6">
          <div class="text-center">
            <h1 class="font-fancy text-3xl text-grey-darkest leading-loose my-3 w-full">Verified Status: {this.getStatus()}</h1>
            { this.state.verified ? (
            <div class="w-full text-center">
              <form onSubmit={this.handleNameFind.bind(this)} action="#">
                <div class="max-w-sm mx-auto p-1 pr-0 flex items-center">
                  <input type="email" placeholder="Intended User" ref="email" className="flex-1 font-fancy text-xl  font-bold text-black appearance-none rounded shadow-md p-3 text-grey-dark mr-2 focus:outline-none"/>
                  <button type="submit" class="appearance-none bg-purple-lighter text-white text-base shadow-md font-semibold font-fancy tracking-wide uppercase p-3 rounded shadow hover:bg-indigo-lighter">Find User</button>
                </div>
                <p className="text-red text-xl font-fancy mt-4 font-bold">{this.state.errorMessage}</p>

              </form>
            </div>
            ):(
            <div className="text-grey-darkest text-xl font-fancy font-bold">Certificate is not verified by verified Alumni</div>
            )
        }
          </div>
        </div>
      </div>
    </div>
</div>                             
</div>
                  </div>

            );
        }
            
    
	
	
	
}

export default withRouter(TempVote);
