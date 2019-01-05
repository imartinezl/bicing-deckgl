
import React, {Component} from 'react';
import {render} from 'react-dom';
import moment from 'moment';

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel, VictoryZoomContainer, VictoryBrushContainer, VictoryArea } from 'victory';

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
			fill: "rgb(0, 249, 170)",
			fillOpacity: 0.1,
			strokeWidth: 0
		}
	}
}
function mdate(x){
	return moment(x, 'YYYY-MM-DD HH:mm:ss');
}

export class Graph extends Component {
	
	constructor(props) {
		super(props);
		this.trips_count = props.trips_count;
		this.trips_init = props.trips_init;

		this.tmin = this.trips_init.tmin*1000;
		this.tmax = this.trips_init.tmax*1000;
		this.maxCount = this.trips_init.maxCount;
		this.tSpan = this.tmax-this.tmin;
	}	
	_getTripsCounts(){
		var data = [];
		for(var i = 0; i < this.trips_count.length; i++) {
			data[i] = {};
			data[i].x = mdate(this.trips_count[i].date);
			// data[i].x = new Date(this.trips_count[i].date);			
			data[i].y = this.trips_count[i].count;
		}
		return data;		
	}
	_getAreaData(){
		var data = [
			{x: mdate(this.trips_count[0].date), y: this.maxCount},
			{x: mdate(this.trips_count[this.trips_count.length-1].date), y: this.maxCount}
		];
		if(this.props.date < mdate(this.trips_count[this.trips_count.length-1].date) ){
			data = [
				{x: mdate(this.trips_count[0].date), y: this.maxCount},
				{x: this.props.date, y: this.maxCount}
			];
		}
		// var data = [
		// 	{x: new Date(this.trips_count[0].date), y: this.maxCount},
		// 	{x: new Date(this.trips_count[this.trips_count.length-1].date), y: this.maxCount}
		// ];
		// if(this.props.date < new Date(this.trips_count[this.trips_count.length-1].date)){
		// 	data = [
		// 		{x: new Date(this.trips_count[0].date), y: this.maxCount},
		// 		{x: this.props.date, y: this.maxCount}
		// 	];
		// }
		return data;		
	}
	_dateTickValues(){
		const n = 6;
		var ticks = [];
		for(var i=0; i<n; i++){
			ticks[i] = new Date(this.tmin + (this.tmax-this.tmin)*i/n);
		}
		return ticks;
	}
	
	render() {

		return(
		<div id="GraphContainer">
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
				  tickValues={[0,this.maxCount]}
				/>
				<VictoryAxis dependentAxis
				  orientation="right"
				  standalone={false}
				  style={vStyles.yAxis}
				  tickValues={[0,this.maxCount]}
				/>
				<VictoryArea 
					data={this._getTripsCounts()}
					interpolation="monotoneX"
					style={vStyles.areaData}
					scale={{x: "time", y: "linear"}}
					domain={{x:[this.tmin, this.tmax], y: [0, this.maxCount]}}
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