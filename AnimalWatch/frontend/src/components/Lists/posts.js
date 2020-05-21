import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';
import { Switch, Route, Link } from "react-router-dom";
import axiosInstance from "../../axiosApi";


class Posts extends List{
    callForm(){
        return(<div><PostCreate pk={this.state.pk} baseurl = {this.baseurl}/></div>)
     }

    mappingFunction (data) {
        return(
            <div>
            <p class='tagdetail'>{data.user} 
            ({data.animal_environment}) --
            {data.animal_class}</p>
            <Link className={"nav-link"} to={"/post/"+data.id}>{data.id}</Link>
            </div>
        )}
}

class PostCreate extends Create{
    constructor(props){
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleFileChange(event){
        this.setState({video:event.target.files[0]})
    }
    fileUpload(){
        const formData = new FormData();
        formData.append('video',this.state.video)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
      }
      async postForm(){
        var formData = new FormData();
        formData.append('video',this.state.video);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        formData.append('post', this.postid);
        formData.append('animal_environment',this.state.animal_environment);
        formData.append('animal_class',this.state.animal_class);
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/'+this.baseurl+'/', formData,config);
        }
        catch (error) {
            console.log(error);
        }
    }

    mappingFunction(statevar){
        return(
        <div>
        <label>{statevar}:</label>
        {statevar == 'video' &&
            <div><input type='file' name={statevar} value={this.state.statevar} onChange={this.handleFileChange}></input><br></br></div>
        }
        {statevar != 'video' &&
            <div><input type='text' name={statevar} value={this.state.statevar} onChange={this.handleVarChange}></input><br></br></div>
        }
        </div>)
    }
}

export default Posts;
