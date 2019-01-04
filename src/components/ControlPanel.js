import React, {Component} from 'react';
import {render} from 'react-dom';

export class ControlPanel extends Component {
	constructor(props) {
		super(props);
	}	
	
	render() {
		var d = this.props.date.toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric',hour: '2-digit',minute: '2-digit'}); 
		//console.log(this.props);
		return (
			<div id="control-panel">
				<h1 id="title">Barcelona Bike Trips</h1>
				<hr/>
				<p>{"Visualize the trips carried out with the public system of electric bicycles of the city of Barcelona"}</p>
				<p>{new Date(this.props.tmin).toDateString()," ― ",new Date(this.props.tmax).toDateString()}</p>
				<hr/>
				<label>
					<p className="g">{"Animation Speed"}
					<input type="range" value={this.props.animationSpeed} onChange={this.props.animationSpeedChange} max="100" min="1" step="1" data-show-value="true"/>
					{this.props.animationSpeed + "%"}
					</p>
					<p className="g">{"Trail Length"}
					<input type="range" value={this.props.trailLength} onChange={this.props.trailLengthChange} max="200" min="1" step="1" data-show-value="true"/>
					{this.props.trailLength + "%"}
					</p>
					<p className="g">{"Current Time: ",d}</p>
				</label>
				<hr/>
				<p>{"Hold ctrl + drag to tilt the map"}</p>
				<p>
					<a className="github-button" href="https://github.com/imartinezl" data-size="large" data-show-count="true" aria-label="Follow @imartinezl on GitHub">Follow @imartinezl</a>{"  "}
					<a className="github-button" href="https://github.com/imartinezl/bicing-deckgl" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star imartinezl/bicing-deckgl on GitHub">Star</a>
				</p>
			</div>
		);
	}
	//<p>{"Made with"} <a href="https://deck.gl/#/"> Deck.gl </a></p>
}