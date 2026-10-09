
import { useEffect, useState } from "react";

function App() {
  const challenges = [
    {
      id: 1,
      title: "Off-by-one Error",
      code: `#include <stdio.h>

int main() {

    for (int i = 0; i <= 5; i++) {
        printf("%d ", i);
    }

    return 0;
}`,
    },
    {
      id: 2,
      title: "Division by Zero",
      code: `#include <stdio.h>

int main() {

    int a = 10;
    int b = 0;

    printf("%d", a / b);

    return 0;
}`,
    },
  ];

  const [message, setMessage] = useState("");

  const [completedBugs, setCompletedBugs] = useState(() => {
    try {
      const savedBugs = localStorage.getItem("completedBugs");
      return savedBugs ? JSON.parse(savedBugs) : [];
    } catch {
      return [];
    }
  });

  const [currentBug, setCurrentBug] = useState(1);

  const [xp, setXp] = useState(() => {
    const savedXP = localStorage.getItem("buglabXP");
    return savedXP ? Number(savedXP) : 0;
  });

  const [code, setCode] = useState(challenges[0].code);

  // PROGRESS CALCULATIONS
  const totalBugs = challenges.length;
  const bugsFixed = completedBugs.length;
  const progress = Math.round((bugsFixed / totalBugs) * 100);

  // LOAD THE SELECTED CHALLENGE
  useEffect(() => {
    setCode(challenges[currentBug - 1].code);
    setMessage("");
  }, [currentBug]);

  // SAVE COMPLETED BUGS
  useEffect(() => {
    localStorage.setItem(
      "completedBugs",
      JSON.stringify(completedBugs)
    );
  }, [completedBugs]);

  function checkBug() {
    if (currentBug === 1) {
      return code.includes("i < 5");
    }

    if (currentBug === 2) {
      return !code.includes("int b = 0");
    }

    return false;
  }

  function runCode() {
    if (completedBugs.includes(currentBug)) {
      setMessage("✅ You already fixed this bug!");
      return;
    }

    if (checkBug()) {
      const points = currentBug === 1 ? 100 : 150;
      const newXP = xp + points;
      const newCompletedBugs = [...completedBugs, currentBug];

      setXp(newXP);
      localStorage.setItem("buglabXP", String(newXP));
      setCompletedBugs(newCompletedBugs);

      if (currentBug === 1) {
        setMessage("🎉 BUG #001 FIXED! +100 XP");
      } else {
        setMessage(
          "🎉 BUG #002 FIXED! You prevented division by zero! +150 XP"
        );
      }
    } else {
      if (currentBug === 1) {
        setMessage(
          "🚨 Bug still detected! Look at the loop condition."
        );
      } else if (currentBug === 2) {
        setMessage(
          "🚨 Bug still detected! Don't divide by zero."
        );
      }
    }
  }

  function getHint() {
    if (currentBug === 1) {
      setMessage(
        "💡 Hint: Look carefully at the condition inside the for loop."
      );
    } else if (currentBug === 2) {
      setMessage(
        "💡 Hint: Check the value of the divisor. Can you divide by zero?"
      );
    }
  }

  function nextBug() {
    if (currentBug < challenges.length) {
      setCurrentBug(currentBug + 1);
    } else {
      setMessage(
        "🏆 You've reached the end of the available bugs!"
      );
    }
  }

  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="logo">
          🐛 <span>BUGLAB</span> <b>AI</b>
        </div>

        <p className="tagline">
          Find the bug. Fix your future.
        </p>

        <div className="user-info">
          🔥 5 day streak&nbsp;&nbsp;&nbsp; 🏆 {xp} XP
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="menu active">
            🏠 Home
          </div>

          <div className="menu">
            💻 Challenges
          </div>

          <div className="menu">
            🤖 AI Detective
          </div>

          <div className="menu">
            🧬 Bug DNA
          </div>

          <div className="menu">
            ⚔️ Bug Battle
          </div>

          <div className="menu">
            📊 Progress
          </div>

          <div className="bug-message">
            🐛
            <br />
            <strong>Small bugs...</strong>
            <br />
            Big lessons!
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* WELCOME CARD */}
          <section className="welcome-card">
            <div>
              <p className="green-text">
                WELCOME,
              </p>

              <h1>
                DEBUGGER <span>›_</span>
              </h1>

              <p>
                Find the bug.
                <br />
                Fix the code.
                <br />
                Become a better programmer.
              </p>
            </div>

            <div className="mascot">
              🐛💻
            </div>
          </section>

          {/* PROGRESS DASHBOARD */}
          <section className="bug-card">
            <h2>📊 Your Progress</h2>

            <div className="progress-stats">
              <div>
                <h3>🏆 {xp} XP</h3>
                <p>Total Experience</p>
              </div>

              <div>
                <h3>
                  🐛 {bugsFixed} / {totalBugs}
                </h3>
                <p>Bugs Fixed</p>
              </div>

              <div>
                <h3>{progress}%</h3>
                <p>Completion</p>
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {/* BUG CARD */}
          <section className="bug-card">
            <div className="bug-header">
              <div>
 
             <h2>
              🐛 BUG #{String(currentBug).padStart(3, "0")} —{" "}
               {challenges[currentBug - 1].title}
               {completedBugs.includes(currentBug) ? " ✅ COMPLETED" : ""}
            </h2>

                <p>
                  Find the hidden bug:{" "}
                  {challenges[currentBug - 1].title}
                </p>
              </div>

              <div className="difficulty">
                {currentBug === 1
                  ? "⭐⭐☆☆☆"
                  : "⭐⭐⭐☆☆"}
              </div>
            </div>

            {/* CODE EDITOR */}
            <div className="code-window">
              <textarea
                className="code-editor"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value)
                }
                spellCheck={false}
              />
            </div>

            {/* BUTTONS */}
            <div className="buttons">
              <button
                className="run-button"
                onClick={runCode}
              >
                ▶ Run Code
              </button>

              <button
                className="hint-button"
                onClick={getHint}
              >
                💡 Get Hint
              </button>

              <button
                className="next-button"
                onClick={nextBug}
              >
                ➡️ Next Bug
              </button>
            </div>

            {/* RESULT MESSAGE */}
            {message && (
              <div className="result-box">
                {message}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;