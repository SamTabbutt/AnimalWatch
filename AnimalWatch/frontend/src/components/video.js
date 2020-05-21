import React, { Component } from "react";
import SegmentCreate from './segmentCreate';

class VideoScrubber extends Component{
    constructor(props){
        super(props);
        this.frames=[];
        this.source = props.source;
        var starttime = props.starttime;
        var endtime = props.endtime
        var videolength = props.length;
        var post_pk = props.post_pk;
        console.log(this.source);
        this.state = ({currenttmin:this.props.starttime,
                    currenttmax:this.props.endtime,
                    currenttbounds:[0,videolength],
                    src:this.source,
                        videoHeight:300,
                    videoWidth:500,
                    videolength:videolength,
                    rightClick:false,
                    rightClickPos:[0,0],
                    post_pk:post_pk,
                    clipMode:false,
                  starttime:starttime});
                    console.log(this.state);
        this.zoom = this.zoom.bind(this);
        this.scroll = this.scroll.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
    }

    makeTrimDisplay(){
      if (this.state.canvas){
        if (this.state.canvas.getContext){
          const ctx = this.state.canvas.getContext('2d');
          ctx.clearRect(0,0,this.state.videoWidth,this.state.videoHeight)
          if (this.state.clipMode){
            ctx.fillStyle = '#0069ed';
          }else{
            ctx.fillStyle = 'black';
          }
          var xstart = this.ttox(this.state.currenttmin);
          var xend = this.ttox(this.state.currenttmax);
          if (xend>this.state.videoWidth){
            xend=this.state.videoWidth;
          }
          var xdiff = xend-xstart;
          var xright = this.state.videoWidth-xend;
          ctx.fillRect(xstart,this.state.videoHeight-30,xdiff,30);
          ctx.strokeRect(0,this.state.videoHeight-30,xstart,30);
          ctx.strokeRect(xend,this.state.videoHeight-30,xright,30);
          ctx.fillText(this.state.currenttbounds[0],0,this.state.videoHeight-32);
          ctx.fillText(this.state.currenttbounds[1],this.state.videoWidth-10,this.state.videoHeight-32)
          var currentFramex = this.ttox(this.state.redLine);
          ctx.fillStyle = 'red';
          ctx.fillRect(currentFramex,this.state.videoHeight-30,2,30);
        }
      }
    }

    keyPressed(event){
      if (event.code=='KeyB'){
        var currentClipMode = this.state.clipMode;
        this.setState({clipMode:!currentClipMode});
      }
    }

    componentDidMount(){
        const videoElement = this.refs.videoElement;
        videoElement.currentTime = this.state.starttime;
        const canvas = this.refs.videoCanvas;
        const container = this.refs.frameContainerElement;
        const ctx = canvas.getContext("2d")
        document.addEventListener('keypress',this.keyPressed);
        this.setState({videoElement:videoElement,canvas:canvas,context:ctx,frameContainerElement:container});
        this.makeTrimDisplay()
    }

    componentDidUpdate(){
      this.makeTrimDisplay();
    }

    componentWillReceiveProps(nextProps) {
      // Any time props.email changes, update state.
      if (nextProps.starttime !== this.props.email || nextProps.endtime!==this.props.endtime) {
        this.setState({
          currenttmin: nextProps.starttime,
          currenttmax:nextProps.endtime
        });
      }
    }

    ttox(t){
      var lowert = this.state.currenttbounds[0];
      var uppert = this.state.currenttbounds[1];
      var timeproportion = (t-lowert)/(uppert-lowert);
      return Math.round(timeproportion*this.state.videoWidth);
    }

    xtot(x){
      var spaceproportion = x/this.state.videoWidth;
      var lowert = this.state.currenttbounds[0];
      var uppert = this.state.currenttbounds[1];
      return spaceproportion*(uppert-lowert)+lowert;
    }

