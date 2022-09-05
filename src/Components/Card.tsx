import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Color, Rank, Suit } from "../utils/types";

interface CardProps {
    rank: Rank;
    suit: Suit;
}

export const Card = (props: CardProps) => {

  const {rank, suit } = props;
  
  return <StyledCard suit={suit}>
            <p>{rank}</p>
            <p>{suit}</p>
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
  border: 1px solid;
  color: ${props => props.suit === 'Spades' || props.suit === 'Clubs' ? 'black' : 'red'}
`;