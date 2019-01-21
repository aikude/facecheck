import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecImage from './components/FaceRecImage/FaceRecImage'; 
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

const particleParams = { particles: {number: {value: 80, density: { enable: true, value_area: 800 } }} };

const clarifaiapp = new Clarifai.App({
  apiKey: ''
});

class App extends Component {
  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: '',
      isLoggedin: false
    }
  }
/*
  connectServer(route){
    const endpoint = serverUrl + '/' + route
    fetch(serverUrl).then(response => response.json()).then(data => console.log(data));
  }
*/
  setBoxStates = (responsedata) => {
    const boundingboxes = responsedata.outputs[0].data.regions.map( regiondata => { return regiondata.region_info.bounding_box; } );
    const image = document.getElementById("inputimage");
    let divDimensions = [];
    //console.log(boundingboxes);

    const pix_w = Number(image.width), pix_h = Number(image.height);
    //console.log(pix_w, pix_h);

    let box_x1=0, box_y1=0, box_w=0, box_h=0;

    for (let boundingbox of boundingboxes){
      box_x1=Math.round(boundingbox.left_col*pix_w);
      box_y1=Math.round(boundingbox.top_row*pix_h);
      box_w = Math.round(boundingbox.right_col*pix_w) - box_x1;
      box_h = Math.round(boundingbox.bottom_row*pix_h) - box_y1;
      divDimensions.push({ x1: box_x1, y1: box_y1, w: box_w, h: box_h });
    }

    //console.log(divDimensions);
    this.setState({boxes: divDimensions});
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    clarifaiapp.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then( response => this.setBoxStates(response) )
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') this.setState({isLoggedin: false});
    else if (route === 'home'){
      this.setState({isLoggedin: true});
    }
    
    this.setState({route: route});
  }

  render() {
    const {isLoggedin, imageUrl, route, boxes} = this.state;
    
    return (
      <div className="App">
        <Particles classname="particles" params={particleParams} />
        <Navigation onRouteChange={this.onRouteChange} isLoggedin={isLoggedin} />
        {isLoggedin
        ?
        <div>
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecImage imageUrl={imageUrl} boxes={boxes} />
        </div>
        : (
          route === 'register'
          ? <Register onRouteChange={this.onRouteChange} />
          : <SignIn onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
