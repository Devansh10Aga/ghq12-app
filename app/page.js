"use client"
import { useState } from 'react';

const questions = [
  "Have you recently been able to concentrate on whatever you're doing?",
  "Have you recently lost much sleep over worry?",
  "Have you recently felt that you are playing a useful part in things?",
  "Have you recently felt capable of making decisions about things?",
  "Have you recently felt constantly under strain?",
  "Have you recently felt you couldn't overcome your difficulties?",
  "Have you recently been able to enjoy your normal day-to-day activities?",
  "Have you recently been able to face up to problems?",
  "Have you recently been feeling unhappy and depressed?",
  "Have you recently been losing confidence in yourself?",
  "Have you recently been thinking of yourself as a worthless person?",
  "Have you recently been feeling reasonably happy, all things considered?"
];

const options = [
  "Not at all",
  "No more than usual",
  "Rather more than usual",
  "Much more than usual"
];

export default function Home() {
  const [responses, setResponses] = useState(Array(12).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState({ score: 0, interpretation: '' });

  const handleOptionChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });
    const data = await response.json();
    setResult(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <h1>Your GHQ-12 Test Result</h1>
        <p>Your total score is: {result.score}</p>
        <p>Interpretation: {result.interpretation}</p>
        <button onClick={() => setSubmitted(false)}>Take the test again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>GHQ-12 Test</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="question" style={{ marginBottom: '20px' }}>
            <label>{index + 1}. {question}</label>
            <div className="options" style={{ marginLeft: '20px' }}>
              {options.map((option, optIndex) => (
                <label key={optIndex} style={{ display: 'block', marginBottom: '5px' }}>
                  <input
                    type="radio"
                    name={`response${index}`}
                    value={optIndex}
                    required
                    onChange={() => handleOptionChange(index, optIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}