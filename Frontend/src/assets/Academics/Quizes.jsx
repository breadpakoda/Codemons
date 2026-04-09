import React, { useEffect, useState } from "react";
import axios from "axios";

function Quizes() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000";

  /* ───────── FETCH COURSES ───────── */
  useEffect(() => {
    axios
      .get(`${API}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data.courses));
  }, []);

  /* ───────── OPEN QUIZ ───────── */
  async function openQuiz(course_code) {
    try {
      // check if already attempted
      const check = await axios.get(`${API}/quiz/check/${course_code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (check.data.attempted) {
        setAttempted(true);
        setResult(check.data.result);
        setSelected(course_code);
        return;
      }

      // fetch quiz
      const res = await axios.get(`${API}/quiz/${course_code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuiz(res.data.quiz);
      setSelected(course_code);
      setAnswers({});
      setResult(null);
      setAttempted(false);
    } catch (err) {
      console.log(err);
    }
  }

  function closeQuiz() {
    setSelected(null);
    setQuiz(null);
    setResult(null);
  }

  /* ───────── SELECT ANSWER ───────── */
  function handleSelect(index, option) {
    setAnswers({ ...answers, [index]: option });
  }

  /* ───────── SUBMIT QUIZ ───────── */
  function submitQuiz() {
    axios
      .post(
        `${API}/quiz/submit/${selected}`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setResult(res.data);
        setAttempted(true);
      })
      .catch(() => alert("Error submitting quiz"));
  }

  return (
    <div>
      <h2 className="mb-4">Quizzes</h2>

      {/* COURSE LIST */}
      <div className="card p-3">
        <table className="table">
          <tbody>
            {courses.map((c) => (
              <tr
                key={c.course_code}
                style={{ cursor: "pointer" }}
                onClick={() => openQuiz(c.course_code)}
              >
                <td>{c.course_name} Quiz</td>
                <td>{c.faculty_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FULL SCREEN QUIZ */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
            zIndex: 9999,
            overflowY: "auto",
            padding: "30px",
          }}
        >
          <button className="btn btn-danger mb-3" onClick={closeQuiz}>
            Close
          </button>

          {/* ALREADY ATTEMPTED */}
          {attempted && result ? (
            <div className="text-center mt-5">
              <h2>Quiz Completed</h2>
              <h3>
                Score: {result.marks} / {result.total}
              </h3>
            </div>
          ) : (
            <>
              <h2>{quiz?.title}</h2>

              {quiz?.questions.map((q, i) => (
                <div key={i} className="mb-4">
                  <h5>
                    {i + 1}. {q.question}
                  </h5>

                  {q.options.map((opt, idx) => (
                    <div key={idx}>
                      <input
                        type="radio"
                        name={`q${i}`}
                        onChange={() => handleSelect(i, opt)}
                      />{" "}
                      {opt}
                    </div>
                  ))}
                </div>
              ))}

              <button className="btn btn-primary w-100" onClick={submitQuiz}>
                Submit Quiz
              </button>

              {result && (
                <div className="text-center mt-3">
                  <strong>
                    Score: {result.marks} / {result.total}
                  </strong>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Quizes;