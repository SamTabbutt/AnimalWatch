import React, { Component } from "react";
import ActionTagInstance from './actionTagInstance';
import {List,Create} from '../ListAndCreate';

class Segment extends List{

    mappingFunction (data) {
        return(
            <div>
            <p>sart time: {data.start_time} --
            end time: {data.end_time} -- 
            Number of action tags: {data.action_tags.length}</p>
            <ActionTagInstance pk={data.id} post_id={this.state.pk} baseurl='animalactiontags'/></div>)}

}

export default Segment;