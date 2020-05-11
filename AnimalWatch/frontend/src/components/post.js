import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import Segment from './segment';
import AnimalTag from './animalTag';

class Post extends Component{
    constructor(props) {
        super(props);
        const pk = props.pk
        this.state = {
            showAnimalTagForm:false,
            pk:pk
        };
        this.pk = props.pk;
        this.getPost = this.getPost.bind(this);

    }

    async getPost(){
        try{
            const response = await axiosInstance.get('/posts/' + this.pk);
            const animalclass = response.data.animal_class;
            const environment = response.data.animal_environment;
            const numanimaltags = response.data.animal_tags.length;
            const numsegments = response.data.segments.length;
            const videopath = response.data.video;
            const user = response.data.user;
            this.setState({
                env: environment,
                numanimaltags: numanimaltags,
                videopath: videopath,
                animalclass: animalclass,
                user: user,
                numsegments: numsegments,
            });
            return environment; 
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount

        // Version 1 - no async: Console.log will output something undefined.
        const messageData1 = this.getPost();
        console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
    }


    render(){
        return (
            <div>
                <div class='video'>
                    Video here: {this.state.videopath}
                </div>
                <div class='infobox'>
                    <p>Number of tags: {this.state.numanimaltags}
                    <br></br>Number of segments: {this.state.numsegments}
                    <br></br>User: {this.state.user}
                    <br></br>Animal Class: {this.state.animalclass}
                    <br></br>Environment: {this.state.env}</p>
                </div>
                
                <AnimalTag pk={this.state.pk}/>

                <Segment pk={this.state.pk}/>

            </div>
        )
    }
}

export default Post;


