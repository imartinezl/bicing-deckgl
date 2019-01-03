
import React, {Component} from 'react';
import {render} from 'react-dom';

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel, VictoryZoomContainer, VictoryBrushContainer, VictoryArea } from 'victory';

import trips_count from '../json/trips_count_sample.json'
import trips_init from '../json/trips_init_sample.json'

var tmin = trips_init.tmin*1000;
var tmax = trips_init.tmax*1000;
var maxCount = trips_init.maxCount;
var tSpan = tmax-tmin;

const vStyles = {
	xAxis: {
		axis: {
			fill: "transparent",
			stroke: "#FFF",
			strokeWidth: 0.5
		},
		ticks: {
			fill: "transparent",
			size: 0,
			stroke: "transparent",
			strokeWidth: 0
		},
		tickLabels: {
			fill: "#FFF",
			stroke: "transparent",
			strokeWidth: 0,
			fontFamily: "Open Sans",
			fontSize: 10
		},
		grid: {
			fill: "none",
			stroke: "#FFF",
			strokeWidth: 0.5
		}
	},
	yAxis: {
		axis: {
			fill: "transparent",
			stroke: "#FFF",
			strokeWidth: 0.5
		},
		ticks: {
			fill: "transparent",
			size: 0,
			stroke: "transparent",
			strokeWidth: 0
		},
		tickLabels: {
			fill: "#FFF",
			stroke: "transparent",
			strokeWidth: 0,
			fontFamily: "Open Sans",
			fontSize: 10
		},
		grid: {
			fill: "none",
			stroke: "#FFF",
			strokeWidth: 0.5		
		},
	},
	lineData: {
		data: { 
			stroke: "rgb(255, 25, 100)",
		}						  
	},
	areaData: {
		data: { 
			fill: "rgb(255, 25, 100)"
		}						  
	},
	lineDate: {
		data: { 
			stroke: "rgb(0, 249, 170)"
		}
	},
	areaDate: {
		data: { 
			stroke: "rgb(0, 249, 170)",
			fill: "rgba(0, 249, 170)",
			fillOpacity: 0.1,
			strokeWidth: 0
		}
	}
}

export class Graph extends Component {
	
	constructor(props) {
		super(props);
	}	
	
	_getTripsCounts(){
		var data2 = [];
		for(var i = 0; i < trips_count.length; i++) {
			data2[i] = {};
			data2[i].x = new Date(trips_count[i].date);
			data2[i].y = trips_count[i].count;
		}
		return data2;		
	}
	_getAreaData(){
		var data2 = [
			{x: new Date(trips_count[0].date), y: maxCount},
			{x: new Date(trips_count[trips_count.length-1].date), y: maxCount}
		];
		if(this.props.date < new Date(trips_count[trips_count.length-1].date)){
			data2 = [
				{x: new Date(trips_count[0].date), y: maxCount},
				{x: this.props.date, y: maxCount}
			];
		}
		return data2;		
	}
	_dateTickValues(){
		const n = 6;
		var ticks = [];
		for(var i=0; i<n; i++){
			ticks[i] = new Date(tmin + (tmax-tmin)*i/n);
		}
		return ticks;
	}
	
	render() {
		return(
		<div id="VictoryContainer">
			<VictoryChart
				height={100}
				width={750}
				padding={{top: 20, bottom:30, left:40, right:40}}
			>
				<VictoryAxis
				  scale="time"
				  standalone={false}
				  //tickValues={this._dateTickValues()}
				  tickFormat={(x) => x.toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric',hour: '2-digit',minute: '2-digit'})} //toLocaleDateString
				  style={vStyles.xAxis}
				  tickLabelComponent={<VictoryLabel angle={0}/>}
				/>
				<VictoryAxis dependentAxis
				  orientation="left"
				  standalone={false}
				  style={vStyles.yAxis}
				  tickValues={[0,maxCount]}
				/>
				<VictoryAxis dependentAxis
				  orientation="right"
				  standalone={false}
				  style={vStyles.yAxis}
				  tickValues={[0,maxCount]}
				/>
				<VictoryArea 
					data={this._getTripsCounts()}
					interpolation="monotoneX"
					style={vStyles.areaData}
					scale={{x: "time", y: "linear"}}
					domain={{x:[tmin, tmax], y: [0, maxCount]}}
					domainPadding={0}
					y0={0}
				/>
				<VictoryArea
					data={this._getAreaData()}
					scale={{x: "time", y: "linear"}}
					standalone={false}
					style={vStyles.areaDate}
				/>
			</VictoryChart>
		</div>
	)
	}
	
}