 /* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {PolygonLayer,ScatterplotLayer,GeoJsonLayer} from 'deck.gl';
import {TripsLayer} from '@deck.gl/experimental-layers';

import {Graph} from './Graph.js'
import {ControlPanel} from './ControlPanel.js'

import trips_count from '../json/trips_count_sample.json'
import trips_init from '../json/trips_init_sample.json'

var tmin = trips_init.tmin*1000;
var tmax = trips_init.tmax*1000;
var maxCount = trips_init.maxCount;
var tSpan = tmax-tmin;

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const DATA_URL = {
  TRIPS: 'trips_sample.json',
  STATIONS : 'stations.json',
  BUILDINGS: 'buildings.json'
};

const LIGHT_SETTINGS = {
  lightsPosition: [2.12, 41.4, 8000, 2.5, 42, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

export const INITIAL_VIEW_STATE = {
	longitude: 2.153, 
	latitude: 41.390,
	zoom: 13,
	maxZoom: 16,
	pitch: 45,
	bearing: 0,
	
	// interactive:false,
	// scrollZoom: true,
	// dragRotate: true,
	// trackResize: false,
	// touchZoomRotate: false,
	// doubleClickZoom: false,
	// keyboard: true,
	// dragPan: false,
};

		
export class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  time: 0,
		  date: 0,
		  animationSpeed: 5, //percentage of loopLength
		  trailLength: 1,   //percentage of loopLength
		  loopLength: 2000,
		};
		this.animationSpeedChange = this.animationSpeedChange.bind(this);
		this.trailLengthChange = this.trailLengthChange.bind(this);
		
	}
	componentDidMount() {
		this._animate();
		document.addEventListener("keypress", (event) => {
			if( event.which === 32) {
				console.log(this.state.time);
				console.log(this.state.date);
			}
		})
	}

	componentWillUnmount() {
		if (this._animationFrame) {
		  window.cancelAnimationFrame(this._animationFrame);
		}
	}

	_animate() {
		const loopLength = this.state.loopLength;
		const animationSpeed = this.state.animationSpeed*loopLength/100;
		const timestamp = Date.now() / 1000;
		const loopTime = loopLength / animationSpeed;
		const utcDelay = 2*3600*1000;
		
		this.setState({
		  time: ((timestamp % loopTime) / loopTime) * loopLength,
		  date: new Date(this.state.time/this.state.loopLength*tSpan+tmin-utcDelay)
		});
		this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
	}

	_renderTooltip() {
		const {hoveredObject, pointerX, pointerY} = this.state || {};
		if (!hoveredObject) {
		  return null;
		}
		return (
		  <div className="tooltip" style={{pointerEvents: 'none', left: pointerX, top: pointerY}}>
			<div>{"ID: ",hoveredObject.id}</div>
			<div>{"NAME: ",hoveredObject.streetName}</div>
			<div>{"LATITUDE: ",hoveredObject.latitude}</div>
			<div>{"LONGITUDE: ",hoveredObject.longitude}</div>
		  </div>
		);
	}
	
	animationSpeedChange(event) {
		this.setState({animationSpeed: event.target.value});
	}
	trailLengthChange(event) {
		this.setState({trailLength: event.target.value});
	}


	_renderLayers() {
	const {buildings = DATA_URL.BUILDINGS, trips = DATA_URL.TRIPS, stations = DATA_URL.STATIONS} = this.props;

	return [
	 //  new TripsLayer({
		// id: 'trips',
		// data: trips,
		// getPath: d => d.segments,
		// getColor: [255, 25, 100], // d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]), //[50, 255, 255], [23, 184, 190]
		// opacity: 0.9,
		// strokeWidth: 5,
		// lineWidthScale: 5,
		// trailLength: this.state.trailLength*this.state.loopLength/100,
		// currentTime: this.state.time
	 //  }),
	  new ScatterplotLayer({
		id: 'stations',
		data: stations,
		getRadius: 25,
		getPosition: d => [d.longitude,d.latitude],
		getColor: [0, 249, 170],
		pickable: true,
		fp64: false,
		opacity: 0.95,
		radiusMinPixels: 0,
		radiusMaxPixels: 30,
		outline: true,
		strokeWidth: 2,
		onClick: d => console.log(d),
		onHover: info => this.setState({
		  hoveredObject: info.object,
		  pointerX: info.x,
		  pointerY: info.y
		})
	  }),
	  new PolygonLayer({
		id: 'buildings',
		data: buildings,
		extruded: true,
		wireframe: false,
		fp64: false,
		opacity: 0.4,
		getPolygon: f => f.polygon,
		getElevation: 30,
		getFillColor: [180, 180, 220, 100], //[160, 160, 180, 200]
		lightSettings: LIGHT_SETTINGS
	  })
	];
	}

	render() {
	const {viewState, controller = true, baseMap = false} = this.props;

	return (
		<div>
			<ControlPanel 
			date={this.state.date}
			animationSpeed={this.state.animationSpeed}
			animationSpeedChange={this.animationSpeedChange}
			trailLength={this.state.trailLength}
			trailLengthChange={this.trailLengthChange}
			tmin={tmin}
			tmax={tmax}
			/>
			<Graph
			date={this.state.date}
			trips_count={trips_count}
			trips_init={trips_init}
			/>
			<div>
				<DeckGL
				layers={this._renderLayers()}
				initialViewState={INITIAL_VIEW_STATE}
				viewState={viewState}
				controller={controller}
				>
					{baseMap && (
						<StaticMap
						reuseMaps
						mapStyle="mapbox://styles/inigoml/cjq0uk62956tg2roayaaxkocg" //"mapbox://styles/mapbox/dark-v9" 
						preventStyleDiffing={true}
						mapboxApiAccessToken={MAPBOX_TOKEN}
						/>
					),this._renderTooltip()}
				</DeckGL>
			</div>
		</div>
	);
	}
}

export function renderToDOM(container) {
  render(<App />, container);
}

