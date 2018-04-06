import React, { Component } from 'react';
import classNames from 'classnames';
import bondage from 'bondage';
import test from '../resources/test2.json';

import './DialogDisplay.css';

export default class DialogDisplay extends Component {
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
        console.log(command)
        let tokens = command.split(' ');
        if (tokens[0] === 'image') {
          console.log("SET IMAGE")
        } else if (tokens[0] === 'background') {
          console.log("SET BACKGROUND")
        } else if (tokens[0] === 'audio') {
          console.log("SET AUDIO")
          this.props.setAudio(tokens[1])
        } else if (tokens[0] === 'snowball') {
          console.log("SET SNOWBALL");
          this.props.setSnowball(tokens[1])
        } else if (tokens[0] === 'title') {
          console.log("SET TITLE");
          this.props.setTitle(tokens[1] === 'show' ? true : false)
        }
      });
      this.state.dialog = this.state.runner.run('Start');
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
    return this.state.selector ? 
      options.map((option, index) => (<div key={index} className="option" onClick={() => this.getNext(index)} dangerouslySetInnerHTML={{__html: option}}></div>)) :
      (<div className="option" onClick={() => this.getNext()}>&#8594;</div>)
  }

  render() {
    // console.log(this.state)
    return (
      <div className={classNames("DialogDisplay", {show: this.props.show})}>
        <div className="text" dangerouslySetInnerHTML={{__html: this.state.text}}></div>
        <div className="options">
          {this.renderOptions(this.state.options)}
        </div>
      </div>
    );
  }
}