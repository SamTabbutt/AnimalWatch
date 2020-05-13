import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';

class ActionTag extends List{
    callForm(){
        return(<div><ActionTagForm pk={this.state.pk} subject_list = {this.props.subject_list} object_list = {this.props.object_list} baseurl = {this.baseurl}/></div>)
     }



    mappingFunction(data){
        return(
            <div>
        <p>{this.props.selections}</p>
        <p class='tagdetail'>{data.subject_list} 
                            ({data.verb}) --
                            {data.object_list}</p></div>)
    }
}

class ActionTagForm extends Create{
    mappingFunction(statevar){
        return(
        <div>
        <p>{this.props.currentSelections}</p>
        <label>{statevar}:</label>
        {statevar != 'verb'&&
        <div><input type='text' className={'checked_'+statevar} name={statevar} value={this.props[statevar]} onChange={this.handleVarChange}></input><br></br></div>
        }
        {statevar =='verb'&&
        <div><input type='text' className={'checked_'+statevar} name={statevar} value={this.state.statevar} onChange={this.handleVarChange}></input><br></br></div>
        }
        </div>)
    }
}

export default ActionTag;
