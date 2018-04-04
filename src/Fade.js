import React, { Component } from 'react';
import classNames from 'classnames';
import './Fade.css';

class Fade extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	gone: Boolean(!this.props.startVisisble),
    }
  }

  componentWillReceiveProps(next) {
  	if (next.show) {
  		this.setState({ gone: false });
  	} else {
  		setTimeout(() => this.setState({ gone: true }), 2000);
  	}
  }

  render() {
  	return this.state.gone ? null : (
			<div className={classNames("Fade", this.props.className, {show: this.props.show})}>
				{this.props.children}
			</div>
		)
  }
}

export default Fade;