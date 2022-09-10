import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client"
let socket: any

interface PlayerProps {
  id: string,
  isDisabled: boolean,
  updateValue?: string | null,
  parentCallBack: any
}

export const Player = ({ id, isDisabled, updateValue, parentCallBack }: PlayerProps) => {

  const [isConnected, setIsConnected] = useState(false)
  const [input, setInput] = useState("")

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }

  if(updateValue) {
    setInput(updateValue)
  }

  return (
    <input
    disabled = {isDisabled}
    placeholder='DO IT'
    value={input}
    onChange={(e) => {
      onChangeHandler(e)
      parentCallBack(e.target.value)
      }}
    />
  )
}