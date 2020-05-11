import React, { Component } from "react";
import ActionTag from './actionTag';
import ListAndCreate from '../ListAndCreate';

class Segment extends ListAndCreate{

    mappingFunction (data) {
        return(
            <div>
            <p>sart time: {data.start_time} --
            end time: {data.end_time} -- 
            Number of action tags: {data.action_tags.length}</p>
            <ActionTag pk={data.id} baseurl='animalactiontags'/></div>)}

}

export default Segment;