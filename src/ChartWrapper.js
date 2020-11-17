
import React, { useRef, useState, useEffect } from 'react';
import D3Chart from './D3Chart';
import BarChart from './BarChart';
import * as d3 from 'd3'

const datas = [
    [10, 30, 40, 20],
    [10, 40, 30, 20, 50, 10],
    [60, 30, 40, 20, 30]
]
var i = 0;

const ChartWrapper = ({ gender }) => {
	const chartArea = useRef(null)
	const [chart, setChart] = useState(null)
	const [selectedPerson, setSelectedPerson] =useState([])

	console.log('selectedPerson', selectedPerson)

	const filterSelectedPerson = (person) => {
		setSelectedPerson((state) => {
			if(state.includes(person.name)) {
			  return state.filter((person) => person !== person.name)
			} else {
			return [...state, person.name];
			}
		});
	}


	const [data, setData] = useState([]);

    useEffect(() => {
        changeData();
    }, []);

    const changeData = () => {
        setData(datas[i++]);
        if(i === datas.length) i = 0;
    }

	useEffect(() => {

		
		if (!chart) {
			Promise.all([
					d3.json("https://udemy-react-d3.firebaseio.com/tallest_men.json"),
					d3.json("https://udemy-react-d3.firebaseio.com/tallest_women.json")
				]).then((datasets) => {
					setChart(new D3Chart(chartArea.current, datasets))	
				})
			
		} else {
			chart.update({gender, selectedPerson, setSelectedPerson: filterSelectedPerson })
		}
	}, [chart, gender, selectedPerson])

	useEffect(() => {
		if(selectedPerson){
			console.log('useEffect', selectedPerson)
		}
	})

	return (
		<div>
		<div className="chart-area" ref={chartArea}></div>
		{selectedPerson ? selectedPerson.map((user) => {
		  console.log(' selectedPerson in return',user) 
		return(	
			<>
			<h4>{user}</h4>
			</>
		  )}) :
		  "You currently have nothing selected"}

		  <div>
		  <h2>Graphs with React</h2>
            <button onClick={changeData}>Change Data</button>
            <BarChart width={600} height={400} data={data} />
		  </div>
	  </div>
	)
}

export default ChartWrapper;