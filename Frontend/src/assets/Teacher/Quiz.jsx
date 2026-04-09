import React, { useState } from "react";
import axios from "axios";

function Quiz() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("CS101");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("teacherToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= HANDLE QUESTION =================
  const handleQuestionChange = (i, field, value) => {
    const newQ = [...questions];
    newQ[i][field] = value;
    setQuestions(newQ);
  };

  // ================= HANDLE OPTIONS =================
  const handleOptionChange = (qi, oi, value) => {
    const newQ = [...questions];
    newQ[qi].options[oi] = value;
    setQuestions(newQ);
  };

  // ================= ADD QUESTION =================
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  // ================= REMOVE QUESTION =================
  const removeQuestion = (i) => {
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!title) return alert("Enter quiz title");

    axios
      .post(
        `${API}/teacher/quiz`,
        {
          title,
          course_code: course,
          questions,
        },
        headers
      )
      .then(() => {
        alert("Quiz Created");

        // reset
        setTitle("");
        setQuestions([
          { question: "", options: ["", "", "", ""], answer: "" },
        ]);
      })
      .catch(() => alert("Error creating quiz"));
  };

  return (
    <div>
      <h3>Create Quiz</h3>

      {/* TITLE */}
      <input
        className="form-control mb-2"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* COURSE */}
      <select
        className="form-control mb-3"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      >
        <option value="CS101">CS101</option>
        <option value="CS102">CS102</option>
      </select>

      {/* QUESTIONS */}
      {questions.map((q, qi) => (
        <div key={qi} className="card p-3 mb-3">

          <input
            className="form-control mb-2"
            placeholder="Question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(qi, "question", e.target.value)
            }
          />

          {/* OPTIONS */}
          {q.options.map((opt, oi) => (
            <input
              key={oi}
              className="form-control mb-1"
              placeholder={`Option ${oi + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(qi, oi, e.target.value)
              }
            />
          ))}

          {/* ANSWER */}
          <input
            className="form-control mt-2"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) =>
              handleQuestionChange(qi, "answer", e.target.value)
            }
          />

          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => removeQuestion(qi)}
          >
            Remove Question
          </button>

        </div>
      ))}

      {/* ACTIONS */}
      <button className="btn btn-secondary me-2" onClick={addQuestion}>
        Add Question
      </button>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Quiz
      </button>
    </div>
  );
}

export default Quiz;