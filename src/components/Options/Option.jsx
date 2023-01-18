import React from 'react';

import { Check } from 'react-feather';
import styled from 'styled-components';

import {
  flexColumnNoWrap,
  flexRowNoWrap,
} from '../../theme/styles';

const InfoCard = styled.button`
  background-color: lightblue;
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 12px;
  width: 100% !important;
  &:focus {
    background-color: lightgreen;
  }
  border-color: gray;
`;

const CheckIcon = styled(Check)`
  ${flexColumnNoWrap};
  height: 20px;
  width: 20px;
  align-items: center;
  justify-content: center;
  align-items: flex-end;
`;

const OptionCard = styled(InfoCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`;

const OptionCardLeft = styled.div`
  ${flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`;

const OptionCardClickable = styled(OptionCard)`
  margin-top: 0;
  border: ${({ active, theme }) => active && `1px solid cyan`};
  &:hover {
    cursor: pointer;
    background-color: antiquewhite;
  }
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
`;

const HeaderText = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: center;
  color: blue;
  font-size: 16px;
  font-weight: 600;
`;

const SubHeader = styled.div`
  color: lightblue;
  margin-top: 10px;
  font-size: 12px;
`;

const IconWrapper = styled.div`
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  padding-right: 12px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "28px")};
    width: ${({ size }) => (size ? size + "px" : "28px")};
  }
  align-items: flex-end;
`;

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader,
  icon,
  isActive = false,
  id,
}) {
  const content = (
    <OptionCardClickable
      id={id}
      onClick={onClick}
      clickable={clickable && !isActive}
      disabled={!(clickable && !isActive)}
      active={isActive}
      data-testid="wallet-modal-option"
    >
      <OptionCardLeft>
        <HeaderText color={color}>
          <IconWrapper size={size}>
            <img src={icon} alt="Icon" />
          </IconWrapper>
          {header}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
      {isActive && <CheckIcon />}
    </OptionCardClickable>
  );
  if (link) {
    return (
      <a href={link} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
