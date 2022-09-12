import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // get message
    const draw = req.body;

    const suits = ['Diamonds','Hearts','Spades','Clubs'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'] 

    const calculateValue = () => {
      const pickedCardRank = draw.drawPlayer.pickedCard.rank;
      let cardValue: number = 0;
      let hasAce: boolean = false;

      if(draw.playersObj[draw.drawPlayer.socketID].cards?.length > 0) {
        if(draw.playersObj[draw.drawPlayer.socketID].cards.find((card: string,{}) => (card as any).rank == 'Ace') != undefined) {
          hasAce = true;
        }
      }
      
      switch(pickedCardRank) {
        case 'A':
          hasAce ? cardValue = 10 : cardValue = 1;
          break;

        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          cardValue = parseInt(pickedCardRank);
          break;
        case 'J':
        case 'Q':
        case 'K':
          cardValue = 10;
          break;
      }

      return cardValue
    }

    const randomDraw = () => {  
      const suit = suits[Math.floor(Math.random() * (suits.length - 1))];
      const rank = ranks[Math.floor(Math.random() * (ranks.length - 1))];
      const card = {suit: suit, rank: rank}

      // Generated card
      draw.drawPlayer.pickedCard = card;

      // Value of player Cards
      draw.drawPlayer.cardsValue = calculateValue();
    }
    randomDraw();

    if(draw.doubleDraw) {
      let pickedCards: {}[] = [];
      let finalValue: number = 0;

      // Store the first draw
      pickedCards.push(draw.drawPlayer.pickedCard);
      finalValue += draw.drawPlayer.cardsValue;

      // Second Draw
      randomDraw();
      pickedCards.push(draw.drawPlayer.pickedCard);
      finalValue += draw.drawPlayer.cardsValue;

      // Store the two draws with the correct value
      draw.drawPlayer.pickedCard = pickedCards;
      draw.drawPlayer.cardsValue = finalValue;      
    }

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("drawPlayer", draw);

    // return message
    res.status(201).json(draw);
  }
};
