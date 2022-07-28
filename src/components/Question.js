import React from 'react'

export default function ({question, handleAddAnswers, handleEliminateAnswer}) {

  const handleChecked = (e) => {
    if(e.target.checked){
      handleAddAnswers(e.target.value, question.id)
    }else{
      handleEliminateAnswer(e.target.value, question.id)
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
