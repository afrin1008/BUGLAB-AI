import { useEffect, useState } from "react";
import "./index.css";
const challenges = [
  {
    id: 1,
    title: "Off-by-one Error",
    difficulty: "Easy",
    xp: 100,
    description: "The loop prints one extra number. Fix the loop condition!",
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
    difficulty: "Easy",
    xp: 100,
    description: "The program divides by zero. Fix the divisor!",
    code: `#include <stdio.h>
int main() {
    int a = 10;
    int b = 0;
    printf("%d", a / b);
    return 0;
}`,
  },
  {
    id: 3,
    title: "Missing Return",
    difficulty: "Medium",
    xp: 150,
    description: "The function needs to return the number it creates.",
    code: `#include <stdio.h>
int getNumber() {
    int number = 10;
}
int main() {
    printf("%d", getNumber());
    return 0;
}`,
  },
{
  id: 4,
  title: "Incorrect Comparison",
  difficulty: "Easy",
  xp: 100,
  description: "The program should check whether a number is greater than 10, but the comparison is incorrect. Fix the condition!",
  code: `#include <stdio.h>
int main() {
    int number = 15;
    if (number < 10) {
        printf("Number is greater than 10");
    }
    return 0;
}`,
},
];
const errors = {
  1: "🚨 Not quite! Review the loop boundary and try again.",
  2: "🚨 Still a bug! Check whether the divisor is valid.",
  3: "🚨 Not fixed yet! Check that the function returns a value.",
};
function App() {
  const [currentBug, setCurrentBug] = useState(1);
  const [code, setCode] = useState(challenges[0].code);
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("Home");
  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem("buglabXP")) || 0;
  });
  const [completedBugs, setCompletedBugs] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("completedBugs") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
const [showCelebration, setShowCelebration] = useState(false);
  const challenge = challenges[currentBug - 1];
  const isCompleted = completedBugs.includes(currentBug);
  const progress = Math.round(
    (completedBugs.length / challenges.length) * 100
  );
  const level = Math.floor(xp / 250) + 1;
const rank =
  xp >= 500
    ? "Bug Hunter"
    : xp >= 250
      ? "Code Detective"
      : "Rookie Debugger";
useEffect(() => {
  setCode(challenges[currentBug - 1].code);
  setMessage("");
  setShowCelebration(false);
}, [currentBug]);
  useEffect(() => {
    localStorage.setItem("buglabXP", String(xp));
  }, [xp]);
  useEffect(() => {
    localStorage.setItem(
      "completedBugs",
      JSON.stringify(completedBugs)
    );
  }, [completedBugs]);
