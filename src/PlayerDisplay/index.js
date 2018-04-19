import React, { Component } from 'react';
import classNames from 'classnames';
import svgpath from 'svgpath';
import rough from 'roughjs';

import './PlayerDisplay.css'

const startLife = 1000;

export default class PlayerDisplay extends Component {
  constructor(props) {
    super(props);
    this.player_canvas = React.createRef();
  }

  update() {
    let context = this.player_canvas.current.getContext('2d');
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.player_canvas.current.width, this.player_canvas.current.height);
    context.restore();
    
    // Draw rough shapes
    let s = this.props.life / startLife;
    let es = lerp(0.1, 1, s);
    const rc = rough.canvas(this.player_canvas.current);
    let body = svgpath("M40.6,65.8c-16.8,3.4-76.2,4.4-88-1.6C-100.1,37.5-54.1-68.5,2.2-68.5C65.5-68.5,98.6,54.1,40.6,65.8z")
    let eye_right = svgpath("M-11.1-37.1c0,6.1-4.9,10-11,10s-11-2.9-11-9s6.9-12,13-12S-11.1-43.1-11.1-37.1z")
    let eye_left = svgpath("M33.5-37.1c0,6.1-4.9,10-11,10s-11-3.9-11-10s2.9-11,9-11S33.5-43.1,33.5-37.1z")
    rc.path(body.scale(s).translate(100, 100).toString(), { stroke: '#5d5555' })
    rc.path(eye_left.scale(es).translate(100, 100).toString(), { 'fill': 'black', roughness: 0.7, stroke: '#5d5555' })
    rc.path(eye_right.scale(es).translate(100, 100).toString(), { fill: 'black', roughness: 0.7, stroke: '#5d5555' })
  }

  componentDidMount() {
    let interval = setInterval(this.update.bind(this), 100);
    this.setState({ interval: interval });
  }

  render() {
    return (
      <div className={classNames("PlayerDisplay")}>
        <canvas className="player" width="200" height="200" ref={this.player_canvas}></canvas>
      </div>
    );
  }
}

function lerp(start, end, amt) {
  return (1-amt)*start+amt*end
}