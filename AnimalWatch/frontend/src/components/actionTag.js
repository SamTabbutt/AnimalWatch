import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class ActionTag extends Component{
    constructor(props) {
        super(props);
        this.pk= props.pk;
        this.state = {
            data_list:[],
            showForm:false,
            pk:this.pk
        };
        this.currentState = props.update;
        this.getData = this.getData.bind(this);
        this.submit = this.submit.bind(this);
    }
    async getData(){
        try{
            const response = await axiosInstance.get('/animalactiontags/' + this.pk);
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
        // It's not the most straightforward thing to run an async method in componentDidMount

        // Version 1 - no async: Console.log will output something undefined.
        const messageData1 = this.getData();
        console.log("animal action tag mounting: ", JSON.stringify(messageData1, null, 4));
    }

    submit(){
        this.setState({showForm:false});
        this.getData();
    }

    render(){
        return (
            <div class='tagcont'>
                <p class='boxhead'>Action Tags:</p>
                  <div class='segbox'>
                    {this.state.data_list.map(tag => (
                        <div class = 'tagbox' key={tag.id}>
                            <p class='tagdetail'>{tag.subject_list} 
                            ({tag.verb}) --
                            {tag.object_list}</p>
                        </div>
                    )
                    )}
                </div>
            </div>
        )
    }

}

class AnimalTagForm extends Component{
    constructor(props) {
        super(props);
        this.state = {type: 'init',
                      number:'init',
                      name: 'init',
                    perspective:'init'};
        this.postid = props.pk
        console.log(this.postid)
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handlePerspectiveChange = this.handlePerspectiveChange.bind(this);
    }

    handleTypeChange(e) {
        this.setState({type: e.target.value});
     }
     handleNameChange(e) {
        this.setState({name: e.target.value});
     }
     handleNumberChange(e) {
        this.setState({number: e.target.value});
     }
     handlePerspectiveChange(e) {
        this.setState({perspective: e.target.value});
     }

    async componentWillUnmount(){
        console.log(this.state.name)
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/animaltags/', {
                'animal_assigned_number': this.state.number,
                'animal_assigned_name': this.state.name,
                'animal_type': this.state.type,
                'perspective': this.state.perspective,
                'post': this.postid
            });
            console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    }

    render(){
        return(
            <div>
                <form>
                    <label>Animal type: </label>
                    <input type='text' value={this.state.type} onChange={this.handleTypeChange}></input><br></br>
                    <label>Animal assigned number: </label>
                    <input type='text' value={this.state.number} onChange={this.handleNumberChange}></input><br></br>
                    <label>Animal Assigned Name: </label>
                    <input type='text' value={this.state.name} onChange={this.handleNameChange}></input><br></br>
                    <label>Perspective: </label>
                    <select value={this.state.perspective} onChange={this.handlePerspectiveChange}>
                        <option value='AnimalBorne'>Animal Borne</option>
                        <option value='FixedCameraThirdPerson'>Fixed Camera Third Person</option>
                        <option value='MovingCameraThirdPerson'>Moving Camera Third Person</option>
                    </select><br></br>
                </form>
            </div>
        );
    }

}

export default ActionTag;
