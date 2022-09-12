import type { NextPage } from 'next'
import React, { useState, useEffect, useRef } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { Card } from '../src/Components/Card'
import { Button } from '../src/Components/Button'
import { io } from "socket.io-client"
// import SocketIOClient from "socket.io-client";
let socket: any

interface playerInterface {
  socketID: string;
  draw?: boolean;
  cards?: {}[];
  cardsValue?: number,
  money?: number,
  bet?: number,
  playersObj?: {}
}

const playerTemplate: playerInterface = {
  socketID: "",
  draw: false, 
  cards: [], 
  cardsValue: 0, 
  money: 1000, 
  bet: 0,
}

interface interfaceDrawPlayer {
  socketID: string, 
  draw: boolean,
  pickedCard: {} | any, 
  cardsValue: number
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
  const [players, setPlayers] = useState<playerInterface>(playerTemplate)
  const [playersID, setPlayersID] = useState<string[]>([])
  const [isBlackjack, setIsBlackJack] = useState(false)
  const [isPlayerBusted, setIsPlayerBusted] = useState(false)
  const [didDouble, setDidDouble] = useState(false)
  const [isDealersTurn, setIsDealersTurn] = useState(false)
  const [isDealerBusted, setIsDealerBusted] = useState(false)
  const [isHandComplete, setIsHandComplete] = useState(true)
  const [winner, setWinner] = useState("")
  const [gameStarted, setGameStarted] = useState(false)
  const [everyPlayerBet, setEveryPlayerBet] = useState(false)
  const [everyPlayerPlayed, setEveryPlayerPlayed] = useState(false)
  const [canPlay, setCanPlay] = useState(false);
  const [indexPlayerToPlay, setIndexPlayerToPlay] = useState(0);

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async (): Promise<void> => {
    await fetch('/api/socket')
    socket = io()

    //#region Server Event
      // Check id of the connected player
      socket.on('connect', () => {
        console.log("SOCKET CONNECTED!", socket.id);
      })

      // Update when a player connect or disconnect
      socket.on('players', (serverPlayers: playerInterface) => {
        if(!gameStarted) {
          const ids: string[] = Object.keys(serverPlayers)
          setPlayersID(ids)
          setPlayers(serverPlayers)
        }
      })
    //#endregion

    //#region SERVER Game Events
      socket.on('startGame', () => {
        setGameStarted(true)
      })

      socket.on('permission', (permission: {playerID: string, indexPlayerToPlay: number, canPlay: boolean, playersObj: playerInterface}) => {       
        if(socket.id === permission.playerID && permission.indexPlayerToPlay <= Object.keys(permission.playersObj).length) {
          setCanPlay(canPlay);
          
          if(socket.id === permission.playerID && (permission.playersObj as any)[socket.id].cards.length === 0) {
            // Double draw at the beginning
            startingDraw((permission.playersObj as any), permission.playerID);
          }
          setIndexPlayerToPlay(permission.indexPlayerToPlay);
        } else if(permission.indexPlayerToPlay > Object.keys(permission.playersObj).length) {
          setCanPlay(!canPlay)
          console.log("croupier time")
          setIndexPlayerToPlay(0);
        } else {
          setCanPlay(!canPlay)
          setIndexPlayerToPlay(permission.indexPlayerToPlay);
        }
      })

      socket.on('startingDraw', (startingDrawPlayers: {playersObj: playerInterface, permissionPlayerID: string}) => {
        if(socket.id === startingDrawPlayers.permissionPlayerID) {
          drawCard(socket.id, true, startingDrawPlayers.playersObj, true)
        }
      })
    //#endregion

    //#region SERVER Players Event
      // Update players infos when there is a draw
      socket.on('drawPlayer', (draw: any) => {
        const updatePlayer: interfaceDrawPlayer = draw.drawPlayer;
        const playersObj: playerInterface = draw.playersObj;

        // Update Infos
        (playersObj as any)[updatePlayer.socketID].draw = updatePlayer.draw;
        if(draw.doubleDraw) {
          (playersObj as any)[updatePlayer.socketID].cards.push(...updatePlayer.pickedCard);
        } else {
          (playersObj as any)[updatePlayer.socketID].cards.push(updatePlayer.pickedCard);
        }
        (playersObj as any)[updatePlayer.socketID].cardsValue += updatePlayer.cardsValue;
        
        setPlayers(playersObj)
      })

      socket.on('betPlayer', (bet: any) => {
        const betPlayerID: string = bet.betPlayer.playerID;
        const betValue: number = bet.betPlayer.betValue;
        const playersObj: playerInterface = bet.playersObj;
        const playersObjIndex: string[] = Object.keys(playersObj);
        let allPlayerBet: boolean = false;

        // Update Infos
        (playersObj as any)[betPlayerID].bet = betValue;
        (playersObj as any)[betPlayerID].money -= betValue;

        // Check if all players bet
        for(let index = 0; index < playersObjIndex.length; index++) {
          if((playersObj as any)[playersObjIndex[index]].bet === 0) {
            allPlayerBet = false;
            break;
          } else {
            allPlayerBet = true;
          }
        }

        if(allPlayerBet) {
          setEveryPlayerBet(true);
          turnPermission(playersObj, playersObjIndex);
        }

        setPlayers(playersObj);
      })
    //#endregion
  }

