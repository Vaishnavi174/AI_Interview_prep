import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./MockInterview.css";
import InterviewApi from "../api/interviewApi";
import AIAvtar from "../components/AIAvtar";
import ReactMarkdown from "react-markdown";

function MockInterview() {
  const webcamRef = useRef(null);

  const [cameraOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const [seconds, setSeconds] = useState(0);

  const [sessionId, setSessionId] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState("");

  const [lastTranscript, setLastTranscript] = useState("");

  const [questionNo, setQuestionNo] = useState(1);

  const [interviewCompleted, setInterviewCompleted] = useState(false);
const [finalFeedback, setFinalFeedback] = useState("");
const [finalScore, setFinalScore] = useState(0);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // ---------------- AI Voice -----------------

  const speak = (text) => {
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    utter.rate = 1;

    utter.pitch = 1;

    utter.onstart = () => setAiSpeaking(true);

    utter.onend = () => {
      setAiSpeaking(false);

      resetTranscript();

      setLastTranscript("");

      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    };

    window.speechSynthesis.speak(utter);
  };

  // ---------------- Send Answer -----------------

  const sendAnswer = async () => {
    if (!transcript.trim()) return;

    if (!sessionId) return;

    try {
      SpeechRecognition.stopListening();

      const answer = transcript;

      resetTranscript();

      setCurrentQuestion("🤖 AI is thinking...");

      const res = await InterviewApi.sendAnswer(sessionId, answer);

setTimeout(() => {

    const nextQuestion = res.data.content;

    // Interview Finished
    if (nextQuestion.startsWith("INTERVIEW_COMPLETE:")) {

        setInterviewCompleted(true);

        const feedback = nextQuestion.replace("INTERVIEW_COMPLETE:", "");

        setFinalFeedback(feedback);

        const match = feedback.match(/Score:\s*(\d+)/i);

        if (match) {
            setFinalScore(match[1]);
        }

        SpeechRecognition.stopListening();
        window.speechSynthesis.cancel();

        return;
    }

    // Continue Interview
    setCurrentQuestion(nextQuestion);

    setQuestionNo((prev) => prev + 1);

    speak(nextQuestion);

}, 1500);
    } catch (e) {
      console.log(e);
    }
  };

  // ---------------- Timer -----------------

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);

    const sec = seconds % 60;

    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  // ---------------- Auto Detect Silence -----------------

  useEffect(() => {
    if (!listening) return;

    if (!transcript.trim()) return;

    const timer = setTimeout(() => {
      if (transcript === lastTranscript) {
        SpeechRecognition.stopListening();

        sendAnswer();
      } else {
        setLastTranscript(transcript);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [transcript, lastTranscript]);

  // ---------------- Start Interview -----------------

  useEffect(() => {
    InterviewApi.startInterview("Frontend Developer").then((res) => {
      setSessionId(res.data.id);

      const firstQuestion = res.data.messages[0].content;

      setCurrentQuestion(firstQuestion);

      speak(firstQuestion);
    });
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <h2>Speech Recognition is not supported.</h2>;
  }
if (interviewCompleted) {

    return (

        <div className="result-page">

            <div className="result-card">

                <h1>🎉 Interview Completed</h1>

                <div className="score-circle">

                    {finalScore}

                </div>

                <h2>Overall Score</h2>

                <div className="feedback-box">
                <ReactMarkdown>
                {feedback}
                </ReactMarkdown>
                </div>

                <button
                    className="home-btn"
                    onClick={() => window.location.reload()}
                >
                    Start New Interview
                </button>

            </div>

        </div>

    );

}
  return (
    <div className="mock-container">
      <div className="video-section">
        <div className="ai-panel">
          <AIAvtar speaking={aiSpeaking} />

          <h2>🤖 AI Interviewer</h2>

          <div className="question-box">{currentQuestion}</div>
        </div>

        <div className="user-panel">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            className="webcam"
          />
        </div>
      </div>

      {/* Interview Information */}

      <div className="interview-info">
        <div className="info-card">
          <h4>Role</h4>

          <p>Frontend Developer</p>
        </div>

        <div className="info-card">
          <h4>Question</h4>

          <p>{questionNo}/10</p>
        </div>

        <div className="info-card">
          <h4>Time</h4>

          <p>{formatTime()}</p>
        </div>
      </div>

      {/* Status */}

      <div className="status-bar">
        <div>📹 Camera ON</div>

        <div>
          🎤 {listening ? "Listening..." : "Waiting"}
        </div>

        <div>
          🤖 {aiSpeaking ? "Speaking..." : "Waiting"}
        </div>
      </div>

      {/* Controls */}

      <div className="controls">
        <button
    className="end-btn"
    onClick={async () => {

        SpeechRecognition.stopListening();

        window.speechSynthesis.cancel();

        const res = await InterviewApi.finishInterview(sessionId);

        setInterviewCompleted(true);

        setFinalFeedback(res.data);

        const match = res.data.match(/Score:\s*(\d+)/i);

        if (match) {
            setFinalScore(match[1]);
        }

    }}
>
    End Interview
</button>
      </div>

      {/* Transcript */}

      <div className="transcript-box">
        <h3>Your Answer</h3>

        <textarea
          value={transcript}
          readOnly
          rows={6}
          className="transcript-area"
        />

        <button className="send-btn" onClick={sendAnswer}>
          Send Answer
        </button>
      </div>
    </div>
  );
}

export default MockInterview;