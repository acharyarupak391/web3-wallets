import styled from 'styled-components';

import NavBar from './components/NavBar';
import { flexRowNoWrap } from './theme/styles';
import { Z_INDEX } from './theme/zIndex';

const HeaderWrapper = styled.div`
  ${flexRowNoWrap};
  background-color: lightcoral;
  border-bottom: darkorchid;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: ${Z_INDEX.dropdown};
`;

export default function App() {
  return (
    <HeaderWrapper>
      <NavBar />
    </HeaderWrapper>
  );
}
