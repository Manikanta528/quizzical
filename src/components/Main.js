import React, { useEffect } from "react";



export default function Main(){
    const [start, setStart] = React.useState(true);
    const [trivia, setTrivia] = React.useState([]);
    const [result, setResult] = React.useState(["","","","",""]);
    const [playAgain, setPlayAgain] = React.useState(false);
    const [final, setFinal] = React.useState(false);
    const [finalCount , setFinalCount] = React.useState(0);
    

    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(data => setTrivia(data.results))
    },[playAgain])

    function handleStart(){
        setStart(false);
    }
    function handleResult(){
        setFinal(true);
        //console.log(result);
        let count = 0;
        setResult((prev)=>{
            for(let i = 0 ; i <= 4 ; i++){
                //console.log(trivia[i].correct_answer);
                if(prev[i] === trivia[i].correct_answer){
                    count++;
                }
                
                if(prev[i] === ""){
                    setFinal(false);
                }
            }
            setFinalCount(count);
            return prev;
        })
    }
    function handlePlayAgain(){
        setStart(prev => !prev); 
        setFinal(false);
        setTrivia([]);
        setResult(["","","","",""]);
        setFinalCount(0);
        setPlayAgain(prevPlay => !prevPlay);
    }

    return(
        <main>
            { start ?
                <div className="main-content">
                    <h1 style={{color : "#293264"}}>Quizzical</h1>
                    <p style={{color : "#293264"}}>Five Random Trivia Questions Quiz</p>
                    <button onClick={handleStart}>Start Quiz</button>
                </div> 
                :
                <div className="main-content">
                    {
                        trivia.map((data,index) => {
                            //console.log(index);
                            return <Trivia key={index} id={index} data={data} final={final} result={result} />
                    })
                    }
                    <div>
                        {final && 
                        <span style={{marginRight:"24px" , color: "#293264"}}>
                            You scored {finalCount}/5 correct answers
                        </span>
                        }
                        {final ?
                         <button 
                         onClick={handlePlayAgain} >
                            Play again</button> :
                         <button onClick={handleResult} >Check answers</button> 
                        }
                    </div>
                </div>
            } 
            <svg className="right-blob" width="194" height="197" viewBox="0 0 194 197" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M99.4095 81.3947C71.1213 50.8507 33.3179 21.7816 37.1727 -19.6933C41.4394 -65.599 75.8541 -105.359 118.419 -123.133C158.797 -139.994 206.035 -130.256 241.822 -105.149C271.947 -84.0141 272.823 -43.8756 282.141 -8.27103C292.17 30.0508 318.521 70.8106 296.501 103.779C273.538 138.159 224.991 143.432 183.931 138.768C148.318 134.723 123.751 107.677 99.4095 81.3947Z" fill="#FFFAD1"/>
            </svg>
            <svg className="left-blob" width="148" height="118" viewBox="0 0 148 118" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M-5.55191 4.90596C35.9614 1.77498 82.2425 -9.72149 112.306 19.1094C145.581 51.0203 155.282 102.703 142.701 147.081C130.767 189.18 93.7448 220.092 51.8208 232.476C16.5281 242.902 -15.4332 218.605 -49.1007 203.738C-85.3375 187.737 -133.641 182.993 -145.741 145.239C-158.358 105.868 -132.269 64.5881 -103.064 35.3528C-77.7328 9.99541 -41.2727 7.60006 -5.55191 4.90596Z" fill="#DEEBF8"/>
            </svg>
        </main>
    )
}
function Trivia(props){

    const choicePicks = props.data.incorrect_answers;
    choicePicks.push(props.data.correct_answer);
    choicePicks.sort(() => Math.random() - 0.5);
    
    const objChoicePicks = choicePicks.map((a,id) => { return {val : a , isSel : false, id : id}})

    const [ multiPicks, setMultiPicks] = React.useState(objChoicePicks);


    function handleChoice(ans){
        setMultiPicks(prevPicks => prevPicks.map((data) => {return {...data, isSel : (data.val === ans ) ? true : false }} ))
        //console.log(props.id);
        props.result[props.id] = ans;
    }

    
    const picks = multiPicks.map((item) => {
        let styles = {
            backgroundColor : item.isSel ? "#D6DBF5" : "white",
            borderColor : item.isSel ? "#D6DBF5" : "#4D5B9E" ,
            color: item.isSel ? "#4D5B9E" : "#4D5B9E" 
        }
        if(props.final){
            styles =  {
                backgroundColor : item.isSel && (item.val !== props.data.correct_answer) ? "#F8BCBC" : (item.val === props.data.correct_answer) ? "#94D7A2" : "white"  ,
                borderColor : item.isSel && (item.val !== props.data.correct_answer) ? "#F8BCBC" : (item.val === props.data.correct_answer) ? "#94D7A2" : "#4D5B9E"  ,
                color: item.isSel ? "#4D5B9E" : "#4D5B9E" 
            }
        }
        //console.log(item);
        return ( 
        <div 
        className="multi-choice-holder"
        style={styles}
        dangerouslySetInnerHTML={{__html: item.val}}
        onClick={() => handleChoice(item.val)}>
        
        </div>)
    } )

    return(
        <div className="question">
            <h4 dangerouslySetInnerHTML={{__html: props.data.question}} style={{marginBottom:"1vw", color: "#293264"}}>
            </h4>
            
            <div className="multi-choice">
            {picks}
            </div>
            <hr style={{marginTop:"1vw"}}/>
        </div>
    )
}
