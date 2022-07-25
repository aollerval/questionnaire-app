import React from 'react'

export default function ({question}) {
  return (
    <li id={question.id}>
      {question.question}
    </li>
  )
}
