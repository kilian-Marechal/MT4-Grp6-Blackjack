import type { NextPage } from 'next'
import React, { useState, useEffect, useRef } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Card } from '../src/Components/Card'
import { Player } from '../src/Components/Player'
import { io } from "socket.io-client"
// import SocketIOClient from "socket.io-client";
let socket: any

interface playerInterface {
  socketID: string;
  draw: boolean;
}

const Home: NextPage = () => {
  // Game Logic
  const [randomizedDecks, setRandomizedDecks] = useState([])
  const [chipCount, setChipCount] = useState(1000)
  const [betAmount, setBetAmount] = useState(0)
  const [lockedBet, setLockedBet] = useState(0)
  const [previousBet, setPreviousBet] = useState(0)
  const [dealersCards, setDealersCards] = useState([])
  const [dealerCount, setDealerCount] = useState(0)
  const [playersCards, setPlayersCards] = useState([])
  const [playerCount, setPlayerCount] = useState(0)
  const [players, setPlayers] = useState<playerInterface>({socketID: "", draw: false})
  const [playersID, setPlayersID] = useState<string[]>([])
  const [isBlackjack, setIsBlackJack] = useState(false)
  const [isPlayerBusted, setIsPlayerBusted] = useState(false)
  const [didDouble, setDidDouble] = useState(false)
  const [isDealersTurn, setIsDealersTurn] = useState(false)
  const [isDealerBusted, setIsDealerBusted] = useState(false)
  const [isHandComplete, setIsHandComplete] = useState(true)
  const [winner, setWinner] = useState("")
  const [inputUpdate, setInputUpdate] = useState("")
  const [draw, setDraw] = useState(false)
  const [buttonText, setButtonText] = useState("")

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async (): Promise<void> => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log("SOCKET CONNECTED!", socket.id);
    })

    socket.on('players', (serverPlayers: playerInterface) => {
      const ids: string[] = Object.keys(serverPlayers)
      setPlayersID(ids)
      setPlayers(serverPlayers)
    })

    socket.on('drawPlayer', (drawPlayer: playerInterface) => {
      console.log(players);
      console.log(drawPlayer.socketID);
      // (players as any)[drawPlayer.socketID].draw = drawPlayer.draw;
    })

    // socket.on('update-input', (msg: string) => {
    //   setInputUpdate(msg)
    // })
  }

  const drawCard = async (socketID: string) => {
    console.log("into the draw")
    console.log(players)
    setDraw(true)

    const drawPlayer: playerInterface = {
      socketID,
      draw
    }

    // Dispatch draw to other users
    const resp = await fetch("/api/draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drawPlayer),
    });

    // reset field if OK
    if (resp.ok) {
      // setDraw(false);
      setButtonText("true")
    } else {
      setButtonText("resp is not okay")
    }
  };

  const noDrawCard = async (playerID: string) => {
    console.log("into the No Draw")
    console.log(playerID)
    setButtonText("false")
  };

  // const parentCallBack = (EventString: string): void => {
  //   console.log("EventString " + EventString)
  //   socket.emit('input-change', EventString)
  // }

  // // Create decks
  // const num_decks = 3
  // class Cards{
  //   constructor(suit, rank){
  //     this.rank = rank
  //     this.suit = suit
  //   }
  // }
  // class Deck{
  //   constructor(){
  //     let suits = ['Diamonds','Hearts','Spades','Clubs'];
  //     let ranks = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King']
  //     this.cards = [];
  //     for(let j=0;j<suits.length;j++){
  //       for(let k=0;k<ranks.length;k++){
  //         this.cards.push(new Cards(suits[j], ranks[k]))
  //       }
  //     }
  //   }
  // }
  
  // function createDecks(num_decks){
  //   let deckArr = [];
  //   for(let i=0;i<num_decks;i++){
  //     deckArr.push(new Deck())
  //   }
  //   return deckArr;
  // }
  // let playDecks = createDecks(num_decks)
  // console.log("playDecks :", playDecks[0])

  return (
    <div>
      <div className={styles.container}>
        <Card rank={"10"} suit={"Hearts"} />
      </div>
      <div className='containerPlayer'>
        {playersID.map((playerID: string): any => {
            return (<div>
              <p>{(players as any)[playerID].draw ? "true" : "false"}</p>
              <button
              className={playerID}
              value="draw"
              disabled={socket.id != playerID}
              onClick={() => {
                drawCard(socket.id);
              }}>Draw</button>
              <button
              className={playerID}
              value="No draw"
              disabled={socket.id != playerID}
              onClick={() => {
                noDrawCard(socket.id);
              }}>No draw</button>
            </div>
            )}
          )}
        {/* {playersID.map((playerID: string): any => {
          return (<Player id={playerID} isDisabled={socket.id != playerID} updateValue={socket.id != playerID ? inputUpdate : null} inputChanges={parentCallBack} />)
        })} */}
      </div>
    </div>
  )
}

export default Home
