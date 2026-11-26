
/* SKY CARGO - DELIVERY CHECK DESIGN */

/*
  This file improves the existing quiz interface.
  It does not change delivery rules or flight calculations.
*/

function initializeQuizDesign() {
    const style = document.createElement("style");

    style.textContent = `
        /* QUIZ BACKDROP */
        #quiz-overlay {
            background: rgba(8, 20, 37, 0.82);
            backdrop-filter: blur(7px);
            -webkit-backdrop-filter: blur(7px);
        }

        /* MAIN QUIZ CARD */
        #quiz-card {
            max-width: 510px;
            padding: 30px;
            border-radius: 24px;
            background: linear-gradient(
                160deg,
                #ffffff 0%,
                #f3f8ff 100%
            );
            border: 1px solid #dbeafe;
            box-shadow:
                0 30px 80px rgba(0, 0, 0, 0.35);
            animation: quizEnter 0.3s ease-out;
        }

        #quiz-title {
            font-size: 25px;
            font-weight: 800;
            color: #122945;
            margin: 0 0 8px;
        }

        #quiz-title::before {
            content: "🛃 ";
        }

        #quiz-destination {
            display: inline-block;
            padding: 7px 13px;
            background: #dbeafe;
            color: #1d4ed8;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 700;
            margin: 8px 0 18px;
        }

        #quiz-question {
            color: #172b4d;
            font-size: 18px;
            font-weight: 750;
            line-height: 1.55;
            margin-bottom: 20px;
        }

        #quiz-options {
            display: grid;
            gap: 10px;
        }

        #quiz-card .quiz-option {
            width: 100%;
            margin: 0;
            min-height: 52px;
            padding: 13px 15px;
            border: 1.5px solid #d8e3ef;
            border-radius: 13px;
            background: #ffffff;
            color: #24364d;
            font-size: 14px;
            font-weight: 650;
            text-align: left;
            line-height: 1.45;
            cursor: pointer;
            transition:
                transform 0.18s,
                border-color 0.18s,
                background 0.18s;
        }

        #quiz-card .quiz-option:hover:not(:disabled) {
            background: #eff6ff;
            border-color: #60a5fa;
            transform: translateX(3px);
        }

        #quiz-card .quiz-option:focus-visible {
            outline: 3px solid #93c5fd;
            outline-offset: 2px;
        }

        #quiz-card .quiz-option:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        #quiz-card #quiz-hint {
            display: block;
            width: 100%;
            margin-top: 19px;
            padding: 13px 16px;
            border: 0;
            border-radius: 12px;
            background: #fff0cc;
            color: #92400e;
            font-weight: 750;
            cursor: pointer;
            transition: background 0.2s;
        }

        #quiz-card #quiz-hint:hover:not(:disabled) {
            background: #fde68a;
        }

        #quiz-card #quiz-hint:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        #quiz-feedback {
            color: #b45309;
            font-size: 13px;
        }

        /* ANSWER RESULT OVERLAY */
        #quiz-result {
            position: fixed;
            inset: 0;
            z-index: 5000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(8, 20, 37, 0.78);
            backdrop-filter: blur(8px);
        }

        #quiz-result.open {
            display: flex;
        }

        .result-card {
            width: 100%;
            max-width: 420px;
            padding: 32px 27px;
            border-radius: 25px;
            background: #ffffff;
            text-align: center;
            box-shadow:
                0 30px 90px rgba(0, 0, 0, 0.4);
            animation: quizEnter 0.3s ease-out;
        }

        .result-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 78px;
            height: 78px;
            margin: 0 auto 18px;
            border-radius: 50%;
            font-size: 39px;
        }

        .result-card.success .result-icon {
            background: #dcfce7;
            color: #15803d;
        }

        .result-card.failure .result-icon {
            background: #fee2e2;
            color: #dc2626;
        }

        .result-label {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .result-card.success .result-label {
            color: #15803d;
            background: #dcfce7;
        }

        .result-card.failure .result-label {
            color: #b91c1c;
            background: #fee2e2;
        }

        .result-title {
            font-size: 25px;
            font-weight: 800;
            color: #142c49;
            margin: 16px 0 8px;
        }

        .result-description {
            font-size: 14px;
            line-height: 1.65;
            color: #64748b;
        }

        .result-rewards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 24px 0;
        }

        .reward-box {
            padding: 16px 8px;
            border-radius: 15px;
            background: #f1f5f9;
        }

        .reward-number {
            font-size: 25px;
            font-weight: 800;
            color: #12355b;
        }

        .reward-caption {
            font-size: 12px;
            color: #64748b;
            margin-top: 5px;
        }

        .result-penalty {
            margin: 22px 0;
            padding: 19px;
            background: #fef2f2;
            border-radius: 16px;
            color: #b91c1c;
            font-size: 25px;
            font-weight: 800;
        }

        #result-continue {
            width: 100%;
            padding: 15px 20px;
            border: none;
            border-radius: 13px;
            font-size: 14px;
            font-weight: 800;
            color: white;
            background: #2563eb;
            cursor: pointer;
            transition: transform 0.15s;
        }

        #result-continue:hover {
            transform: translateY(-2px);
        }

        .result-card.failure #result-continue {
            background: #dc2626;
        }

        @keyframes quizEnter {
            from {
                opacity: 0;
                transform: translateY(18px) scale(0.97);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @media (max-width: 520px) {
            #quiz-card {
                padding: 22px;
            }

            .result-card {
                padding: 25px 20px;
            }

            #quiz-title,
            .result-title {
                font-size: 22px;
            }
        }
    `;

    document.head.appendChild(style);

    // Separate result screen
    const result = document.createElement("div");
    result.id = "quiz-result";

    result.innerHTML = `
        <div class="result-card" id="result-card"
             role="dialog"
             aria-modal="true"
             aria-labelledby="result-title">

            <div class="result-icon"
                 id="result-icon"></div>

            <span class="result-label"
                  id="result-label"></span>

            <h2 class="result-title"
                id="result-title"></h2>

            <p class="result-description"
               id="result-description"></p>

            <div id="result-details"></div>

            <button id="result-continue" type="button">
                Continue
            </button>
        </div>
    `;

    document.body.appendChild(result);

    document.getElementById("result-continue")
        .addEventListener("click", hideQuizResult);

    // This lets existing quiz answer buttons use
    // the new result screens without changing game.js.
    const originalSubmitAnswer = submitAnswer;

    submitAnswer = function(selectedIndex) {
        if (
            !game.started ||
            game.finished ||
            !game.checking ||
            !currentQuestion
        ) {
            return;
        }

        const correct =
            selectedIndex === currentQuestion.answer;

        const previousCoins = game.coins;
        const previousScore = game.score;

        originalSubmitAnswer(selectedIndex);

        if (correct) {
            const gainedCoins = game.coins - previousCoins;
            const gainedPoints = game.score - previousScore;

            showQuizResult({
                correct: true,
                coins: gainedCoins,
                points: gainedPoints,
                levelCompleted: game.finished
            });
        } else if (!game.finished) {
            showQuizResult({
                correct: false
            });
        }
    };

    // Close any open answer screen when time runs out.
    const originalFinishGame = finishGame;

    finishGame = function(won) {
        originalFinishGame(won);

        if (!won) {
            hideQuizResult();
        }
    };

    console.log("Sky Cargo quiz design ready!");
}

