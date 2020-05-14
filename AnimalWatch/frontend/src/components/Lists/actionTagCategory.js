import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';
import ActionTagVerb from'./actionTagVerb';

class ActionTagCategory extends List{
    mappingFunction(data){
        return(
            <div>
        <p class='tagdetail'>{data.category_name}</p>
        <ActionTagVerb pk={data.id} baseurl='actiontagverb'/></div>)
    }
}

export default ActionTagCategory;