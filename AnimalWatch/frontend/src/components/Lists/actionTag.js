import React, { Component } from "react";
import ListAndCreate from '../ListAndCreate';

class ActionTag extends ListAndCreate{
    mappingFunction(data){
        <p class='tagdetail'>{data.subject_list} 
                            ({data.verb}) --
                            {data.object_list}</p>
    }
}

export default ActionTag;
