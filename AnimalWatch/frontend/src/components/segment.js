import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import ActionTag from './actionTag';

class Segment extends Component{
    constructor(props) {
        super(props);
        this.pk = props.pk;
        this.state = {
            data_list: [],
            showSegmentForm:false,
            pk:this.pk
        };
        this.getData = this.getData.bind(this);
        this.submit = this.submit.bind(this);
    }
    async getData(){
        try{
            const response = await axiosInstance.get('/postsegments/' + this.pk);
            this.setState({
                data_list: response.data,
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
        console.log("segment mounted: ", JSON.stringify(messageData1, null, 4));
    }

    submit(){
        this.setState({showSegmentForm:false});
        this.getData();
    }

    render(){
        return (
            <div class='tagcont segments'>
                <p class='boxhead'>Segments:</p>
                <button onClick={this.getData}>REFRESH</button>
                <button onClick={() => this.setState({showSegmentForm:true})}>New Segment</button>
                {this.state.showSegmentForm ? <div><SegmentForm pk={this.state.pk}/><button onClick={this.submit}>Add Segment</button></div> : null}
                <div class='segbox'>
                    {this.state.data_list.map(segment => (
                        <div key={segment.id}>
                            <p>sart time: {segment.start_time} --
                            end time: {segment.end_time} -- 
                            Number of action tags: {segment.action_tags.length}</p>
                            <ActionTag pk={segment.id}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

}

class SegmentForm extends Component{
    constructor(props) {
        super(props);
        this.state = {starttime: 'init',
                      endtime:'init'};
        this.postid = props.pk
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
    }

    handleStartChange(e) {
        this.setState({starttime: e.target.value});
     }
     handleEndChange(e) {
        this.setState({endtime: e.target.value});
     }


    async componentWillUnmount(){
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/postsegments/', {
                'start_time': this.state.starttime,
                'end_time': this.state.endtime,
                'post': this.postid
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    render(){
        return(
            <div>
                <form>
                    <label>Start Time: </label>
                    <input type='text' value={this.state.starttime} onChange={this.handleStartChange}></input><br></br>
                    <label>End Time: </label>
                    <input type='text' value={this.state.endtime} onChange={this.handleEndChange}></input><br></br>
                </form>
            </div>
        );
    }

}
export default Segment;