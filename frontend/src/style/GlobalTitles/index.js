import React from "react";
import styled from "styled-components";
import {rem} from "polished";
import {device} from "../Functions";

export const SmallTitle = styled.label`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: ${rem("16px")};
    color: #232735;
`;

export const MiddleTitle = styled.h3`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: ${rem("32px")};
    color: #232735;
`;

export const BigTitle = styled.h1`
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    color: #232735;
    text-transform: uppercase;
`

export const BloodValU = ({text, black, red}) => {

    const U = styled.span`
      @media ${device.tablet} { 
        font-size: ${rem(`${50}px`)};
        margin-right: 5px;
      }
      font-size: ${rem(`${red}px`)};
      font-weight: 600;
      color: #D33449;
      cursor: pointer;
      margin-bottom: 5px;
      font-family: 'Poppins', sans-serif;
      line-height: ${rem("24px")};
    `

    const Bloodval = styled(U)`
      @media ${device.tablet} { 
        display: none;
      }
      font-size: ${rem(`${black}px`)};
      line-height: ${rem("24px")};
      color: #262541;
    `

    return (
        <div>
            <Bloodval>{text}</Bloodval><U>U</U>
        </div>
    )
}

export const ChartTitle = styled.h2`
  font-size: ${rem("25px")};
  font-weight: lighter;
  grid-area: title;
  border-bottom: 1px solid rgba(0,0,0,0.44);
`

export const ErrorPlaceholder = styled.div`
  // width: ${rem("340px")};
  // height: ${rem("52px")};
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: red;
    text-align: center;
  }
`;