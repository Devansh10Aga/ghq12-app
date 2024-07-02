"use client";
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Chart from '@/components/lineChart';

const questions = [
  "Have you recently been able to concentrate on whatever you're doing?",
  "Have you recently lost much sleep over worry?",
  "Have you recently felt that you were playing a useful part in things?",
  "Have you recently felt capable of making decisions about things?",
  "Have you recently felt constantly under strain?",
  "Have you recently felt you couldn't overcome your difficulties?",
  "Have you recently been able to enjoy your normal day-to-day activities?",
  "Have you recently been able to face up to problems?",
  "Have you recently been feeling unhappy or depressed?",
  "Have you recently been losing confidence in yourself?",
  "Have you recently been thinking of yourself as a worthless person?",
  "Have you recently been feeling reasonably happy, all things considered?"
];

const options = [
  ["Better than usual", "Same as usual", "Less than usual", "Much less than usual"],
  ["Not at all", "No more than usual", "Rather more than usual", "Much more than usual"],
  ["More so than usual", "Same as usual", "Less so than usual", "Much less than usual"],
  ["More so than usual", "Same as usual", "Less so than usual", "Much less capable"],
  ["Not at all", "No more than usual", "Rather more than usual", "Much more than usual"],
  ["Not at all", "No more than usual", "Rather more than usual", "Much more than usual"],
  ["More so than usual", "Same as usual", "Less so than usual", "Much less than usual"],
  ["More so than usual", "Same as usual", "Less able than usual", "Much less able"],
  ["Not at all", "No more than usual", "Rather more than usual", "Much more than usual"],
  ["Not at all", "No more than usual", "Rather more than usual", "Much more than usual"],
  ["Not at all", "No more than usual", "Rather more than usual", "Much more than usual"],
  ["More so than usual", "About the same as usual", "Less so than usual", "Much less than usual"]
];

export default function Home() {
  const {user} = useUser();
  const [responses, setResponses] = useState(Array(12).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState({ score: 0, interpretation: '', previousResults: [] });

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
      body: JSON.stringify({ responses, id: user.id }), // Replace with actual user ID
    });
    const data = await response.json();
    setResult(data);
    setSubmitted(true);
  };

  const handleReset = () => {
    setResponses(Array(12).fill(null));
    setSubmitted(false);
    setResult({ score: 0, interpretation: '', previousResults: [] });

    // Clear the radio buttons
    document.querySelectorAll('input[type=radio]').forEach((radio) => {
      radio.checked = false;
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your GHQ-12 Test Result</h1>
        <p className="mb-2">Your total score is: {result.score}</p>
        <p className="mb-4">Interpretation: {result.interpretation}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setSubmitted(false)}
        >
          Take the test again
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleReset}
        >
          Reset
        </button>

        <Chart/>

        {result.previousResults.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Previous Test Results</h2>
            <ul>
              {result.previousResults.map((res, index) => (
                <li key={index} className="mb-2">
                  <p>Date: {new Date(res.date).toLocaleDateString()}</p>
                  <p>Score: {res.score}</p>
                  <p>Interpretation: {res.interpretation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">GHQ-12 Test</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="mb-6">
            <label className="block text-lg mb-2">{index + 1}. {question}</label>
            <div className="ml-2 sm:ml-6">
              {options[index].map((option, optIndex) => (
                <label key={optIndex} className="block mb-2">
                  <input
                    type="radio"
                    name={`response${index}`}
                    value={optIndex}
                    required
                    onChange={() => handleOptionChange(index, optIndex)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-2 sm:mb-0">
            Submit
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
