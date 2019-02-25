import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecImage from './components/FaceRecImage/FaceRecImage'; 
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';
import { SERVER_URL } from './constants';

const particleParams = { particles: {number: {value: 80, density: { enable: true, value_area: 800 } }} };

const initState = {
  input: '',
  imageUrl: '',
  boundingBoxes: [],
  route: '',
  isLoggedin: false,
  user: {id: '', name: '', email: '', entries: 0, joined: ''}
}

class App extends Component {
  constructor(){
    super();
    this.state = initState;
  }

  // Receive data for a user and set to state.
  loadUser = (uData) => {
    this.setState({
      user: {id: uData.id, name: uData.name, email: uData.email, entries: uData.entries, joined: uData.joined}
    })
  }
  
  // Set any form inputs/updates to state
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // Process faceDetections, a list received from server, generate a list of 
  // face bounding box coordinates for the picture, and set it to state
  setBoundingBoxes = (faceDetections) => {
    let box_x1=0, box_y1=0, box_w=0, box_h=0;
    const image = document.getElementById("inputimage");
    const pix_w = Number(image.width),
          pix_h = Number(image.height);
    
    const boundingBoxes = faceDetections.map( 
      boxData => {
        let boundingbox = boxData.region_info.bounding_box;
        box_x1=Math.round(boundingbox.left_col*pix_w);
        box_y1=Math.round(boundingbox.top_row*pix_h);
        box_w = Math.round(boundingbox.right_col*pix_w) - box_x1;
        box_h = Math.round(boundingbox.bottom_row*pix_h) - box_y1;
        return { x1: box_x1, y1: box_y1, w: box_w, h: box_h };
      }
    );

    this.setState({ boundingBoxes })
  }

  // Handles Image URL Submit
  onImageUrlSubmit = () => {
    const { user } = this.state;
    const scanServer = SERVER_URL + '/scanServer';

    // Load image onpage
    this.setState({imageUrl: this.state.input});

    // Send image url to server for face detection analysis
    // Receve faceDetections data which will be used to generate facial bounding boxes
    fetch(scanServer, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ input: this.state.input })
    })
    .then(response => response.json())
    .then( faceDetections => {
      if (faceDetections){
        
        // Update entries score for logged in user
        const endpoint = SERVER_URL + '/entry';
        fetch(endpoint, {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: user.id})
        }) 
        .then(response => response.json())
        .then(data => {if (typeof data == 'number'){
          this.setState(Object.assign(this.state.user, {entries: data}))
        }})
        .catch(err => console.log(err));

        this.setBoundingBoxes(faceDetections);
      }
    })
    .catch(err => console.log(err));
  }

  // Receives a url path on link clicks and performs an action depending on which
  onRouteChange = (route) => {
    if (route === 'signout') this.setState(initState);
    else if (route === 'home'){
      this.setState({isLoggedin: true});
    }
    
    this.setState({route: route});
  }

  render() {
    const {isLoggedin, imageUrl, route, boundingBoxes} = this.state;
    const {name, entries} = this.state.user;
    
    return (
      <div className="App">
        <Particles classname="particles" params={particleParams} />
        <Navigation onRouteChange={this.onRouteChange} isLoggedin={isLoggedin} />
        {isLoggedin
        ?
        <div>
        <Rank name={name} entries={entries} />
        <ImageLinkForm onInputChange={this.onInputChange} onImageUrlSubmit={this.onImageUrlSubmit} />
        <FaceRecImage imageUrl={imageUrl} boundingBoxes={boundingBoxes} />
        </div>
        : (
          route === 'register'
          ?
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          :
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    );
  }
}

export default App;
