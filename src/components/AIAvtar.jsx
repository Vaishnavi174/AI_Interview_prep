import "./AIAvtar.css";

function AIAvtar({ speaking }) {

    return (

        <div className="ai-container">

            <div className={speaking ? "avtar speaking" : "avtar"}>

                <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="AI Interviewer"
                />

            </div>

            <h2>🤖 AI Interviewer</h2>

            <div className="status">

                {speaking ? (
                    <>
                        <span className="green-dot"></span>
                        Speaking...
                    </>
                ) : (
                    <>
                        <span className="blue-dot"></span>
                        Listening...
                    </>
                )}

            </div>

        </div>

    );

}

export default AIAvtar;