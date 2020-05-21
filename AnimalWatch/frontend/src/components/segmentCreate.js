import React, { Component } from "react";
import axiosInstance from "../axiosApi";


class SegmentCreate extends Component{
    constructor(props){
        super(props);
        var ypos = props.pos[1];
        var xpos = props.pos[0];
        var starttime = props.starttime;
        var endtime = props.endtime;
        var post_pk = props.post_pk;
        this.state = {ypos:ypos,
                    xpos:xpos,
                    starttime:starttime,
                    endtime:endtime,
                    categoryChoices:[],
                    post_pk:post_pk,
                    VerifyDelete:false};
        console.log(this.state.post_pk);
        this.getCategoryChoices = this.getCategoryChoices.bind(this);
        this.handleCatChange = this.handleCatChange.bind(this);
        this.handleVarChange = this.handleVarChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.getCategoryChoices();
    }

    async getCategoryChoices(){
        event.preventDefault();
        try{
            const response = await axiosInstance.get('/actiontagcategory/' + this.state.post_pk);
            const data = response.data;
            console.log(data);
            this.setState({
                categoryChoices: data,
            });
            return data
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
    handleCatChange(event){
        console.log(event.target.value);
        this.setState({selectedCategory:event.target.value})
    }

    handleVarChange (event) {
        const { target: { name, value } } = event
        this.setState({ [name]: value })
        console.log(this.state)
      }

      handleSubmit(event,clear){
        var segData = {'post':this.state.post_pk,'start_time':this.state.starttime,'end_time':this.state.endtime,'action_verb':this.state.tag_verb,'clear':clear};
        try {
            return axiosInstance.post('/postsegments/', segData).then((data)=>{
                console.log("RETURN DATA")
                console.log(data)
                var tagdata = {'post':data.data.pk,'verb':this.state.tag_verb};
                if(data.data.VerifyDelete==true){
                    this.setState({VerifyDelete:true});
                    return;
                }
                return axiosInstance.post('/animalactiontags/',tagdata).then((data)=>{
                    this.props.updateCategories();
                    this.props.unHinge();
                });
            })
        }
        catch (error) {
            console.log(error);
        }
      }

    render(){
        const style = {
            top:20,
            left:550
        };
        let category = this.state.categoryChoices.filter(category => {
            return category.id == this.state.selectedCategory
        });
        if (category==''){
            category = [{id:'',verbs:[{tag_verbs:''}]}]
        }
        return(
            <div className='popup' style={style}><form>
            <select value={this.state.selectedCategory} onChange={this.handleCatChange}>
                <option>Select</option>
                {this.state.categoryChoices.map((data) =>(
                    <option value={data.id}>{data.category_name}</option>
                ))}
            </select>
            <select value={this.state.tag_verb} name={'tag_verb'} onChange={this.handleVarChange}>
                <option>Select</option>
                {category[0].verbs.map((data)=>(
                    <option value={data.id}>{data.tag_verb}</option>
                ))}
            </select>
            </form><button onClick={(event)=>this.handleSubmit(event,false)}>Submit</button>
            {this.state.VerifyDelete ? <div><p>This addition interferes with existing segments. Are you sure?</p>
            <button onClick={(event)=>this.handleSubmit(event,true)}></button></div> :null}
        </div>
        )
    }
}

export default SegmentCreate;