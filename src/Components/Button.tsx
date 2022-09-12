import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface ButtonProps {
    playerID: string;
    draw?: boolean;
    bet?: number;
    disabled: boolean;
    functionTriggered: () => any | void;
}

export const Button = (props: ButtonProps) => {

  const { playerID, draw, bet, disabled, functionTriggered } = props;

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

const StyledButton = styled.div`
  margin-right: 8px;
`;