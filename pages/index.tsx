import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Card } from '../src/Components/Card'
import { Player } from '../src/Components/Player'
import { io } from "socket.io-client"
let socket: any

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
  const [playersID, setPlayersID] = useState<string[]>([])
  const [isBlackjack, setIsBlackJack] = useState(false)
  const [isPlayerBusted, setIsPlayerBusted] = useState(false)
  const [didDouble, setDidDouble] = useState(false)
  const [isDealersTurn, setIsDealersTurn] = useState(false)
  const [isDealerBusted, setIsDealerBusted] = useState(false)
  const [isHandComplete, setIsHandComplete] = useState(true)
  const [winner, setWinner] = useState("")
  const [inputUpdate, setInputUpdate] = useState("")

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async (): Promise<void> => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('getCount', (total: number) => {
      console.log(total)
    })

    socket.on('players', (serverPlayers: {}) => {
      const ids: string[] = Object.keys(serverPlayers)
      setPlayersID(ids)
    })

    socket.on('update-input', (msg: string) => {
      setInputUpdate(msg)
    })
  }

  const parentCallBack = (EventString: string): void => {
    console.log(EventString)
    socket.emit('input-change', EventString)
  }

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
          return (<Player id={playerID} isDisabled={socket.id != playerID} updateValue={socket.id != playerID ? inputUpdate : null} parentCallBack={parentCallBack} />)
        })}
      </div>
    </div>
  )
}

export default Home
