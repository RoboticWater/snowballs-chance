import React, { Component } from 'react';
import classNames from 'classnames';
import bondage from 'bondage';
import dialog from '../resources/dialog.json';

import Fade from '../Fade';

import './DialogDisplay.css';

export default class DialogDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      showText: true,
      options: [],
      selector: null,
      runner: null,
      dialog: null,
    }
  }

  componentDidMount() {
    this.setState({ runner: new bondage.Runner() }, () => {
      this.state.runner.load(dialog);
      this.state.runner.setCommandHandler(command => {
        console.log(command)
        let tokens = command.split(' ');
        if (tokens[0] === 'image') {
          console.log("SET IMAGE")
          this.props.setImage(tokens[1])
        } else if (tokens[0] === 'background') {
          console.log("SET BACKGROUND")
          this.props.setBackground(tokens[1])
        } else if (tokens[0] === 'audio') {
          console.log("SET AUDIO")
          this.props.setAudio(tokens[1])
        } else if (tokens[0] === 'snowball') {
          console.log("SET SNOWBALL");
          this.props.setSnowball(tokens[1])
        } else if (tokens[0] === 'title') {
          console.log("SET TITLE");
          this.props.setTitle(tokens[1] === 'show' ? true : false)
        } else if (tokens[0] === 'reset') {
          console.log("RESET");
          this.props.reset()
        }
      });
      this.setState({dialog: this.state.runner.run('Start')}, () => {
        this.getNext()
      });
    });
  }

  snowballDie() {
    console.log("SNOWBALL DEAD")
    this.setState({dialog:  this.state.runner.run('SnowballEnd0')}, () => {
      console.log(this.state)
      this.getNext()
    });
    // this.state.dialog = this.state.runner.run('SnowballEnd0');
    // this.getNext();
  }

  getNext(select=null) {
    let result;
    if (select !== null) {
      this.state.selector.select(select)
    }
    var test = this.state.dialog.next()
    console.log(test)
    result = test.value;
    console.log(result)
    if (result instanceof bondage.TextResult) {
      this.setState({ showText: false });
      setTimeout(() => {
        this.setState(prev => ({
          text: result.text,
          selector: null,
          showText: true,
        }));
      }, 600);
    } else if (result instanceof bondage.OptionsResult) {
      this.setState(prev => ({ 
        selector: result,
        options: result.options,
      }));
    }
  }

  renderOptions(options) {
    return this.state.selector ? 
      options.map((option, index) => (<div key={index} className="option" onClick={() => this.getNext(index)} dangerouslySetInnerHTML={{__html: option}}></div>)) :
      (<div className="option next" onClick={() => this.getNext()}>⤳</div>) //⟶⟹⤳⇾
  }

  render() {
    return (
      <div className={classNames("DialogDisplay", {show: this.props.show})}>
        <div 
          className={classNames("text", {show: this.state.showText})} 
          dangerouslySetInnerHTML={{__html: this.state.text}}></div>
        <div className="options">
          {this.renderOptions(this.state.options)}
        </div>
      </div>
    );
  }
}