  //#region CLIENT Game Events
    // START
    const startGame = async () => {
      // Dispatch startGame to other users
      const resp = await fetch("/api/startGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(true),
      });
    }

    // Starting Draw
    const startingDraw  = async (playersObj: playerInterface, permissionPlayerID: string): Promise<void> => {
      // Dispatch startingDraw to other users
      const resp = await fetch("/api/startingDraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({playersObj, permissionPlayerID}),
      }); 
    }

    // Permission Players
    const turnPermission = async (playersObj?: playerInterface, playersIDSocket?: string[]) => {
      if(!playersIDSocket && indexPlayerToPlay > playersID.length) {
        console.log(canPlay)
      } else {
        const playerID = playersIDSocket? playersIDSocket[indexPlayerToPlay] : playersID[indexPlayerToPlay];

        // Dispatch permissions to other users
        const resp = await fetch("/api/gamePermission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({playerID, indexPlayerToPlay: indexPlayerToPlay, canPlay: true, playersObj}),
        });
      }
    }
  //#endregion

  //#region CLIENT Players Event
    // DRAW
    const drawCard = async (socketID: string, draw: boolean, playersObj: playerInterface, doubleDraw?: boolean): Promise<void> => {
      if(draw) {
        const drawPlayer: playerInterface = {
          socketID,
          draw,
        }
    
        // Dispatch draw to other users
        const resp = await fetch("/api/draw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({drawPlayer, doubleDraw, playersObj}),
        });
      } else {
        turnPermission(players);
      }
    };

    // BET
    const bet = async (playerID: string, betValue: number, playersObj: playerInterface) => {
      const betPlayer = {
        playerID,
        betValue
      }

      // Dispatch bet to other users
      const resp = await fetch("/api/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({betPlayer, playersObj}),
      });
    }
  //#endregion

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
    <div className={styles.main}>
      <div className={styles.container}>
        {!gameStarted ? (
          <button className={`${styles.startButton} ${styles.toStart}`} onClick={startGame}>Start the game</button>
        ) : (
          <button className={`${styles.startedButton} ${styles.startButton}`} disabled={gameStarted}>Game Started !</button>
        )}
        
      </div>
      <div className={styles.playersContainer}>
        {playersID.map((playerID: string, index): any => {
          return (
            <div className={styles.playerSubContainer}>
              <p>Player : {index}</p>
              <div className={styles.cardsContainer}>
                {(players as any)[playerID].cards.map((card: {suit:string, rank:string}): any => {
                  return (<Card playerID={playerID} index={index} suit={card.suit} rank={card.rank}/>)
                })}
              </div>
              <p>Total Value : {(players as any)[playerID].cardsValue.toString()}</p>
              <div>
                <Button playerID={playerID} playerBet={(players as any)[playerID].bet} bet={50} disabled={(socket.id != playerID || !gameStarted || everyPlayerBet)} functionTriggered={() => bet(socket.id, 50, players)} />
                <Button playerID={playerID} playerBet={(players as any)[playerID].bet} bet={100} disabled={(socket.id != playerID || !gameStarted || everyPlayerBet)} functionTriggered={() => bet(socket.id, 100, players)} />
                <Button playerID={playerID} playerBet={(players as any)[playerID].bet} bet={200} disabled={(socket.id != playerID || !gameStarted || everyPlayerBet)} functionTriggered={() => bet(socket.id, 200, players)} />
                <Button playerID={playerID} playerBet={(players as any)[playerID].bet} bet={500} disabled={(socket.id != playerID || !gameStarted || everyPlayerBet)} functionTriggered={() => bet(socket.id, 500, players)} />
              </div>
              <Button playerID={playerID} draw={true} disabled={(socket.id != playerID || !everyPlayerBet || canPlay)} functionTriggered={() => drawCard(socket.id, true, players)} />
              <Button playerID={playerID} draw={false} disabled={(socket.id != playerID || !everyPlayerBet || canPlay)} functionTriggered={() => drawCard(socket.id, false, players)} />
            </div>
            )}
          )}
      </div>
    </div>
  )
}

export default Home
