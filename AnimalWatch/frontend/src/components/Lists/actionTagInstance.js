import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';
import axiosInstance from "../../axiosApi";

class ActionTagInstance extends List{
    callForm(){
        return(<div><ActionTagInstanceForm pk={this.state.pk} post_pk={this.props.post_id} baseurl = {this.baseurl}/></div>)
     }

    mappingFunction(data){
        return(
        <div>
            <p class='tagdetail'>{data.verb}</p>
        </div>)
    }
}

class ActionTagInstanceForm extends Create{
    constructor(props){
        super(props);
        this.getCategoryChoices=this.getCategoryChoices.bind(this);
        this.handleCatChange = this.handleCatChange.bind(this);
        this.state = {categoryChoices:[], selectedCategory:'3',verbChoices:[]}
    }
    async getCategoryChoices(){
        event.preventDefault();
        try{
            const response = await axiosInstance.get('/actiontagcategory/' + this.props.post_pk);
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
    componentDidMount(){
        this.getCategoryChoices();
        super.componentDidMount();
    }

    handleCatChange(event){
        console.log(event.target.value);
        this.setState({selectedCategory:event.target.value})
    }

    render(){
        let category = this.state.categoryChoices.filter(category => {
            return category.id == this.state.selectedCategory
        });
        if (category==''){
            category = [{id:'',verbs:[{tag_verbs:''}]}]
        }
        return(
            <div>
                <form>
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
                </form>
                <p>CategoryID: {category[0].id}</p>
            </div>
        );
    }
}

export default ActionTagInstance;
