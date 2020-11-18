import React, { useRef, useState, useEffect } from "react";
import D3Chart from "./D3Chart";
import * as d3 from "d3";

const ChartWrapper = ({ gender }) => {
  const chartArea = useRef(null);
  const [chart, setChart] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState([]);

  const toggleSelectedPerson = (person) => {
    setSelectedPerson((state) => {

      if(state.includes(person)) {
        return state.filter(p => p !== person);
      } else {
        return [...state, person]
      }
    });
  };

  useEffect(() => {
    if (!chart) {
      Promise.all([
        d3.json("https://udemy-react-d3.firebaseio.com/tallest_men.json"),
        d3.json("https://udemy-react-d3.firebaseio.com/tallest_women.json"),
      ]).then((datasets) => {
        setChart(new D3Chart(chartArea.current, datasets));
      });
    } else {
      chart.update({
        gender,
        selectedPerson,
        toggleSelectedPerson
      });
    }
  }, [chart, gender, selectedPerson]);

  return (
    <div>
      <div className="chart-area" ref={chartArea}></div>
      <ul>
        {selectedPerson.map(person => {
          return <li>
            <label>{person}</label>
            <input type="checkbox" checked onClick={() => {
              toggleSelectedPerson(person)
            }} />
          </li>
        })}
      </ul>
    </div>
  );
};

export default ChartWrapper;
