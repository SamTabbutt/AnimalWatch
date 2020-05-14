import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';

class AnimalTag extends List{
    callForm(){
        return(<div><AnimalTagForm pk={this.state.pk} baseurl = {this.baseurl}/></div>)
     }

    mappingFunction (data) {
        return(
            <div>
            <p class='tagdetail'>
            {data.animal_type} 
            ({data.animal_assigned_number}) --
            {data.animal_assigned_name} --
            {data.perspective}</p>
            </div>)}
}

class AnimalTagForm extends Create{
    mappingFunction(statevar){
        return(
        <div>
        <label>{statevar}:</label>
        {statevar!='perspective' &&
        <div><input type='text' name={statevar} value={this.state.statevar} onChange={this.handleVarChange}></input><br></br></div>
        }
        {statevar=='perspective'&&
        <div><select name={statevar} value={this.state.statevar} onChange={this.handleVarChange}>
            <option value=''>Select</option>
            <option value='AnimalBorne'>Animal Borne</option>
            <option value='FixedCameraThirdPerson'>Third Person Fixed</option>
            <option value='MovingCameraThirdPerson'>Third Person Moving</option>
            </select><br></br></div>
        }
        </div>)
    }
}

export default AnimalTag;
