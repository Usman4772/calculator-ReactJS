import React, { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import "./style.css"
export const ACTIONS={
  CHOOSE_DIGIT:"choose-digit",
  CHOOSE_OPERATION:"choose-operation",
  EVALUATE:"evaluate",
  CLEAR_ALL:"clear-all",
  DEL:"del"
}
function reducer(state,{type,payload}){
 switch(type){
  case ACTIONS.CHOOSE_DIGIT:
    if(payload.digit=="0" && state.currentOperand=="0") return state
    if(payload.digit=="." && state.currentOperand.includes(".")) return state
    if(state.overwrite){
      return {
        ...state,
        currentOperand:payload.digit,
       overwrite:false
      }
    }
    if(state.previousOperand!==null){
      return{
        ...state,
        previousOperand:state.previousOperand,
        currentOperand:`${state.currentOperand || ""}${payload.digit}`,
        operation:state.operation
      }
    }
    return{
      ...state,
      currentOperand:`${state.currentOperand || ""}${payload.digit}`,
      previousOperand:null,
      operation:null
    }
    case ACTIONS.CHOOSE_OPERATION:
     if(state.currentOperand==undefined && state.previousOperand==undefined) return state
     if(state.previousOperand==undefined){//if previous is undefined means we need to add it the current we've typed
      return{
        ...state,
        previousOperand:state.currentOperand,
        currentOperand:null,
        operation:payload.operation
      }
     }
     //if we want to change operation after
     if(state.previousOperand!==undefined && state.currentOperand==undefined){
      return{
        ...state,
        operation:payload.operation
      }
     }
     if(state.previousOperand!==undefined){//if previous is not undefined and we choose operation then ..then we have to perform calculations
      return{
        ...state,
        previousOperand:evaluate(state),
        currentOperand:null,
        operation:state.operation
      }
     }

     case ACTIONS.EVALUATE:
      if(state.previousOperand==undefined || state.currentOperand==undefined || state.operation==undefined) return state
   return {
    ...state,
    currentOperand:evaluate(state),
    previousOperand:null,
    operation:null,
    overwrite:true
   }
   
   case ACTIONS.CLEAR_ALL:
    return {}

  case ACTIONS.DEL:
    if(state.currentOperand==undefined) return state
    return{
      ...state,
      currentOperand:state.currentOperand.slice(0,-1)
    }

  
 }
}
function evaluate({currentOperand,previousOperand,operation}){
  const prev=parseFloat(previousOperand)
  const current=parseFloat(currentOperand)
  let result=""
switch(operation){
  case "+":
    result=prev+current;
    break;
  case "-":
    result=prev-current
    break
  case "*":
    result=prev*current
    break
  case "/":
    result=prev/current
    break
}

return result.toString()

}
function App() {
  const [{currentOperand,previousOperand,operation},dispatch]=useReducer(reducer,{})
  return (
    <div className='calculator-grid'>
    <div className='output'>
    <div className='previous-operand'>{previousOperand}{operation}</div>
    <div className='current-operand'>{currentOperand}</div>
    </div>
    <button className='span-two' onClick={()=>dispatch({type:ACTIONS.CLEAR_ALL})}>AC</button>
    <button onClick={()=>dispatch({type:ACTIONS.DEL})}>DEL</button>
    <OperationButton operation="/" dispatch={dispatch}></OperationButton>
     <DigitButton digit="1" dispatch={dispatch}/>
     <DigitButton digit="2" dispatch={dispatch}/>
     <DigitButton digit="3" dispatch={dispatch}/>
     <OperationButton operation="*" dispatch={dispatch}></OperationButton>
    <DigitButton digit="4" dispatch={dispatch}/>
    <DigitButton digit="5" dispatch={dispatch}/>
    <DigitButton digit="6" dispatch={dispatch}/>
    <OperationButton operation="+" dispatch={dispatch}></OperationButton>
    <DigitButton digit="7" dispatch={dispatch}/>
    <DigitButton digit="8" dispatch={dispatch}/>
    <DigitButton digit="9" dispatch={dispatch}/>
    <OperationButton operation="-" dispatch={dispatch}></OperationButton>
    <DigitButton digit="." dispatch={dispatch}/>
    <DigitButton digit="0" dispatch={dispatch}/>
    <button className='span-two' onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
  
    </div>
  )
}

export default App