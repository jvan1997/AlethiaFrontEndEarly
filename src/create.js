import React, { Component } from 'react';
import logo from './Images/logo.png';
import './App.css';
import './index.css';
import {Router, Route, Link, RouteHandler,withRouter} from 'react-router-dom';
import {firebaseApp} from "./firebase";
import { Button} from 'react-bootstrap';
import Bar from './bar';
import './progress-bar-styles.css';
import CircularProgressBar from 'react-circular-progressbar'

function user() {
//    console.log("What:" + auth.currentUser.email);
    return firebaseApp.auth().currentUser;
}
function db() {
    return firebaseApp.firestore().collection('users');
}
function entry() {
    return db().doc(user().email);
} 

var fileSelect;
var pdfjsLib;

class Create extends Component {
  componentDidMount () {
    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.min.js";
    script.async = true;
    script.onload = this.pdfLibraryLoaded

    document.body.appendChild(script);
}
	constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname:'',
            sigid: '', 
            major: '', 
            date: new Date(),
            units: '',
            file: undefined,
            progressBarPercentage:0,
            progressBarPercentageText:'0%',
            showProgressBar:false
        };
	
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePDFSubmit = this.handlePDFSubmit.bind(this)
    }  
    onChange = date => this.setState({ date })
        backTrack(){
     	this.props.history.goBack();
     }  
     componentWillMount(){
        let test = JSON.parse(localStorage.getItem("logged"));
        if(!test){
            this.props.history.push('/');
        }
     }
     componentWillUnmount() {
		clearInterval(this.timeout);
	  }
  render() {
    return (
      
        <div class="flex justify-center items-center h-full" >
        <div class="container-xl mx-auto pt-24 bg-transparent rounded">
	  <h1 class=" font-fancy font-bold text-lg text-white mb-4 pl-16 text-3xl "> Create Certificate </h1>
    <form onSubmit={this.handleSubmit}>
            <div class="flex justify-center col-md-6 items-center">
                <p class="text-white font-fancy font-bold text-lg">First Name:</p>
                <input class="shadow ml-12 mt-2 mb-2 appearance-none font-fancy font-bold border rounded w-1/2 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                </div>
                <div class="flex justify-center col-md-6 items-center">
                <p class="text-white font-fancy font-bold text-lg">Last Name:</p>
                <input class="shadow ml-13 mt-2 mb-2 appearance-none font-fancy font-bold border rounded w-1/2 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="surname" type="text" name="surname" value={this.state.surname} onChange={this.handleChange}/>
                </div>
                <div class="flex justify-center col-md-6 items-center">
                <p class="text-white font-fancy font-bold text-lg">Signature ID:</p>
                <input class="shadow ml-11 mt-2 mb-2 appearance-none font-fancy font-bold border rounded w-1/2 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="sigid"  type="text" name="sigid"  onChange={this.handleChange}/>
                </div>
                <div class="flex justify-center col-md-6 items-center">
                <p class="text-white font-fancy font-bold text-lg">Institution:</p>
                <input class="shadow ml-14 mt-2 mb-2 appearance-none font-fancy font-bold border rounded w-1/2 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="institution"  type="text" name="institution"  onChange={this.handleChange}/>
                </div>
                <div class="flex justify-center col-md-6 items-center">
                <p class="text-white font-fancy font-bold text-lg">Approval Date:</p>
                <input class="shadow ml-8 mt-2 mb-2 appearance-none font-fancy font-bold border rounded w-1/2 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="date"  type="text" name="date"  onChange={this.handleChange}/>
                </div>
        <div class="flex justify-left pl-4 col-md-6 items-center ">
            <p class="text-white font-fancy font-bold text-lg mr-16">Major:</p>
            
             <select class="block ml-6 h-8 w- pl-2 pr-1 font-fancy font-bold appearance-none bg-whiteborder border-purple-lighter text-black ml-2 rounded leading-tight focus:outline-none focus:bg-white focus:border-grey"  id="major" name="major" value={this.state.major} onChange={this.handleChange} >	
		        <option value="-1"> Select </option>
                <option value="BS Aerospace Engineering">Aerospace Engineering</option>
            <option value="BS Biomedical Engineering">Biomedical Engineering</option>
            <option value="BS Bioengineering Engineering">Biomedical Engineering</option>
		        <option value="BS Chemical Engineering">Chemical Engineering</option>
            <option value="BS Civil Engineering">Civil Engineering</option>
            <option value="BS Computer Engineering">Computer Engineering</option>
		        <option value="BS Electrical Engineering">Electrical Engineering</option>
            <option value="BS Industrial Engineering">Industrial Engineering</option>
            <option value="BS Mechanical Engineering">Mechanical Engineering</option>
            <option value="BS Software Engineering">Software Engineering</option>

          </select>
          </div>
        <div class="flex justify-center col-md-6 items-center">
                <p class="text-white font-fancy font-bold text-lg">Units Completed:</p>
                <input class="shadow ml-2 mt-2 mb-2 appearance-none border rounded w-1/2 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="units" type="text" name="units" value={this.state.units} onChange={this.handleChange}/>
                </div>
        <div class="pl-4">
        <button class="inline-block h-12 w-32 border-b-2 border-t-2 border-l-2 border-r-2 px-4 py-2 ml-2 mr-2 font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" type="button" onClick={() => this.backTrack()}> Cancel</button>
        <input class="inline-block h-12 w-32 border-b-2 border-t-2 border-l-2 border-r-2 px-4 py-2 ml-2 mr-2 font-fancy font-bold text-lg leading-none border rounded bg-transparent text-white border-white hover:border-grey hover:text-grey mt-4 mb-4 lg:mt-0" type="submit" value="Create" />
        </div>
    </form>

        <div>
            <form>
            <div class="flex items-center justify-center bg-transparent">
    <label class="w-48 h-14 flex flex-col items-center bg-transparent rounded shadow-lg tracking-wide uppercase border-2 border-white cursor-pointer hover:border-4 ">
        <svg class="w-8 h-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span class="mt-2 text-white font-fancy font-bold text-base leading-normal">Upload</span>
        <input type='file' class="hidden" name="file" onChange={this.handlePDFSubmit } />
    </label>
</div>
                
            </form>
            <div class="progbar" style={{width:'100px', height:'100px', margin:'auto', padding:'10px'}}>
            { this.state.showProgressBar ? <CircularProgressBar percentage={this.state.progressBarPercentage} className="progbar" text={`${this.state.progressBarPercentageText}`} /> : null}
            
            </div>
            
            </div>

              </div>
              </div>
    );
  }
  handleChange(event) {
   // console.log("doing stuff");
    //console.log(event.target.value);
    this.setState({
        [event.target.name]:event.target.value
	});
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ showProgressBar:true, progressBarPercentage: 0, progressBarPercentageText: "0"})
    console.log(event)
    let relevantState = { 
        "name": this.state.name,
        "surname": this.state.surname,
        "sigid": this.state.sigid,
        "major": this.state.major,
        "units": this.state.units,
        "file": this.state.file
    }
    
    // https://stackoverflow.com/questions/49686694/uploading-a-file-using-fetch-in-reactjs
    let url = 'http://localhost:8080/check'
    let options = {
        method: 'post',
        headers: {},
        
    }
    options.body = new FormData();
    for (let key in relevantState) {
    options.body.append(key, relevantState[key]);
    }

    var xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener("progress", e=>{
        if( e.lengthComputable){
            var percentComplete = Math.round(e.loaded * 100 / e.total)
            this.setState({ progressBarPercentage: percentComplete/2, progressBarPercentageText: (percentComplete/2)+ "%" })
        }
        else{
            console.log("cant compute size")
        }
    },false)
    
    // xhr.setRequestHeader("Content-Type","multipart/form-data")
    var self = this
    xhr.onreadystatechange = function(){
        if(this.readyState === XMLHttpRequest.DONE && this.status===200){
            console.log(xhr.responseText)
        console.log("abc")
        delete relevantState.file

        self.timeout = setInterval(() => {
            if (self.state.progressBarPercentage < 80) {
              let newP = self.state.progressBarPercentage+1;
              self.setState({ progressBarPercentage: newP, progressBarPercentageText:newP+"%" });
                }
            // 	else{
          // 		console.log("eh");
          //   		this.setState({i:0});
            // }
          }, 250);

        entry().update({"certificate":relevantState}).then(

            success => {
                self.timeout = setInterval(() => {
                    if (self.state.progressBarPercentage < 100) {
                      let newP = self.state.progressBarPercentage+1;
                      self.setState({ progressBarPercentage: newP, progressBarPercentageText: newP+"%" });
                        }
                    	else{
                            self.setState({ progressBarPercentage: 100, progressBarPercentageText:"Done!" })
                            alert("Created certificate");
                            self.backTrack();
                        }
                    }, 250);

                
            },
            err =>{
                console.log(err)
                self.setState({ progressBarPercentageText:"Error saving data" })
            }
        
        );
        
        
        }
        if(this.readyState === XMLHttpRequest.DONE && this.status >= 400){

            switch(this.status){
                case 400:
                alert("No file submitted")
                self.setState({ progressBarPercentageText:"Error can't find file" })
                break

                case 422:
                alert("Invalid sigid")
                self.setState({ progressBarPercentageText:"Error processing file" })
                break

                default:
                alert("Error")
                self.setState({ progressBarPercentageText:"Error" })

            }


        }
               
    }


    // this.timeout = setInterval(() => {
    //     if (this.state.percentage < 100) {
    //       let newP = this.state.percentage+1;
    //       this.setState({ percentage: newP });
    //         }
    //     // 	else{
    //   // 		console.log("eh");
    //   //   		this.setState({i:0});
    //     // }
    //   }, 250);
    xhr.open("POST", url, true)
    xhr.send(options.body)

    // https://stackoverflow.com/questions/38794180/fetch-data-with-react
    // let check = ()=>{
    //     return fetch(url, options)
    // }
    // check().then((response)=>{
    //     console.log(response)
    //     console.log("abc")
    //     delete relevantState.file
    //   if (response.status == 200) {
    //       console.log("bcd")
    //         entry().update({"certificate":relevantState}).then(
    //         success => {
    //         alert("Created certificate");
    //         },
    //         err =>{
    //             console.log(err)
    //         }
        
    //     );
    //     this.backTrack();
    //   }
    //   if (response.status >= 400) {
    //     alert("Invalid sigid")
    //   }
    // //   this.backTrack();
    // })



    

  }

  // PDF-related code

  handlePDFSubmit(ev){

        
    console.log(pdfjsLib)


    fileSelect = ev.currentTarget.files
    this.setState({file:ev.currentTarget.files[0]},
        ()=>{
            console.log(fileSelect)


            let reader = new FileReader()

            reader.onload = (e)=>{
                console.log(e.target.result)
                let data = e.target.result
                console.log(data)



    
                
                
               this.getPDFText(data)
               .then( (text) =>{
                console.log(`text is ${text}`)

                let strs = text.split("\n")
                console.log(strs)
                let name = ""
                let major = ""
                let units = 0

                let nameToken = "STUDENT NAME:"
                let majorToken = "MAJOR:"
                let unitsToken = "ALL COLLEGE:"

                for(var i=0;i<strs.length;i++){
                    if( strs[i].includes(nameToken)){
                        name = strs[i].split(nameToken)[1].trim()
                        console.log(name)
                        let nameComponents = name.split(" ")
                        let lastName = nameComponents[0].replace(",","")
                        let firstName = nameComponents[1]
                        this.setState({name:firstName, surname:lastName})
                    }
                    if( strs[i].includes(majorToken)){
                        major = strs[i].split(majorToken)[1].trim()
                        console.log(major)
                        this.setState({major:major})
                    }
                    if( strs[i].includes(unitsToken)){
                      units = strs[i].trim().split(/\s+/)
                      console.log(units)  
                  }

                }
                let totalUnits = units[4]
                this.setState({units:totalUnits})
               })
                
            
                
            }
            var file = fileSelect[0]
            console.log(file)
    
            console.log( `state.file is ${this.state.file}`)
            reader.readAsDataURL(this.state.file)
            
            

        })
}





  pdfLibraryLoaded(ev){
    pdfjsLib = window['pdfjs-dist/build/pdf']
    console.log('pdflibloaded')
    console.log(pdfjsLib)
}

/**
 * 
 * @param {*} data Is pdf read as data url
 */
async getPDFText(data){
    var loadingTask = pdfjsLib.getDocument(data);
    let pdf = await loadingTask.promise
    console.log(pdf)

    let pdfText = ''

    console.log(pdf.numPages)
    for(var i=1;i<=pdf.numPages;i++){
        let page = await pdf.getPage(i)
        // console.log(page)
        let textContent = await page.getTextContent()
        // console.log(textContent)

        pdfText = textContent.items.reduce( (acc,curr) => acc + curr.str +"\n", pdfText )
        // for( var j=0; j<textContent.items.length;j++){
        //     pdfText += textContent.items[j].str + "\n"
        // }
    }

    // console.log(pdfText)
    
    return pdfText
}



}
export default withRouter(Create);
