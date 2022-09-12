import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client"
let socket: any

interface PlayerProps {
  id: string,
  isDisabled: boolean,
  updateValue?: string | null,
  inputChanges: any
}

export const Player = ({ id, isDisabled, updateValue, inputChanges }: PlayerProps) => {

  const [input, setInput] = useState("")
  const [inputValue, setInputValue] = useState("")
  const inputText = document.querySelector('.inputText')

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }

  if(updateValue) {
    setInputValue(updateValue)
  }

  const clickButton = () => {
    inputChanges((inputText as any).value)
  }

  return (
    <div>
      {updateValue ? 
      (<input
      disabled = {isDisabled}
      placeholder ='DO IT'
      value = {inputValue}
      />)
      : (<input
      className = 'inputText'
      disabled = {isDisabled}
      placeholder ='DO IT'
      value = {input}
      onChange = {onChangeHandler}
      />
      )}
      {/* <input
      className = 'inputText'
      disabled = {isDisabled}
      placeholder ='DO IT'
      value = {!updateValue ? input : inputValue}
      onChange = {(e) => {
        setInput(e.target.value)
      }}
      /> */}
      <button disabled = {isDisabled} onClick={clickButton}>Envoyer message</button>
    </div>
  )
}