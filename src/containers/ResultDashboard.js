import React, { useRef} from 'react';
import Chart from 'chart.js/auto';

export default function ResultDashboard() {

  const resultCodeQuestionnaire = useRef();

  var results = {
    "questionnaireCode" : "",
    "questionSubDimensions" : [],
    "scores" : []
  }

  const chartData = {
    labels: [],
    datasets: [{
      label: "QS2",
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)',
      data: [],
    }]
  };

  const chartData2 = {
    labels: [],
    datasets: [{
      label: 'My First Dataset',
      data: [],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  }


  function fetchResults(){
    const questionnaireCode = resultCodeQuestionnaire.current.value
    const url = `http://localhost:8080/api/v1/result/${questionnaireCode}`
    fetch(url , {
        method : 'GET',
        mode: 'cors',
        headers: {
            'Content-Type' : 'application/json',
            'accept' : '*/*'
        }
    })
    .then(response => response.json())
    .then(response => {
      
      results.questionnaireCode = response.questionnaireCode
      results.questionSubDimensions = response.subDimensions
      results.scores = response.scores

      chartData2.labels = results.questionSubDimensions
      chartData2.datasets[0].label = results.questionnaireCode
      chartData2.datasets[0].data = results.scores
      
      console.log(chartData2)
      
      var options = {
        responsive: true,
        maintainAspectRadio: true,
        legend: {
          position: 'top',
          },
        title: {
            display: true,
            text: 'Radar Chart'
            },
            scales :{
              r: {
                max:5,
                min:0
              }
          },
         };
      
      const config = {
        type: 'radar',
        data: chartData2,
        options: options
      };

      config.data = chartData2
      console.log(chartData2)
      config.options = options

      const spiderChart = new Chart(
        document.getElementById('chart').getContext('2d'),
        config
      )
      console.log(config)
    })
    resultCodeQuestionnaire.current.value = null
  }


  return (
    <div>
      <h2>Result</h2>
        <div className='questionnaireFetcher'>
            <input type="text" ref={resultCodeQuestionnaire}/> 
            <input type="submit" onClick={fetchResults}/> 
        </div>
        <div id='chartContainer'>
            <canvas id='chart' width='100' height='100' ></canvas>
        </div>
    </div>
  )
}
