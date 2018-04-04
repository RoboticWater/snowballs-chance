import React, { Component } from 'react';
import './App.css';
import svgpath from 'svgpath';
import rough from 'roughjs';
import classNames from 'classnames';
import bondage from 'bondage';

import intro from './resources/sound/intro-timpani.mp3';
import sunburst from './resources/svg/sunburst.svg';
import test from './resources/test.json';

import Fade from './Fade';

const startLife = 1000;

const audio_files = {
  amb_horror: require('./resources/sound/amb_horror.wav'),
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      life: startLife,
      dying: false,
      interval: null,
      playerSide: false,
      start: false,
      showDialog: false,
      showTitle: false,
      audio: null,
    }
    this.introSound = new Audio(intro);
  }

  changeLife() {
    // if (this.state.dying) this.setState(prev => ({ life: prev.life - 1 }));
    // else this.setState(prev => ({ life: prev.life + 2 * (prev.life % 2 - 0.5) }));
  }

  setAudio(file) {
    this.setState({ audio: audio_files[file] })
  }

  componentDidMount() {
    let interval = setInterval(this.changeLife.bind(this), 100);
    this.setState({ interval: interval });
    // runner.load(yarnData);
  }

  componentWillUnmount() {
    if (this.state.interval) clearInterval(this.state.interval);
  }

  begin() {
    this.introSound.play();
    this.setState({ start: true, showTitle: true });
    setTimeout(() => this.setState({ showTitle: false }), 12000);
    setTimeout(() => this.setState({ showDialog: true }), 15000);
  }
// <PlayerDisplay life={this.state.life} corner={this.state.playerSide}/>
  render() {
    console.log(this.state)
    return (
      <div className="App">
        <audio src={this.state.audio} autoPlay loop></audio>
        {this.state.start && <Fade startVisisble show={this.state.showTitle} className="title-card">
          <h1>A Snowball's Chance</h1>
          <h2>in</h2>
          <div className="centered hell"><HELL/></div>
        </Fade>}
        {!this.state.start && <div className="disclaimer">This project includes sound</div>}
        <div className="content">
          <div className="left"></div>
          <div className="center">
            <div className="image"></div>
            <div className="dialog-box">
              {this.state.start && <DialogDisplay
                show={this.state.showDialog}
                setAudio={this.setAudio.bind(this)}
              />}
            </div>
          </div>
          <div className="right"></div>
        </div>
        {!this.state.start && <div className="begin">
          <img src={sunburst} alt=""/>
          <div className="button" onClick={() => this.begin()}>Begin</div>
        </div>}
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

class HELL extends Component {
  constructor(props) {
    super(props);
    this.context = null;
    this.canvas = React.createRef();
  }

  update() {
    let context = this.canvas.current.getContext('2d');
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    context.restore();

    const rc = rough.canvas(this.canvas.current);
    rc.path("M101.1,63.2V14.5h25.4v127.2h-25.4V88.7H54v53.1H28.6V14.5H54v48.7H101.1z", { roughness: 2, fill: '#e83b2e', stroke: '#e83b2e', fillWeight: 1 });
    rc.path("M233.3,14.3v25.4h-59.4v23.4h49.1v25.4h-49.1v27.6h58.9v25.4h-84.3V14.3H233.3z", { roughness: 2, fill: '#e83b2e', stroke: '#e83b2e', fillWeight: 1 });
    rc.path("M282.3,14.3v102h47.4v25.3h-72.9V14.3H282.3z", { roughness: 2, fill: '#e83b2e', stroke: '#e83b2e', fillWeight: 1 });
    rc.path("M378.9,14.3v102h47.4v25.3h-72.9V14.3H378.9z", { roughness: 2, fill: '#e83b2e', stroke: '#e83b2e', fillWeight: 1 });
  }

  componentDidMount() {
    let interval = setInterval(this.update.bind(this), 100);
    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentWillReceiveProps(newProps) {
    
  }

  render() {
    return (
      <div className={classNames("HELL", {corner: this.props.corner})} style={{display: 'inline-block'}}>
        <canvas className="hell-text" width="430" height="200" ref={this.canvas}></canvas>
      </div>
    );
  }
}


class DialogDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      options: [],
      selector: null,
      runner: null,
      dialog: null,
    }
  }

  componentDidMount() {
    this.setState({ runner: new bondage.Runner() }, () => {
      this.state.runner.load(test);
      this.state.runner.setCommandHandler(command => {
        let delim = command.split(' ')[0];
        if (delim === 'image') {
          console.log("SET IMAGE")
        } else if (delim === 'audio') {
          console.log("SET AUDIO")
          this.props.setAudio(command.split(' ')[1])
        }
      });
      this.state.dialog = this.state.runner.run('ThreeNodes');
      this.getNext()
    });
    
  }

  getNext(select=null) {
    let result;
    if (select !== null) {
      this.state.selector.select(select)
    }
    result = this.state.dialog.next().value;
    if (result instanceof bondage.TextResult) {
      this.setState(prev => ({ 
        text: result.text,
        selector: null,
      }));
    } else if (result instanceof bondage.OptionsResult) {
      this.setState(prev => ({ 
        selector: result,
        options: result.options,
      }));
    }
  }

  renderOptions(options) {
    return options.map((option, index) => (
      <button key={index} onClick={() => this.getNext(index)}>{option}</button>
    ))
  }

  render() {
    // console.log(this.state)
    return (
      <div className={classNames("DialogDisplay", {show: this.props.show})}>
        <div className="text" dangerouslySetInnerHTML={{
          __html: this.state.text 
        }}></div>
        {this.state.selector ? 
          this.renderOptions(this.state.options) : 
          <button className="next" onClick={() => this.getNext()}>>>>>></button>}
      </div>
    );
  }
}

export default App;

function lerp(start, end, amt) {
  return (1-amt)*start+amt*end
}