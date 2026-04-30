/**
 * Quiz routes for election readiness assessment.
 * Provides questions and scoring for a gamified voter readiness check.
 * @module routes/quizRoutes
 */
const express = require('express');

const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

/**
 * @typedef {Object} QuizQuestion
 * @property {number} id - Unique question identifier.
 * @property {string} question - The question text.
 * @property {boolean} correctAnswer - The correct answer (true/false).
 * @property {string} tip - Helpful guidance shown for incorrect answers.
 */

/** @type {QuizQuestion[]} */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Are you 18 years or older?",
    correctAnswer: true,
    tip: "You must be 18 years old on or before the election date to be eligible to vote."
  },
  {
    id: 2,
    question: "Do you have a valid Voter ID (EPIC)?",
    correctAnswer: true,
    tip: "A Voter ID (EPIC card) is the primary document for voting. Apply at nvsp.in if you don't have one."
  },
  {
    id: 3,
    question: "Is your name in the Electoral Roll?",
    correctAnswer: true,
    tip: "Check your registration status at nvsp.in or electoralsearch.in."
  },
  {
    id: 4,
    question: "Do you know your polling booth location?",
    correctAnswer: true,
    tip: "Use the Voter Helpline App or the Election Commission website to locate your booth."
  },
  {
    id: 5,
    question: "Can you carry your mobile phone inside the polling booth?",
    correctAnswer: false,
    tip: "Mobile phones are not allowed inside the polling booth as per Election Commission rules."
  }
];

/**
 * GET / — Returns the full list of quiz questions (cached for 1 hour).
 * Question objects omit the `correctAnswer` field to prevent cheating.
 * @route GET /
 * @returns {{ questions: Array<{ id: number, question: string, tip: string }>, total: number }}
 */
router.get('/', cacheMiddleware(3600), (req, res) => {
  res.json({
    questions: QUIZ_QUESTIONS.map(({ id, question, tip }) => ({ id, question, tip })),
    total: QUIZ_QUESTIONS.length,
  });
});

/**
 * POST /submit — Evaluates quiz answers and returns the score.
 * @route POST /submit
 * @param {Array<{ id: number, answer: boolean }>} req.body.answers - User's answers.
 * @returns {{ score: number, total: number, percentage: number, results: Array }}
 */
router.post('/submit', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.ANSWERS_REQUIRED,
    });
  }

  let score = 0;
  const results = QUIZ_QUESTIONS.map((q) => {
    const userAnswer = answers.find((a) => a.id === q.id);
    const isCorrect = userAnswer && userAnswer.answer === q.correctAnswer;
    if (isCorrect) score++;
    return {
      id: q.id,
      correct: isCorrect,
      tip: isCorrect ? null : q.tip,
    };
  });

  res.json({
    score,
    total: QUIZ_QUESTIONS.length,
    percentage: Math.round((score / QUIZ_QUESTIONS.length) * 100),
    results,
  });
});

module.exports = router;
