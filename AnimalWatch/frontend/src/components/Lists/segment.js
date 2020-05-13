import React, { Component } from "react";
import ActionTag from './actionTag';
import {List,Create} from '../ListAndCreate';

class Segment extends List{

    mappingFunction (data) {
        return(
            <div>
            <p>sart time: {data.start_time} --
            end time: {data.end_time} -- 
            Number of action tags: {data.action_tags.length}</p>
            <ActionTag pk={data.id} subject_list = {this.props.subject_list} object_list = {this.props.object_list} baseurl='animalactiontags'/></div>)}

}

export default Segment;