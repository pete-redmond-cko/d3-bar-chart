import React from 'react';
import * as d3 from 'd3';

const url= 'https://udemy-react-d3.firebaseio.com/tallest_men.json';

export default class D3Chart {
    constructor(element:any) {
        const svg = d3.select(element).append('svg').attr('width', 800).attr('height', 500)

        d3.json<any>(url).then(data => {
            const rects =svg.selectAll("rect").data(data)

            rects.enter().append("rect").attr('x', (id, i) => i * 100).attr('y', 0)
            .attr('width', 50).attr('height', (d :any )=> d.height).attr('fill', 'grey')
        })
    }
}
