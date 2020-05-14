import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';

class ActionTagVerb extends List{
    mappingFunction(data){
        return(
            <div>
        <p class='tagdetail'>{data.tag_verb}</p></div>)
    }
}

export default ActionTagVerb;