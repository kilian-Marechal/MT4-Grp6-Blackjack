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

  const [isConnected, setIsConnected] = useState(false)
  const [input, setInput] = useState("")
  const sendButton = document.querySelector('.sendButton')

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }

  if(updateValue) {
    setInput(updateValue)
  }

  if(sendButton) {
    sendButton.addEventListener('click', () => {
      inputChanges(input)
    })
  }

  return (
    <div>
      <input
      className = 'inputText'
      disabled = {isDisabled}
      placeholder ='DO IT'
      value = {input}
      onChange = {onChangeHandler}
      />
      <button className = 'sendButton'>Envoyer message</button>
    </div>
  )
}