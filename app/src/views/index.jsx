import React, { useState } from 'react';

export default function Index() {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(0);
  
  const quizData = [
    {
      question: "Kas ir primārā atslēga?",
      options: [
        "Atribūts, kas identificē tabulas datus un to attiecības",
        "Atribūts, kas piešķir tabulas datiem valstisku identifikatoru",
        "Atribūts, kas atļauj piekļuvi tabulas datiem no ārējām programmām",
        "Atribūts, kas nosaka tabulas galveno indeksu"
      ],
      answer: "a"
    },
    {
      question: "Kas ir SWOT analīze?",
      options: [
        "Analīzes metode, kas koncentrējas uz spēcīgo un vājo pušu noteikšanu",
        "Analīzes metode, kas pēta uzņēmuma darba vides ietekmi",
        "Analīzes metode, kas pēta uzņēmuma finanšu stāvokli",
        "Analīzes metode, kas koncentrējas uz uzņēmuma tehnoloģisko attīstību"
      ],
      answer: "a"
    },
    {
      question: "Kas ir klase?",
      options: [
        "Objekts, kas satur metodes un īpašības",
        "Lietojumprogrammas koda fragments, kas atbild par specifisku uzdevumu",
        "Vispārējs termins, kas apzīmē jebkādu koda fragmentu",
        "Datu struktūra, kas satur ar funkciju saistītus datus"
      ],
      answer: "a"
    },
    {
      question: "Kas ir REST?",
      options: [
        "Metodoloģija, kas nosaka kā izveidot datubāzes pieprasījumus",
        "Standarts, kas noteic, kā iekļaut datu fragmentus datubāzē",
        "Protokols, kas nosaka kā pārsūtīt datu paketes starp serveri un klientu",
        "Arhitektūras stils, kas nodrošina resursu pieejamību tīklā"
      ],
      answer: "c"
    },
    {
      question: "Kādi ir divi galvenie tīkla tipi?",
      options: [
        "LAN un WAN",
        "TCP un IP",
        "HTTP un FTP",
        "HTML un CSS"
      ],
      answer: "a"
    }
  ];

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleOptionChange = (questionIndex, selectedOption) => {
    const correctAnswer = quizData[questionIndex].answer;
    if (selectedOption === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleSubmitQuiz = async (event) => {
    event.preventDefault();
    const percent = ((score / quizData.length) * 100).toFixed(2);

    try {
      const response = await fetch('http://localhost:3004/quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          score: percent,
          date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add quiz results');
      }

      setUsername('');
      setScore(0);

      alert(`${username}, you scored ${percent}%! Quiz results added successfully.`);
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className='background'>
        <h1>Programmēšanas Quiz</h1>
      </div>
      <div className='background'>
        <form onSubmit={handleSubmitQuiz}>
          <div className='field'>
            <h2>Ievadi savu lietotājvārdu:</h2>
            <input type="text" placeholder="Name" value={username} onChange={handleUsernameChange} required/>
          </div>

          {quizData.map((question, index) => (
            <div key={index} className='field'>
              <h2>{question.question}</h2>
              <div>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <input
                      type="radio"
                      name={`question${index}`}
                      value={String.fromCharCode(97 + optionIndex)}
                      onChange={() => handleOptionChange(index, String.fromCharCode(97 + optionIndex))}
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className='button_field'>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}