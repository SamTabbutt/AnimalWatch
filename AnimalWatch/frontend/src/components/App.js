import React, { Component} from "react";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Post from "./post";

class App extends Component {
    render() {
        return (
            <div className="site">
                <nav>
                    <Link className={"nav-link"} to={"/"}>Home</Link>
                    <Link className={"nav-link"} to={"/login/"}>Login</Link>
                    <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
                    <Link className={"nav-link"} to={"/post/"}>Post</Link>
                </nav>
                <main>
                    <h1>Animal Watch</h1>

                    <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/signup/"} component={Signup}/>
                        <Route exact path={"/post/"} component={()=><Post pk='1'/>}/>
                        <Route path={"/"} render={() => <div>This is animal watch</div>}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;