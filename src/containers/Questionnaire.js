import React, { useEffect, useRef, useState } from 'react'
import Question from '../components/Question';

export default function Questionnaire() {
    const [qs, setQuestions] = useState([]);
    const [qc, setQuestionnaireCode] = useState("");
    // const [qa, setQuestionnaireAnswers] = useState([]);
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

    // useEffect(() => {
    //     const storedQuestionnaireAnswers = localStorage.getItem(LOCAL_STORAGE_KEY_AN)
    //     if(storedQuestionnaireAnswers) setQuestionnaireAnswers(storedQuestionnaireAnswers)
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_KEY_AN, JSON.stringify(qa))
    // }, [qa])
    
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_Q, JSON.stringify(qs))
        localStorage.setItem(LOCAL_STORAGE_KEY_QC, qc)
       
    },[qs], qc)

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

    var qa = {
        questionnaireCode : {qc},
        questions : [],
        answers : []
    }

    function handleAddAnswers(id){
        qa.answers.push(id)
        return qa
    }

    function handleEliminateAnswers(){
        
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
                        return <Question key = {question.id} question = {question} handleAddAnswers = {handleAddAnswers}/>
                    })
                }
            </ul>
        </div>
        <input type="submit" />
    </div>
  )
}
