import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class ListAndCreate extends Component{
    constructor(props) {
        super(props);
        this.pk= props.pk;
        this.baseurl = props.baseurl;
        this.state = {
            data_list:[],
            showForm:false,
            pk:this.pk
        };
        this.getData = this.getData.bind(this);
        this.submit = this.submit.bind(this);
    }
    async getData(){
        try{
            const response = await axiosInstance.get('/'+this.baseurl+'/' + this.pk);
            this.setState({
                data_list: response.data
            });
            return response.data; 
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
    componentDidMount(){
        const messageData1 = this.getData();
        console.log("animal tag mounting: ", JSON.stringify(messageData1, null, 4));
    }

    submit(){
        this.setState({showForm:false});
        this.getData();
    }

    mappingFunction (data) {
        return(<p>INVALID PATH</p>)}

    callForm(){
       return(<div><ThisForm pk={this.state.pk} baseurl = {this.baseurl}/></div>)
    }

    render(){
        return (
            <div className={'tagcont ' +this.baseurl}>
                <p class='boxhead'>{this.baseurl}:</p>
                <button onClick={this.getData}>REFRESH</button>
                <button onClick={() => this.setState({showForm:true})}>New {this.baseurl}</button>
                {this.state.showForm ? <div>{this.callForm()}<button onClick={this.submit}>Add {this.baseurl}</button></div> : null}
                <div class={this.baseurl+'cont'}>
                    {this.state.data_list.map((data)=>(
                        <div class = 'tagbox' key={data.id}>{this.mappingFunction(data)}</div>
                    ))
                    }
                </div>
            </div>
        )
    }

}

class ThisForm extends Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.postid = props.pk;
        this.baseurl = props.baseurl;
        this.handleVarChange = this.handleVarChange.bind(this);
        this.setStateDict = this.setStateDict.bind(this);
    }

    handleVarChange (event) {
        const { target: { name, value } } = event
        this.setState({ [name]: value })
        console.log(this.state)
      }

    async setStateDict(){
        event.preventDefault();
        try{
            const response = await axiosInstance.get('/'+this.baseurl+'/');
            const keys = Object.keys(response.data)
            const data = response.data;
            for (var i =0;i<keys.length;i++){
                this.setState({[keys[i]]:data[keys[i]]});
            }
        }catch(error){
            console.log('did not retrieve');
        }
    }

    componentDidMount(){
        this.setStateDict();
    }

    async componentWillUnmount(){
        var outputdata = {};
        var keys = Object.keys(this.state);
        for(var i=0;i<keys.length;i++){
            outputdata[keys[i]]=this.state[keys[i]];
        }
        outputdata['post'] = this.postid;
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/'+this.baseurl+'/', outputdata);
        }
        catch (error) {
            console.log(error);
        }
    }

    render(){
        return(
            <div>
                <form>
                    {Object.keys(this.state).map((statevar)=>(
                        <div key={statevar}>
                            <label>{statevar}:</label>
                            <input type='text' name={statevar} value={this.state.statevar} onChange={this.handleVarChange}></input><br></br>
                        </div>
                    ))}
                </form>
            </div>
        );
    }

}

export default ListAndCreate;
