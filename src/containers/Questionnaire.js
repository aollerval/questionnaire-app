import React, { useEffect, useRef, useState } from 'react'
import Question from '../components/Question';
import {v4 as uuid} from 'uuid'

export default function Questionnaire() {
    const [qs, setQuestions] = useState([]);
    const [qc, setQuestionnaireCode] = useState("");
    const questionnaireRef = useRef()

    const LOCAL_STORAGE_KEY_Q = "questions"
    const LOCAL_STORAGE_KEY_QC = "questionnaireCode"
    const LOCAL_STORAGE_KEY_AN = "questionAnswers"

    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_Q))
        if(storedQuestions) setQuestions(storedQuestions)

        const storedQuestionnaireCode = localStorage.getItem(LOCAL_STORAGE_KEY_QC)
        if(storedQuestionnaireCode) setQuestionnaireCode(storedQuestionnaireCode)
    },[], "")
    
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_Q, JSON.stringify(qs))
        localStorage.setItem(LOCAL_STORAGE_KEY_QC, qc)
       
    },[qs, qc])

    //Get questionnaire from backend
    function fetchQuestionnaire(){
        const questionnaireCode = questionnaireRef.current.value
        const url = `http://localhost:8080/api/v1/questionnaire/${questionnaireCode}`
        fetch(url , {
            method : 'GET',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json',
                'accept' : '*/*'
            }
        })
        .then(response => response.json())
        .then(questionnaire => {
            var a = []
            for(var i = 0; i < questionnaire.questions.length; i++){
                a.push({id: questionnaire.questions[i].questionCode, question: questionnaire.questions[i].question, answers: questionnaire.questions[i].answers})
            }
            setQuestions(prevQuestions => {
                var final = prevQuestions.concat(a)
                return final
            })
            setQuestionnaireCode(() => {
                return questionnaire.questionnaireCode
            })
        })
        questionnaireRef.current.value = null
    }

    //Send selected answers to backend for storage
    function sendQuestionnaireResults(){
        const url = `http://localhost:8080/api/v1/result/`
        fetch(url , {
            method : 'POST',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json',
                'accept' : '*/*'
            },
            body:JSON.stringify({
                'resultCode' : uuid(),
                'questionnaireCode' : qc,
                'questionCodes' : qa.questions,
                'answers' : qa.answers
            })
        })

        //Vaciar local storage, eliminar qa, qc y qs.  Resetear el estado
    }

    //Estado de la respuesta para enviar resultados del cuestionario
    var qa = {
        questionnaireCode : qc,
        questions : [],
        answers : []
    }

    function handleAddAnswers(a_id, q_id){
        qa.answers.push(a_id)
        qa.questions.push(q_id)
        return qa
    }

    function handleEliminateAnswers(a_id, q_id){
        var filteredAnswers = qa.answers.filter(function(value){
            return value !== a_id
        })
        
        var filteredQuestions = qa.questions.filter(function(value){
            return value !== q_id //Tengo que agregar que solo se pueda responder 1 con uno de los checkboxes
        })

        qa.answers = filteredAnswers
        qa.questions = filteredQuestions
    }
  
    return (
    <div className='QuestionnaireContainer'>
        <h2>Questionnaire</h2>

        <div className='questionnaireFetcher'>
            <input type="text" ref={questionnaireRef}/> 
            <input type="submit" onClick={fetchQuestionnaire}/> 
        </div>

        <div className={qc}>
            <ul>
                {
                    qs.map(question => {
                        return <Question key = {question.id} question = {question} handleAddAnswers = {handleAddAnswers} handleEliminateAnswer = {handleEliminateAnswers}/>
                    })
                }
            </ul>
        </div>
        <input type="submit" onClick={sendQuestionnaireResults}/>
    </div>
  )
}
