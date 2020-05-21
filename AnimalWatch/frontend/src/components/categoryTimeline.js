import React, { Component } from "react";
import axiosInstance from "../axiosApi";


class Timeline extends Component{
    constructor(props){
        super(props);
        var name = props.name;
        this.state = {segments:[],
            newVerb:'',
            color:'',
                    videotime:10,
                canvaswidth:500,
            name:name};
        this.getData = this.getData.bind(this);
        this.setVerb = this.setVerb.bind(this);
        this.postNewVerb = this.postNewVerb.bind(this);
        this.setColor = this.setColor.bind(this);
    }

    getData(){
        try{
            return axiosInstance.get('/actiontagverb/'+this.props.id).then((data)=>{
                var segments = []
                console.log(data);
                for(var i =0;i<data.data.length;i++){
                    var verb = data.data[i];
                    console.log(verb);
                    var color = verb.colorcode;
                    for(var j=0;j<verb.action_tags.length;j++){
                        segments.push([verb.action_tags[j],color])
                    }
                }
                this.setState({segments:segments});
                this.drawEmptyBox();
                this.drawActionBars();
                console.log(this.state.segments);
            })
        }catch(error){
            console.log("error");
        }
    }

    drawEmptyBox(){
        if(this.state.canvas){
            var canvas = this.state.canvas;
            if(canvas.getContext){
                var ctx = canvas.getContext('2d')
                ctx.clearRect(0,0,500,40);
                ctx.strokeRect(0,0,500,40);
            }
        }   
    }

    ttox(t){
        var timeproportion = t/this.state.videotime;
        return Math.round(timeproportion*this.state.canvaswidth);
    }

    xtot(x){
        var spaceproportion = x/this.state.canvaswidth;
        return spaceproportion*this.state.videotime;
    }

    drawActionBars(){
        if(this.state.canvas){
            var canvas = this.state.canvas;
            if(canvas.getContext){
                var ctx = canvas.getContext('2d')
                for (var i=0;i<this.state.segments.length;i++){
                    ctx.fillStyle = this.state.segments[i][1];
                    var segment = this.state.segments[i][0].post_segment;
                    var startx = this.ttox(segment.start_time);
                    var endx = this.ttox(segment.end_time);
                    var diff=endx-startx
                    ctx.fillRect(startx,0,diff,40);
                }
                ctx.strokeRect(0,0,500,40);
            }
        }   
    }

    highlight = (event) =>{
        if(this.state.canvas){
            var canvas = this.state.dispCanvas;
            if(canvas.getContext){
                var ctx = canvas.getContext('2d')
                ctx.clearRect(0,0,this.state.canvaswidth,10);
                const frameRect = this.state.canvas.getBoundingClientRect();
                const x = event.clientX - frameRect.left;
                const y = event.clientY - frameRect.top;
                var t = this.xtot(x);
                for (var i =0;i<this.state.segments.length;i++){
                    var seg = this.state.segments[i][0].post_segment;
                    var uppert = seg.end_time;
                    var lowert = seg.start_time;
                    if(t>lowert && t<uppert){
                        var verb = this.state.segments[i][0].verb;
                        ctx.fillText(verb,x,7)
                    }
                }
            }
        }
    }

    selectChunk = (event) =>{
        if(this.state.canvas){
            var canvas = this.state.canvas;
            if(canvas.getContext){
                this.drawEmptyBox();
                this.drawActionBars();
                var ctx = canvas.getContext('2d')
                const frameRect = this.state.canvas.getBoundingClientRect();
                const x = event.clientX - frameRect.left;
                const y = event.clientY - frameRect.top;
                var t = this.xtot(x);
                var nll = 0;
                var nul = this.state.videotime;
                var inSeg = false;
                for (var i =0;i<this.state.segments.length;i++){
                    console.log("SEGEMENT")
                    var seg = this.state.segments[i][0].post_segment;
                    var uppert = seg.end_time;
                    var lowert = seg.start_time;
                    console.log(uppert+" "+lowert)
                    if (t>uppert && uppert>nll){
                        nll = uppert;
                    }
                    if(t<lowert && lowert<nul){
                        nul = lowert
                    }
                    if(t>lowert && t<uppert){
                        console.log(t);
                        var xmin = this.ttox(lowert)+1;
                        var xmax = this.ttox(uppert)-1;
                        var diff = xmax-xmin;
                        console.log(xmin,+" "+xmax);
                        ctx.strokeRect(xmin,0,diff,40);
                        inSeg = true;
                    }
                }
                if(!inSeg){
                    var xmin = this.ttox(nll);
                    var xmax = this.ttox(nul);
                    var diff = xmax-xmin;
                    ctx.strokeRect(xmin,0,diff,40);
                    ctx.fillStyle='red';
                    ctx.fillRect(xmin,0,diff,40);
                }
            }
            this.props.sendSegment([this.xtot(xmin),this.xtot(xmax)]);
        }
    }

    componentDidUpdate(){
        console.log(this.props.update);
        if(this.props.update){
            this.getData();
            this.props.toggleUpdate();
        }
    }
    componentDidMount(){
        const canvas = this.refs.timelineCanvas;
        this.setState({canvas:canvas});
        const dispCanvas = this.refs.timelineDisplay;
        this.setState({dispCanvas:dispCanvas});
        this.getData();
    }
    setVerb(event){
        this.setState({newVerb:event.target.value});
    }
    setColor(event){
        this.setState({color:event.target.value});
    }

    postNewVerb(){
        console.log("post"+this.state.newVerb);
        var outputData = {'tag_verb':this.state.newVerb,'post':this.props.id,'color':this.state.color}
        try{
            return axiosInstance.post('/actiontagverb/',outputData).then((data)=>{
                console.log(data.data);
                this.setState({form:false});
            })
        }catch(error){
            console.log("error");
            this.setState({form:false});
        }
    }

    render(){
        return(
            <div className='timeline-sect'>
                <h3>{this.state.name}</h3>
                <button onClick = {()=>this.setState({form:true})}>Add Verb</button>
                {this.state.form ? 
                    <div>
                        <label>Verb:
                            <input type='text' value={this.state.newVerb} onChange={this.setVerb}></input>
                        </label>
                        <label>Color:
                            <input type = 'text' value={this.state.color} onChange={this.setColor}></input>
                        </label>
                        <button onClick={this.postNewVerb}>Add</button>
                    </div> : null}
                <div className='timeline-case'>
                    <canvas className='timeline'
                    ref='timelineCanvas'
                    onMouseMove={(event)=>this.highlight(event)}
                    onDoubleClick = {(event)=>this.selectChunk(event)}
                    height={40}
                    width={500}></canvas>
                    <canvas className='timeline-display'
                    ref='timelineDisplay'
                    height={10}
                    width={500}></canvas>
                </div>
            </div>
        )
    }
}

export default Timeline