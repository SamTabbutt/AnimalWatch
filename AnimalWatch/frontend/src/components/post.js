import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import VideoScrubber from './video';
import Timeline from './categoryTimeline';

class Post extends Component{
    constructor(props) {
        super(props);
        const {pk} = this.props.match.params;
        this.state = {
            pk:pk,
            videopath:'/media/skiing_Trim.mp4',
            categories:[],
            toggle:true,
            showform:false,
            starttime:0,
            endtime:10
        };
        this.getPost = this.getPost.bind(this);
        this.updateCats = this.updateCats.bind(this);
        this.toggleUpdate =this.toggleUpdate.bind(this);
        this.setCat = this.setCat.bind(this);
        this.submitCategory = this.submitCategory.bind(this);
    }

    async getPost(){
        try{
            const response = await axiosInstance.get('/postdetail/' + this.state.pk);
            this.setState({
                env: response.data.animal_environment,
                videopath: response.data.video,
                animalclass: response.data.animal_class,
                user: response.data.user,
                categories: response.data.tag_categories
            });
            console.log(response.data);
            return response.data; 
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
    async updateCats(){
        try{
            const response = await axiosInstance.get('/postdetail/' + this.state.pk);
            this.setState({
                categories: response.data.tag_categories
            });
            console.log(response.data);
            return response.data; 
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
    componentDidMount(){
        const messageData1 = this.getPost();
        console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
    }

    toggleUpdate(){
        console.log("TOGGLING");
        var currentToggle = this.state.toggle;
        this.setState({toggle:!currentToggle});
        console.log(this.state.toggle);
    }
    setCat(event){
        this.setState({newCat:event.target.value});
    }
    submitCategory(){
        var outputdata = {'post':this.state.pk,'category_name':this.state.newCat};
        return axiosInstance.post('/actiontagcategory/',outputdata).then((data)=>{
            console.log(data);
            this.setState({showform:false});
            this.updateCats();
        })
    }
    sendSegment= (segtimes) =>{
        this.setState({starttime:segtimes[0],endtime:segtimes[1]});
        console.log("WE GOT HERE");
        console.log(this.state.starttime);
    }

    render(){
        return (
            <div>
                <div className='video'>
                    <VideoScrubber  
                        post_pk={this.state.pk} 
                        source={this.state.videopath} 
                        updateCategories = {this.toggleUpdate} 
                        starttime={this.state.starttime} 
                        endtime={this.state.endtime}
                        length={10}/>
                    <div class='infobox'>
                        <p>
                            <br></br>User: {this.state.user}
                            <br></br>Animal Class: {this.state.animalclass}
                            <br></br>Environment: {this.state.env}
                        </p>
                    </div>
                </div>
                <div className='timeline-main-box'>
                    <button onClick={()=>this.setState({showform:true})}>Add Category</button>
                    {this.state.showform ? 
                        <div>
                            <label>Category Name:
                                <input type='text' value={this.state.newCat} onChange={this.setCat}></input>
                            </label>
                            <button onClick={this.submitCategory}>Add</button>
                        </div>:null}
                    {this.state.categories.map((data) => (
                        <Timeline 
                            key={data.id} 
                            id={data.id} 
                            name={data.category_name} 
                            update={this.state.toggle} 
                            toggleUpdate={this.toggleUpdate}
                            sendSegment={(segtimes)=>this.sendSegment(segtimes)}/>
                    ))}
                </div> 
            </div>
        )
    }
}

export default Post;


