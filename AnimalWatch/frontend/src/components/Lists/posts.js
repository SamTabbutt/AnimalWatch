import React, { Component } from "react";
import {List,Create} from '../ListAndCreate';
import { Switch, Route, Link } from "react-router-dom";

class Posts extends List{
    mappingFunction (data) {
        return(
            <div>
            <p class='tagdetail'>{data.user} 
            ({data.animal_environment}) --
            {data.animal_class}</p>
            <Link className={"nav-link"} to={"/post/"+data.id}>{data.id}</Link>
            </div>
        )}
}

export default Posts;