    testInBounds(x,sliderShift){
        if (sliderShift == 'currenttmin'){
          var currentXmax = this.ttox(this.state.currenttmax);
          if (x<currentXmax && x>0){
              return true;
          }else{
            return false;
          }
        }
        else if (sliderShift == 'currenttmax'){
          var currentXmin = this.ttox(this.state.currenttmin);
          if(x>currentXmin && this.xtot(x)<=this.state.videolength){
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
    }

    setXpos(x,sliderShift){
      if (this.testInBounds(x,sliderShift)){
        var frameRequested = this.xtot(x);      
        if (frameRequested !== this.state.visibleFrame){
          this.setState({
            visibleFrame: frameRequested,
            [sliderShift]: this.xtot(x)
          })
        }
        this.state.videoElement.currentTime = this.state.visibleFrame;
      }
    }

    slide(xdif){
      var newxmin = this.ttox(this.state.currenttmin)+xdif;
      var newxmax = this.ttox(this.state.currenttmax)+xdif;
      if (this.xtot(newxmax)<this.state.videolength && this.xtot(newxmin)>=0){
        var frameRequested = newxmin;
        if (frameRequested !== this.state.visibleFrame){
          this.setState({
            visibleFrame:frameRequested,
            currenttmax: this.xtot(newxmax),
            currenttmin: this.xtot(newxmin)
          })
        }
        this.state.videoElement.currentTime = this.state.visibleFrame;
      }
    }

    onMouseDown = (e) => {
      const frameRect = this.state.canvas.getBoundingClientRect()
      const x = event.clientX - frameRect.left
      const y = event.clientY - frameRect.top
      var currentXmin = this.ttox(this.state.currenttmin);
      var currentXmax = this.ttox(this.state.currenttmax);
      var currentDifference = currentXmax-currentXmin;
      if(!this.state.clipMode){
        var frameRequested = this.xtot(x);
        this.setState({redLine:frameRequested});
        this.state.videoElement.currentTime = this.state.redLine;
      }
      if (!e.shiftKey && !e.ctrlKey && !e.altKey && this.state.clipMode){
        if (Math.abs(x-currentXmin)<currentDifference/4 || x<currentXmin){
          this.setState({currentSliderShift:'currenttmin'});
          this.setXpos(x,'currenttmin');
        }
        else if(Math.abs(x-currentXmax)<currentDifference/4 || x>currentXmax){
          this.setState({currentSliderShift:'currenttmax'});
          this.setXpos(x,'currenttmax');
        }
      }else if(e.shiftKey && !e.ctrlKey && !e.altKey){
        this.setState({lastshift:x});
      }else if(e.ctrlKey && !e.shiftKey && !e.altKey){
        this.setState({lastNavx:x,lastNavy:y,zoompoint:this.xtot(x)})
      }else if(e.ctrlKey && e.shiftKey && !e.altKey){
        this.setState({lastNavx:x,lastNavy:y})
      }
      if(e.altKey){
        this.setState({rightClick:false});
        this.setState({rightClick:true,rightClickPos:[e.pageX,e.pageY]});
      }else{
        this.setState({rightClick:false})
      }
    }

    onMouseMove = (event) => {
        // Bail early if we aren't clicking and dragging
        if (event.type === "mousemove" && event.buttons === 0) {
          return
        }
       
        event.preventDefault()
         
        const frameRect = this.state.canvas.getBoundingClientRect()
        const x = event.clientX - frameRect.left
        const y = event.clientY - frameRect.top
        var leftButtonDown = event.buttons===1;
        if (leftButtonDown && !event.shiftKey && !event.ctrlKey && this.state.clipMode){
          this.setXpos(x,this.state.currentSliderShift);
        }
        if(leftButtonDown && !this.state.clipMode){
          var frameRequested = this.xtot(x);
          this.setState({redLine:frameRequested});
          this.state.videoElement.currentTime = this.state.redLine;
        }
        else if (leftButtonDown && event.shiftKey &&!event.ctrlKey){
          var difShift = x-this.state.lastshift;
          this.slide(difShift)
          this.setState({lastshift:x})
        }
        else if (leftButtonDown && !event.shiftKey && event.ctrlKey){
          var zoomfactor = (y-this.state.lastNavy)*-1;
          if (zoomfactor<0){
            this.zoom(false,this.state.zoompoint);
          }
          if (zoomfactor>0){
            this.zoom(true,this.state.zoompoint);
          }
          this.setState({lastNavy:y,lastNavx:x})
        }
        else if (leftButtonDown && event.shiftKey && event.ctrlKey){
          var scrollval = (x-this.state.lastNavx);
          this.scroll(scrollval);
          this.setState({lastNavx:x});
        }
      }

      //factor<1: out factor>1: in
      zoom(inbool,center){
        var diff = (this.state.currenttbounds[1]-this.state.currenttbounds[0]);
        var center = center;
        if (inbool){
          var change = diff*99/100;
        }else{
          var change = diff*10/8;
        }
        var right = center+change/2;
        var left = center-change/2;
        if (right>this.state.videolength){
          right=this.state.videolength;
        }
        if(left<0){
          left=0;
        }
        if(right-left>.001){
          this.setState({currenttbounds:[left,right]});
          this.makeTrimDisplay();
        }
      }

      scroll(change){
        change = this.xtot(change)-this.state.currenttbounds[0];
        var right = this.state.currenttbounds[1]+change;
        var left = this.state.currenttbounds[0]+change;
        if (right>this.state.videolength){
          return;
        }
        if(left<0){
          return;
        }
        this.setState({currenttbounds:[left,right]});
        this.makeTrimDisplay();
      }
    
      unHinge(){
        this.setState({rightClick:false})
      }
      
    render(){
      return(
        <div>
        <div className='video-scrubber'>
          <video className='videoElement'
            src={this.state.src}
            loop={true}
            type="video/mp4"
            hidden = {false}
            controls={false}
            autoPlay={false}
            ref='videoElement'
          ></video>
        <div className="video-scrubber-frame-container" ref='frameContainer'>
              <canvas
              ref='videoCanvas'
              className='video-scrubber-frame'
              height={this.state.videoHeight}
              width={this.state.videoWidth}
              name='mouse-event-canvas'
              onMouseDown={(event)=>this.onMouseDown(event)}
              onMouseMove={(event)=>this.onMouseMove(event)}></canvas>
        </div>
        {this.state.rightClick ? <SegmentCreate post_pk={this.state.post_pk} unHinge={()=>this.unHinge()}updateCategories={this.props.updateCategories} pos={this.state.rightClickPos} starttime={this.state.currenttmin} endtime={this.state.currenttmax}/> : null}
        </div>
        </div>
      )
    }
}

export default VideoScrubber;