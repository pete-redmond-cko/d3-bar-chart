import * as d3 from 'd3'
import React, { useRef, useState, useEffect } from 'react';

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;


//To DO
// 0/ on hover change color of bar  DONE
// 1/ OnClick of a bar store data and show underneath 
// 2/ OnClick of a second bar append data an update section underneath
// 3/ Onclick of a selected bar remove it from selection and update section underneath

export default class D3Chart {

    
    constructor(element, datasets) {
        const vis = this

        vis.svg = d3.select(element)
            .append("svg")
                .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
                .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append("g")
                .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        vis.xLabel = vis.svg.append("text")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 50)
            .attr("text-anchor", "middle")

        vis.svg.append("text")
            .attr("x", -(HEIGHT / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .text("Height in cm")
            .attr("transform", "rotate(-90)")

        vis.xAxisGroup = vis.svg.append("g")
            .attr("transform", `translate(0, ${HEIGHT})`)

        vis.yAxisGroup = vis.svg.append("g")

        vis.menData = datasets[0]
        vis.womenData = datasets[1]

    }

    update({gender, selectedPerson, setSelectedPerson}) {

        const vis = this

        vis.data = (gender === "men") ? vis.menData : vis.womenData;
        vis.xLabel.text(`The world's tallest ${gender}`)

        const y = d3.scaleLinear()
            .domain([
                d3.min(vis.data, d => d.height) * 0.95, 
                d3.max(vis.data, d =>  d.height)
            ])
            .range([HEIGHT, 0])

        const x = d3.scaleBand()
            .domain(vis.data.map(d => d.name))
            .range([0, WIDTH])
            .padding(0.4)

        const xAxisCall = d3.axisBottom(x)
        vis.xAxisGroup.transition().duration(500).call(xAxisCall)

        const yAxisCall = d3.axisLeft(y)
        vis.yAxisGroup.transition().duration(500).call(yAxisCall)

        // DATA JOIN
        const rects = vis.svg.selectAll("rect")
            .data(vis.data)

        // EXIT
        rects.exit()
            .transition().duration(500)
                .attr("height", 0)
                .attr("y", HEIGHT)
                .remove()

        // UPDATE
        rects.transition().duration(500)
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.height))
            .attr("width", x.bandwidth)
            .attr("height", d => HEIGHT - y(d.height))
            .attr("fill",(e)=> {
                console.log('selected person', e)
                if( selectedPerson.includes(e.name)) {
                    return 'green'
                }else {
                return 'grey'}})

        // ENTER

// .enter() must follow a .data() method call.
// .enter() uses the current selection as the parent node for the elements added with .append().
// .append() can be used to add more than svg elements.

        rects.data(this.data).enter().append("rect")
            .attr("x", d => x(d.name))
            .attr("width", x.bandwidth)
				// https://stackoverflow.com/questions/42245210/how-to-properly-implement-d3-svg-click-with-react?rq=1
				// http://jonathansoma.com/tutorials/d3/clicking-and-hovering/
            .on("click", function(event, d, i) {
                console.log("click", d);
              setSelectedPerson(d)
            })

            // .on("mouseover", function() {
            //  d3.select(this)
            //      .attr("fill", "red");
			// })
			// // will break the selected items
            // .on("mouseout", function(d, i) {
            //  d3.select(this)
            //      .attr("fill", "grey");
            // })
        
            .attr("y", HEIGHT)
            .transition().duration(500)
                .attr("height", d => HEIGHT - y(d.height))
                .attr("y", d => y(d.height))
    }
}
