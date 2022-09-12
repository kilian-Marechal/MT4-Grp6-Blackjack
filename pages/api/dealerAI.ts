import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    
    const dealerData = req.body;

    const suits = ['Diamonds','Hearts','Spades','Clubs'];
    const ranks = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'] 

    const calculateValue = () => {
      const pickedCardRank = dealerData.pickedCard.rank;
      let cardValue: number = 0;
      let hasAce: boolean = false;

      if(dealerData.cards?.length > 0) {
        if(dealerData.cards.find((card: string,{}) => (card as any).rank == 'Ace') != undefined) {
          hasAce = true;
        }
      }
      
      switch(pickedCardRank) {
        case 'Ace':
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

        case 'Jack':
        case 'Queen':
        case 'King':
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
      dealerData.pickedCard = card;
      dealerData.cards.push(card);

      // Value of player Cards
      dealerData.cardsValue = calculateValue();
    }
    randomDraw();

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("dealerTurn", dealerData);

    // if(dealerData.cardsValue < 17) {
    //   setInterval(() => {
    //     randomDraw();

    //     res?.socket?.server?.io?.emit("dealerTurn", dealerData);
    //   }, 1500)
    // }

    // return message
    res.status(201).json(dealerData);
  }
};
