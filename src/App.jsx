import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState(`#include <stdio.h>

int main() {

    int arr[5] = {1, 2, 3, 4, 5};

    for(int i = 0; i <= 5; i++) {
        printf("%d ", arr[i]);
    }

    return 0;
}`);

  function runCode() {
    setMessage(
      "🚨 Bug detected! The loop is running one time too many."
    );
  }

  function getHint() {
    setMessage(
      "💡 Hint: Look carefully at the condition inside the for loop."
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          🐛 <span>BUGLAB</span> <b>AI</b>
        </div>

        <p className="tagline">Find the bug. Fix your future.</p>

        <div className="user-info">
          🔥 5 day streak &nbsp;&nbsp; 🏆 240 XP &nbsp;&nbsp; 👤
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="menu active">🏠 Home</div>
          <div className="menu">💻 Challenges</div>
          <div className="menu">🤖 AI Detective</div>
          <div className="menu">🧬 Bug DNA</div>
          <div className="menu">⚔️ Bug Battle</div>
          <div className="menu">📊 Progress</div>

          <div className="bug-message">
            🐛
            <br />
            <strong>Small bugs...</strong>
            <br />
            Big lessons!
          </div>
        </aside>

        <main className="main-content">

          <section className="welcome-card">
            <div>
              <p className="green-text">WELCOME,</p>

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

            <div className="mascot">🐛💻</div>
          </section>

          <section className="bug-card">

            <div className="bug-header">
              <div>
                <h2>🐛 BUG #001</h2>
                <p>Find the hidden bug in the code below.</p>
              </div>

              <div className="difficulty">
                ⭐⭐☆☆☆
              </div>
            </div>

            <div className="code-window">
  <textarea
    className="code-editor"
    value={code}
    onChange={(event) => setCode(event.target.value)}
  />
</div>

            <div className="buttons">
              <button className="run-button" onClick={runCode}>
                ▶ Run Code
              </button>

              <button className="hint-button" onClick={getHint}>
                💡 Get Hint
              </button>
            </div>

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