// Display success or failure
function showQuizResult(data) {
    const overlay =
        document.getElementById("quiz-result");

    const card =
        document.getElementById("result-card");

    const icon =
        document.getElementById("result-icon");

    const label =
        document.getElementById("result-label");

    const title =
        document.getElementById("result-title");

    const description =
        document.getElementById("result-description");

    const details =
        document.getElementById("result-details");

    const button =
        document.getElementById("result-continue");

    details.innerHTML = "";

    if (data.correct) {
        card.className = "result-card success";

        icon.textContent = "✓";
        label.textContent = "Verification Successful";
        title.textContent = "Delivery Approved!";

        description.textContent =
            "Correct answer! Your cargo has been " +
            "delivered successfully.";

        const rewards =
            document.createElement("div");

        rewards.className = "result-rewards";

        rewards.innerHTML = `
            <div class="reward-box">
                <div class="reward-number">
                    +${data.coins} 🪙
                </div>
                <div class="reward-caption">
                    Delivery Coins
                </div>
            </div>

            <div class="reward-box">
                <div class="reward-number">
                    +${data.points} ⭐
                </div>
                <div class="reward-caption">
                    Score Points
                </div>
            </div>
        `;

        details.appendChild(rewards);

        button.textContent = data.levelCompleted
            ? "View Final Result"
            : "Continue Journey";

    } else {
        card.className = "result-card failure";

        icon.textContent = "!";
        label.textContent = "Verification Failed";
        title.textContent = "Incorrect Answer";

        description.textContent =
            "Your cargo is waiting for clearance. " +
            "Try another geography question.";

        const penalty =
            document.createElement("div");

        penalty.className = "result-penalty";
        penalty.textContent = "−5 Seconds ⏱";

        details.appendChild(penalty);

        button.textContent = "Try Another Question";
    }

    overlay.classList.add("open");
    button.focus();
}

// Close the result popup
function hideQuizResult() {
    const overlay =
        document.getElementById("quiz-result");

    if (overlay) {
        overlay.classList.remove("open");
    }
}

// Run after game.js and upgrades.js are loaded
initializeQuizDesign();