function checkBug() {
  if (currentBug === 1) {
    return /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*5\s*;/.test(code);
  }
  if (currentBug === 2) {
    const match = code.match(/\bint\s+b\s*=\s*(-?\d+)\s*;/);
    return Boolean(match && Number(match[1]) !== 0);
  }
  if (currentBug === 3) {
    const match = code.match(
      /int\s+getNumber\s*\(\s*\)\s*\{([\s\S]*?)\}/
    );
    if (!match) return false;
    return (
      /\bint\s+number\s*=\s*10\s*;/.test(match[1]) &&
      /\breturn\s+number\s*;/.test(match[1])
    );
  }
  if (currentBug === 4) {
    return /if\s*\(\s*number\s*>\s*10\s*\)/.test(code);
  }
  return false;
}
function runCode() {
  if (isCompleted) {
    setMessage(
      "✅ You already fixed this bug! Choose another challenge."
    );
    return;
  }
  if (!checkBug()) {
    const feedback = {
      1: "🐛 Almost! Check your loop condition. It may run one extra time.",
      2: "🐛 Not fixed yet! Check the divisor and make sure it isn't zero.",
      3: "🐛 Nearly there! Make sure your function returns the number.",
      4: "🐛 Not fixed yet! Check whether the comparison should use > or <.",
    };
    setMessage(feedback[currentBug] || errors[currentBug]);
    return;
  }
  const previousXP = xp;
  const newXP = previousXP + challenge.xp;
  const getRank = (points) =>
    points >= 500
      ? "Bug Hunter"
      : points >= 250
        ? "Code Detective"
        : "Rookie Debugger";
  const oldRank = getRank(previousXP);
  const newRank = getRank(newXP);
  setXp(newXP);
  setShowCelebration(true);
  setCompletedBugs((previous) =>
    previous.includes(currentBug)
      ? previous
      : [...previous, currentBug]
  );
  if (oldRank !== newRank) {
    setMessage(
      `🎉 BUG FIXED! +${challenge.xp} XP — RANK UP! 🏆 You're now a ${newRank}!`
    );
  } else {
    setMessage(
      `🎉 BUG #${String(currentBug).padStart(3, "0")} FIXED! You solved ${challenge.title}! +${challenge.xp} XP`
    );
  }
}
function getHint() {
  const hints = {
    1: "💡 Check the loop condition. Should it run 5 times or 6 times?",
    2: "💡 Look at the value of b. What happens when you divide by zero?",
    3: "💡 The function creates a number, but does it send that number back?",
    4: "💡 The number is 15. Should you check whether it is greater than or less than 10?"
  };
  setMessage(hints[currentBug] || "💡 Inspect the code carefully!");
}
function goToPage(page) {
  setActivePage(page);
  setMessage("");
  if (page === "Home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const targets = {
    Challenges: ".challenges-section",
    "AI Detectives": ".editor-panel",
    "Bug Battle": ".editor-panel",
    "Bug DNA": ".rank-panel",
    Progress: ".progress-panel",
  };
  if (page === "AI Detectives") {
    setMessage("🕵️ AI Detectives — coming soon!");
  } else if (page === "Bug Battle") {
    setMessage("⚔️ Bug Battle — coming soon!");
  } else if (page === "Bug DNA") {
    setMessage("🧬 Bug DNA — coming soon!");
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = document.querySelector(targets[page]);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
  function nextBug() {
    if (currentBug < challenges.length) {
      setCurrentBug((previous) => previous + 1);
    } else {
      setMessage(
        "🏆 You've reached the final challenge! Keep practicing to master debugging."
      );
    }
  }
  function resetProgress() {
    if (!window.confirm("Reset all BUGLAB progress and XP?")) return;
    setXp(0);
    setCompletedBugs([]);
    setMessage("");
    setCode(challenges[currentBug - 1].code);
    localStorage.removeItem("buglabXP");
    localStorage.removeItem("completedBugs");
  }

   return (
       <div className="app">
    <aside className="sidebar">
      <p className="menu-label">WORKSPACE</p>

      {[
        "Home",
        "Challenges",
        "AI Detectives",
        "Bug Battle",
        "Bug DNA",
        "Progress",
      ].map((page) => (
        <button
          key={page}
          className={`nav-item ${activePage === page ? "active" : ""}`}
          onClick={() => goToPage(page)}
        >
          {page === "Home"
            ? "⌂"
            : page === "Challenges"
              ? "⚗"
              : page === "AI Detectives"
                ? "🕵️"
                : page === "Bug Battle"
                  ? "⚔️"
                  : page === "Bug DNA"
                    ? "🧬"
                    : "📊"}{" "}
          {page}
        </button>
      ))}
    </aside>

    {/* Keep the rest of your existing page content here */}


        <div className="sidebar-bottom">

      <div className="sidebar-bottom">
        <p className="menu-label">YOUR STATS</p>
        <div className="stat-row">
          <span>Total XP</span>
          <strong>{xp}</strong>
        </div>
        <div className="stat-row">
          <span>Bugs Fixed</span>
          <strong>{completedBugs.length}/{challenges.length}</strong>
        </div>
        <button className="reset-button" onClick={resetProgress}>
          ↻ Reset Progress
        </button>
      </div>
    </div>
      <main className="main-content">
        <header className="topbar">
          <div className="brand-heading">
            <div className="brand-logo">
              <span className="brand-worm">🐛</span>
              <h2>BUGLAB AI</h2>
            </div>
            <p className="brand-tagline">
              FIND THE BUG <span>→</span> FIX IT <span>→</span> LEARN IT
            </p>
          </div>
          <div className="header-stats">
            <div className="header-stat streak-stat">
              <span>🔥</span>
              <div>
                <small>STREAK</small>
                <strong>1 DAY</strong>
              </div>
            </div>
            <div className="header-stat xp-stat">
              <span>⚡</span>
              <div>
                <small>TOTAL XP</small>
                <strong>{xp} XP</strong>
              </div>
            </div>
          </div>
        </header>
<section className="welcome-panel">
  <div className="welcome-content">
    <div className="system-status">
      <span className="status-dot"></span>
      SYSTEM ONLINE
    </div>
</div>
    <h2>
      Welcome to the <span>Lab.</span>
    </h2>
    <p className="welcome-description">
      Every bug tells a story. Find the problem, repair the code,
      and prove your debugging skills.
    </p>
<div className="welcome-stats">
  <div className="welcome-stat">
    <strong>{completedBugs.length}</strong>
    <span>Bugs Fixed</span>
  </div>
  <div className="welcome-stat">
    <strong>{challenges.length - completedBugs.length}</strong>
    <span>Remaining</span>
  </div>
  <div className="welcome-stat">
    <strong>{progress}%</strong>
    <span>Completion</span>
  </div>
</div>
  <div className="welcome-mascot" aria-label="Glowing green bug">
    <span className="mascot-aura"></span>
    <span className="mascot-worm">🐛</span>
    <span className="mascot-label">BUG ENTITY_001</span>
  </div>
</section>
<section className="dashboard-grid">
  <div className="panel progress-panel">
    <div className="section-heading">
      <div>
        <p className="eyebrow">YOUR JOURNEY</p>
        <h2>Lab Progress</h2>
      </div>
      <span className="panel-icon">📈</span>
    </div>
    <div className="progress-numbers">
      <strong>{progress}%</strong>
      <span>
        {completedBugs.length} of {challenges.length} challenges
      </span>
    </div>
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <p className="muted-text">
      {progress === 100
        ? "Amazing! Every challenge is complete."
        : "Keep going! Every fixed bug earns XP."}
    </p>
    <div className="xp-summary">
      <span>⚡ Total Experience</span>
      <strong>{xp} XP</strong>
    </div>
  </div>
  <div className="panel rank-panel">
    <div className="section-heading">
      <div>
        <p className="eyebrow">CURRENT STATUS</p>
        <h2>Your Rank</h2>
      </div>
      <span className="panel-icon">🏆</span>
    </div>
    <div className="rank-display">
      <span className="rank-symbol">✦</span>
      <div>
        <h3>{rank}</h3>
        <p>Level {level} debugger</p>
      </div>
    </div>
    <p className="muted-text">
      Earn XP by fixing bugs to unlock higher ranks.
    </p>
  </div>
</section>
        <section className="challenges-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SELECT YOUR TARGET</p>
              <h2>Bug Challenges</h2>
            </div>
            <span className="challenge-count">
              {challenges.length} MISSIONS
            </span>
          </div>
          <div className="challenge-list">
            {challenges.map((item) => (
              <button
                key={item.id}
                className={`challenge-card ${
                  currentBug === item.id ? "selected" : ""
                }`}
                onClick={() => {
                  setCurrentBug(item.id);
                  setActivePage("Challenges");
                }}
              >
                <span className="challenge-number">
                  {String(item.id).padStart(3, "0")}
                </span>
                <span className="challenge-info">
                  <strong>{item.title}</strong>
                  <small>{item.difficulty} · {item.xp} XP</small>
                </span>
                <span className="challenge-status">
                  {completedBugs.includes(item.id)
                    ? "✓ FIXED"
                    : currentBug === item.id
                    ? "● ACTIVE"
                    : "AVAILABLE"}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="editor-panel">
          <div className="editor-header">
            <div>
              <p className="eyebrow">
                ACTIVE MISSION · BUG #{String(currentBug).padStart(3, "0")}
              </p>
              <h2>{challenge.title}</h2>
            </div>
            <span className="difficulty-badge">
              {challenge.difficulty}
            </span>
          </div>
          <p className="challenge-description">
            {challenge.description}
          </p>
          <div className="code-window">
            <div className="code-titlebar">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>main.c</span>
              <span className="language-label">C</span>
            </div>
            <div className="code-editor-wrapper">
              <div className="line-numbers" aria-hidden="true">
                {code.split("\n").map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
              <textarea
                className="code-editor"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setMessage("");
                }}
                spellCheck="false"
                aria-label="Editable C code"
              />
            </div>
          </div>
          <div className="editor-actions">
            <button className="run-button" onClick={runCode}>
              ▶ Run Code
            </button>
            <button className="hint-button" onClick={getHint}>
              ✦ Get Hint
            </button>
          </div>
<button
  className="hint-button"
  onClick={() => {
    setCode(challenges[currentBug - 1].code);
    setMessage("");
    setShowCelebration(false);
  }}
>
  🔄 Restart Challenge
</button>
            <span className="editor-xp"></span>
<button
  className="next-button"
  onClick={nextBug}
  disabled={!isCompleted || currentBug === challenges.length}
>
  {currentBug === challenges.length
    ? "Final Bug 🏆"
    : isCompleted
      ? "Next Bug →"
      : "🔒 Fix Bug First"}
</button>

{message && (
  <div
    className={`feedback ${
      message.includes("FIXED") ||
      message.includes("💡") ||
      message.includes("🏆") ||
      message.includes("coming soon") ||
      message.includes("already fixed")
        ? "feedback-success"
        : "feedback-error"
    }`}
    role="status"
  >
    {message}
  </div>
)}

{showCelebration && (
  <div className="celebration-popup" role="status">
    <span className="celebration-emoji">🎉</span>
    <h2>BUG FIXED!</h2>
    <p>Amazing work, Debugger!</p>
    <p>
      You solved {challenge.title} and earned +{challenge.xp} XP! ⚡
    </p>
    <button
      onClick={() => {
        setShowCelebration(false);
        nextBug();
      }}
    >
      Continue to Next Challenge →
    </button>
  </div>
)}
          <p className="editor-note">
            Note: This version checks your fixes using JavaScript patterns.
            It does not compile or execute C code.
          </p>
        <footer className="footer">
          <span>🐛 BUGLAB AI</span>
          <span>Built for future debugging legends.</span>
        </footer>
       </section>
      </main>
    </div>
  );
}
export default App;