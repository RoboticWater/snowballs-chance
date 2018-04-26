import React, { Component } from 'react';
import './App.css';
import rough from 'roughjs';
import classNames from 'classnames';

import intro from './resources/sound/intro-timpani.mp3';
import sunburst from './resources/svg/sunburst.svg';

import Fade from './Fade';
import DialogDisplay from './DialogDisplay';
import PlayerDisplay from './PlayerDisplay';
import Modal from './Modal';

const audio_files = {
  amb_horror: require('./resources/sound/amb_horror.wav'),
  amb_office: require('./resources/sound/office_music.mp3'),
  words_hurt: require('./resources/sound/words_hurt.mp3'),
}

const background_files = {
  'cave': require('./resources/images/background/cave.png'),
  'crazy': require('./resources/images/background/crazy.png'),
  'office': require('./resources/images/background/office.png'),
}

const image_files = {
  'devil': require('./resources/images/character/devil.png'),
  'sis': require('./resources/images/character/sis.png'),
  'sis_far': require('./resources/images/character/sis_far.png'),
  'dj': require('./resources/images/character/dj.png'),
  'dj_far': require('./resources/images/character/dj_far.png'),
  'traveler': require('./resources/images/character/traveler.png'),
  'traveler_far': require('./resources/images/character/traveler_far.png'),
  'crazy': require('./resources/images/character/crazy.png'),
  'crazy_far': require('./resources/images/character/crazy_far.png'),
  'don': require('./resources/images/character/don.png'),
  'don_far': require('./resources/images/character/don_far.png'),
  'bones': require('./resources/images/item/bones.png'),
  'flower': require('./resources/images/item/flower.png'),
  'glasses': require('./resources/images/item/glasses.png'),
  'rock': require('./resources/images/item/rock.png'),
  'snowman': require('./resources/images/item/snowman.png'),
  'sword': require('./resources/images/item/sword.png'),
}

const SKIP_THE_BULLSHIT = false;

function lerp(start, end, amt) {
  return (1-amt)*start+amt*end
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dying: false,
      start: false,
      showDialog: false,
      showTitle: false,
      showPlayer: false,
      cornerPlayer: false,
      reset: true,
      background: 'cave',
      image: '',
      startLife: 10 * 60 * 7,
      showModal: true,
    }
    this.introSound = new Audio(intro);
    this.audioAmbient = new Audio();
    this.audioAmbient.autoplay = true;
    this.audioAmbient.loop = true;
    this.audioAmbient.volume = 0;
    this.dialogRunner = React.createRef();
  }

  changeLife() {
    if (this.state.dying) this.setState(prev => ({ life: prev.life - 1 }));
    else this.setState(prev => ({ life: prev.life + 2 * (prev.life % 2 - 0.5) }));
  }

  setAudio(file) {
    if (!this.audioAmbient.src) {
      this.audioAmbient.src = audio_files[file];
      this.audioAmbient.volume = 1;
    } else {
      var fadeInAudio;
      var switchAudio = setInterval(() => {
        if (this.audioAmbient.volume <= 0.05) {
          this.audioAmbient.volume = 0;
          this.audioAmbient.src = audio_files[file];
          fadeInAudio = setInterval(() => {
            if (this.audioAmbient.volume >= 0.95) {
              this.audioAmbient.volume = 1;
              clearInterval(fadeInAudio)
            } else {
              this.audioAmbient.volume = lerp(this.audioAmbient.volume, 1, 0.25);
            }
          }, 100);
          clearInterval(switchAudio);
        } else {
          this.audioAmbient.volume = lerp(this.audioAmbient.volume, 0, 0.25);
        }
      }, 100);
    }
  }

  setSnowball(state) {
    if (state === 'show')
      this.setState({ showPlayer: true, reset: false, });
    else if (state === 'hide')
      this.setState({ showPlayer: false });
    else if (state === 'corner')
      this.setState({ cornerPlayer: true });
    else if (state === 'center')
      this.setState({ cornerPlayer: false });
    else if (state === 'melting')
      this.setState({ dying: true, reset: false, });
    else if (state === 'cold')
      this.setState({ dying: false });
    else if (state === 'reset')
      this.setState({ reset: true, dying: false })
  }

  snowballDead() {
    this.setState({ dying: false }, () => {
      this.dialogRunner.current.snowballDie();
    });
    
  }

  setTitle(state) {
    this.setState({ showTitle: state });
  }

  setBackground(state) {
    this.setState({ background: state })
  }

  setImage(state) {
    this.setState({ image: state })
  }

  reset() {
    this.setState({
      dying: false,
      start: true,
      showDialog: true,
      showTitle: false,
      showPlayer: false,
      cornerPlayer: false,
      reset: true,
      background: 'cave',
      image: ''
    });
  }

  begin() {
    if (SKIP_THE_BULLSHIT) {
      this.setState({ start: true, showDialog: true })
    } else {
      this.introSound.play();
      this.setState({ start: true, showTitle: true });
      setTimeout(() => this.setState({ showDialog: true }), 9000);
    }
  }

  render() {
    return (
      <div className="App" style={{backgroundImage: 'url(' + background_files[this.state.background] + ')'}}>
        {this.state.start && <Fade startVisisble show={this.state.showTitle} className="title-card">
          <h1>A Snowball's Chance</h1>
          <h2>in</h2>
          <div className="centered hell"><HELL/></div>
        </Fade>}
        {!this.state.start && <div className="disclaimer">This project includes sound</div>}
        <div className={classNames("player-display", {corner: this.state.cornerPlayer})}><Fade show={this.state.showPlayer} speed="4s ease">
          <PlayerDisplay 
            startLife={this.state.startLife}
            dying={this.state.dying}
            reset={this.state.reset}
            snowballDead={() => this.snowballDead()}/>
        </Fade></div>
        <div className="content">
          <div className="left"></div>
          <div className="center">
            <div className="image" style={{backgroundImage: 'url(' + image_files[this.state.image] + ')'}}></div>
            {this.state.start && <div className={classNames("dialog-box", {small: this.state.showTitle})}>
               <DialogDisplay
                ref={this.dialogRunner}
                show={this.state.showDialog}
                setAudio={this.setAudio.bind(this)}
                setSnowball={this.setSnowball.bind(this)}
                setTitle={this.setTitle.bind(this)}
                setBackground={this.setBackground.bind(this)}
                setImage={this.setImage.bind(this)}
                reset={this.reset.bind(this)}
              />
            </div>}
          </div>
          <div className="right"></div>
        </div>
        {!this.state.start && <div className="begin">
          <img src={sunburst} alt=""/>
          <div className="button" onClick={() => this.begin()}>Begin</div>
        </div>}
        <Modal className="modal" shade show={this.state.showModal}>
          <p>This game involves quite a lot of reading on a time crunch. This is deliberate and important to the narrative, but if you think you need more time to experience our story, then who am I to get in the way of your enjoyment?</p>
          <div className="button" onClick={() => this.setState({ showModal: false })}>Play with Standard Time</div>
          <div className="button" onClick={() => this.setState({ showModal: false, startLife: 10 * 60 * 18 })}>Play with Extended Time</div>
        </Modal>
        <div className="vignette"></div>
      </div>
    );
  }
}

class HELL extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <div className={classNames("HELL", {corner: this.props.corner})} style={{display: 'inline-block'}}>
        <canvas className="hell-text" width="430" height="200" ref={this.canvas}></canvas>
      </div>
    );
  }
}

export default App;