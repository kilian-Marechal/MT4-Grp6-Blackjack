import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface ButtonProps {
    playerID: string;
    draw?: boolean;
    bet?: number;
    playerBet?: number;
    disabled: boolean;
    functionTriggered: () => any | void;
}

export const Button = (props: ButtonProps) => {

  const { playerID, draw, bet, disabled, playerBet, functionTriggered } = props;
  console.log(playerBet, bet, playerBet === bet)


  return (
    <StyledButton>
      {bet == undefined ?
      (
        <button disabled={disabled} onClick={functionTriggered}>
          {draw ? "Draw" : "Not draw"}
        </button>
      ) :
      (
        <button disabled={disabled} value={bet?? bet} onClick={functionTriggered}>
          {bet?.toString()}
        </button>
      )
    }
    </StyledButton>
  )
};

// const StyledButton = styled.button<{ playerBet : number; bet : number }>`
const StyledButton = styled.button`
  // background-color: ${props => props.playerBet === props.bet ? 'green' : 'red'};

  // text-shadow: 1px 1px pink, -1px -1px maroon;

  // text-align: center;
  // display: inline-block;

  // -webkit-border-radius: .75em;
  // -moz-border-radius: .75em;
  // -o-border-radius: .75em;
  //     border-radius: .75em;
  // -webkit-box-shadow:  0 .2em maroon;
  // -moz-box-shadow:  0 .2em maroon;
  // -o-box-shadow:  0 .2em maroon;
  // box-shadow:  0 .2em maroon;
  // color: ${props => props.playerBet === props.bet ? 'green' : 'red'};
  // margin: 5px;
  // background-color: ${props => props.playerBet === props.bet ? 'green' : 'red'};
  // background-image: -o-linear-gradient(left top, pink 3%, ${props => props.playerBet === props.bet ? 'green' : 'red'} 22%, maroon 99%);
  // background-image: -moz-linear-gradient(left top, pink 3%, ${props => props.playerBet === props.bet ? 'green' : 'red'} 22%, maroon 99%);
  // background-image: -webkit-linear-gradient(left top, pink 3%, ${props => props.playerBet === props.bet ? 'green' : 'red'} 22%, maroon 99%);
  // background-image: linear-gradient(left top, pink 3%, ${props => props.playerBet === props.bet ? 'green' : 'red'} 22%, maroon 99%);
  // cursor: pointer;
  // padding-left: 5px;

  // button {
  //   border: 0px #999999;
  //   background-color: transparent;
  //   font-size: 15px;
  //   color: white;

  //   &:disabled,
  //   &[disabled]{
  //   border: 0px #999999;
  //   background-color: transparent;
  //   color: ##bfbfbf;
  //   cursor: default;
  //   font-size: 15px;
  // }
}
`;