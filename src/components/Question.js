import React from 'react'

export default function ({question, handleAddAnswers}) {

  const handleChecked = (e) => {
    if(e.target.checked){
      handleAddAnswers(e.target.value)
    }
    
  }

  return (
    <li id={question.id}>
      {question.question}
      {question.answers.map(answer => {
        return(
        <label>
          <br/>
          <input type="checkbox" id={answer.id} value = {answer.id} onChange = {handleChecked}/>
          {answer.answer}
        </label>)
      })}
      
    </li>
  )
}
