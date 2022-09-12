import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Rank, Suit } from "../utils/types";

interface CardProps {
    rank: Rank;
    suit: Suit;
}

export const Card = (props: CardProps) => {

  const { rank, suit } = props;
  
  return <StyledCard suit={suit}>
            <StyledP className="cc">{rank}</StyledP>
            {suit === "Diamonds" ? (
                <StyledImg src="/Card_diamond.svg" alt="diamonds" />
              ) : suit === "Hearts" ? (
                <StyledImg src="/Card_heart.svg" alt="diamonds" />
              ) : suit === "Clubs" ? (
                <StyledImg src="/Card_club.svg" alt="diamonds" />
              ) : suit === "Spades" ? (
                <StyledImg src="/Card_spade.svg" alt="diamonds" />
              ) : (
                <></>
            )}
         </StyledCard>;
};

const StyledCard = styled.div<{ suit: Suit }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 200px;
  background-color: #fafafa;
  border: 2px solid;
  border-radius: 10px;
  font-size: 40px;
  font-weight: bold;
  margin-right: 2px;
  color: ${props => props.suit === 'Spades' || props.suit === 'Clubs' ? 'black' : 'red'}

  img {
    width: 40px;
  }
`;

const StyledP = styled.p`
  margin: 0 0 12px 0;
  padding: 0;
`;

const StyledImg = styled.img`
  margin: 0;
  padding: 0;
  width: 40px;
  height: 40px;
`;