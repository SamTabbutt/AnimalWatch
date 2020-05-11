import React, { Component } from "react";
import ListAndCreate from '../ListAndCreate';

class AnimalTag extends ListAndCreate{
    mappingFunction (data) {
        return(
            <p class='tagdetail'>{data.animal_type} 
            ({data.animal_assigned_number}) --
            {data.animal_assigned_name} --
            {data.perspective}</p>)}
}

export default AnimalTag;
