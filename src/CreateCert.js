import React, {Component} from 'react';
import logo from './logo.png';

var fileSelect;
var pdfjsLib

class CreateCert extends Component{
    componentDidMount () {
        const script = document.createElement("script");

        script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.min.js";
        script.async = true;
        script.onload = this.pdfLibraryLoaded

        document.body.appendChild(script);
    }

    constructor(props) {
        super(props);
	this.count = 0;
        this.state = {
            name: '',
            sigid: '', 
            major: '', 
            units: '',
    showComponent:false,
            file: null,
        };
	this.majorData = [
		{ value: 'USA', name: 'USA' },
		{ value: 'CANADA', name: 'CANADA' }            
];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formSubmit = this.formSubmit.bind(this)
        // needs to be bound else says 'this is undefined'
} 
    render() {
        return (
          <div className="create">
            <header className="App-header">
              <img src={logo} alt="Logo" />
              <p>
                Issue and Verify digital certificates with Ethereum Smart Contracts
              </p>
        <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input id="name" type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                </label>
            <br />
                Signature ID:
                <input id="sigid"  type="text" name="sigid" onChange={this.handleChange}/>
            <br />
                Major:
                 <select
         id="major"
         name="major"
             defaultValue={this.state.selectValue} 
             onChange={this.handleChange} 
             value={this.state.major}
             >	
            <option value="-1"> Major </option>
                <option value="0">Aerospace</option>
                <option value="1">Biomedical</option>
                <option value="2">Bioengineering</option>
            <option value="3">Chemical</option>
                <option value="4">Civil</option>
                <option value="5">Computer</option>
            <option value="6">Electrical</option>
                <option value="7">Industrial</option>
                <option value="8">Mechanical</option>
                <option value="BS Software Engineering">BS Software Engineering</option>
    
              </select>
            <br />
                Units Completed:
                <input id="units" type="text" name="units" onChange={this.handleChange}/>
            <br />
                <input type="submit" value="Generate" />
        </form>
            </header>
            

            <div>
            <form>
                <input type="file" name="file" onChange={this.formSubmit } />
                <br />
                
            </form>
            </div>

        
        </div>

        
    )
    }

    pdfLibraryLoaded(ev){
        pdfjsLib = window['pdfjs-dist/build/pdf']
    }

    /**
     * 
     * @param {*} data Is pdf read as data url
     */
    async getPDFText(data){
        var loadingTask = pdfjsLib.getDocument(data);
        let pdf = await loadingTask.promise

        let pdfText = ''

        for(var i=1;i<=pdf.numPages;i++){
            let page = await pdf.getPage(i)
            let textContent = await page.getTextContent()

            pdfText = textContent.items.reduce( (acc,curr) => acc + curr.str +"\n", pdfText )
        }

        
        return pdfText
    }

    formSubmit(ev){



        fileSelect = ev.currentTarget.files
        this.setState({file:ev.currentTarget.files[0]},
            ()=>{


                let reader = new FileReader()

                reader.onload = (e)=>{
                    let data = e.target.result
      
                    
                    
                   this.getPDFText(data)
                   .then( (text) =>{

                    let strs = text.split("\n")
                    let name = ""
                    let major = ""

                    let nameToken = "STUDENT NAME:"
                    let majorToken = "MAJOR:"

                    for(var i=0;i<strs.length;i++){
                        if( strs[i].includes(nameToken)){
                            name = strs[i].split(nameToken)[1].trim()
                            this.setState({name:name})
                        }
                        if( strs[i].includes(majorToken)){
                            major = strs[i].split(majorToken)[1].trim()
                            this.setState({major:major})
                        }

                    }
                   })
                    
                
                    
                }
                var file = fileSelect[0]
                reader.readAsDataURL(this.state.file)
                
                

            })
        



        
    }



    handleChange(event) {
        this.setState({
            [event.target.name]:event.target.value
        });
      }
    
      handleSubmit(event) {
        event.preventDefault();
        this.count += 1;	
        alert('Submitted\nName: ' + this.state.name + "\n" + "Units: " + this.state.units );
        

        fetch('http://httpbin.org/post',{
            method: "post",
            body: JSON.stringify({"name":this.state.name, "units":this.state.units}),
            
            
        })
        .then( res =>{
            return res.json()
            
        })
        .then(data=>{

        })        
    }
}

export default CreateCert