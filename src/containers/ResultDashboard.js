import React, { useRef, useState } from 'react'

export default function ResultDashboard() {

  const resultCodeQuestionnaire = useRef();

  var results = {
    "questionnaireCode" : "",
    "questionSubDimensions" : [],
    "scores" : []
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
        console.log(response)
        results.questionnaireCode = response.questionnaireCode
        results.questionSubDimensions = response.subDimensions
        results.scores = response.scores
        console.log(results)
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
    </div>
  )
}
