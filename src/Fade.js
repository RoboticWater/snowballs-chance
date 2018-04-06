import React, { Component } from 'react';
import classNames from 'classnames';
import './Fade.css';

class Fade extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	gone: Boolean(!this.props.startVisisble),
      show: false,
    }
  }

  componentDidMount() {
    if (this.props.show)
      setTimeout(() => this.setState({ show: true }), 300);
  }

  componentWillReceiveProps(next) {
  	if (next.show) {
  		this.setState({ gone: false });
      setTimeout(() => this.setState({ show: true }), 300);
  	} else if (next.show !== this.props.show) {
      this.setState({ show: false });
  		setTimeout(() => this.setState({ gone: true }), 2000);
  	}
  }

  render() {
    const speed = this.props.speed ? this.props.speed : 'cubic-bezier(.6,.05,.19,.97) 0.75s'
  	return this.state.gone ? null : (
			<div className={classNames("Fade", this.props.className, {show: this.state.show})} style={{transition: 'opacity ' + speed}}>
				{this.props.children}
			</div>
		)
  }
}

export default Fade;