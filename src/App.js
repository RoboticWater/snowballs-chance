import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import svgpath from 'svgpath';
import rough from 'roughjs';
import classNames from 'classnames';

const startLife = 1000

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      life: startLife,
      interval: null,
      playerSide: false,
    }
  }

  lifeCountdown() {
    this.setState(prev => ({ life: prev.life - 1 }));
  }

  componentDidMount() {
    let interval = setInterval(this.lifeCountdown.bind(this), 100);
    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <div className="App" onClick={() => this.setState(prev => ({playerSide: !prev.playerSide}))}>
        <PlayerDisplay life={this.state.life} corner={this.state.playerSide}/>
        <div className="left"></div>
        <div className="center"></div>
        <div className="right"></div>
      </div>
    );
  }
}

class PlayerDisplay extends Component {
  constructor(props) {
    super(props);
    this.context = null;
    this.canvas = React.createRef();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.life < 1) return;
    let context = this.canvas.current.getContext('2d');
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    context.restore();
    
    // Draw rough shapes
    let s = newProps.life / startLife;
    let es = lerp(0.1, 1, s);
    const rc = rough.canvas(this.canvas.current);
    let body = svgpath("M40.6,65.8c-16.8,3.4-76.2,4.4-88-1.6C-100.1,37.5-54.1-68.5,2.2-68.5C65.5-68.5,98.6,54.1,40.6,65.8z")
    let eye_right = svgpath("M-11.1-37.1c0,6.1-4.9,10-11,10s-11-2.9-11-9s6.9-12,13-12S-11.1-43.1-11.1-37.1z")
    let eye_left = svgpath("M33.5-37.1c0,6.1-4.9,10-11,10s-11-3.9-11-10s2.9-11,9-11S33.5-43.1,33.5-37.1z")
    rc.path(body.scale(s).translate(100, 100).toString())
    rc.path(eye_left.scale(es).translate(100, 100).toString(), {'fill': 'black', roughness: 0.7})
    rc.path(eye_right.scale(es).translate(100, 100).toString(), {fill: 'black', roughness: 0.7})
  }

  render() {
    return (
      <div className={classNames("PlayerDisplay", {corner: this.props.corner})}>
        <canvas className="player" width="200" height="200" ref={this.canvas}></canvas>
      </div>
    );
  }
}

export default App;

function lerp(start, end, amt) {
  return (1-amt)*start+amt*end
}