import React, { useState } from 'react';

import { BlockAcordion, HeaderAcordion, BodyAcordion } from './styles';

export default function ActionAcordion(props) {
  const { title, componentSecondary, children, initOpened=false } = props;

  const [isOpen, setStateAcordion] = useState(initOpened);


  return (
    <BlockAcordion>
      <HeaderAcordion onClick={() => {
          setStateAcordion(!isOpen)
      }}>
        <p>
          <span>{isOpen ? '-' : '+'} </span>
          { title }
        </p>
        <div>
          { componentSecondary }
        </div>
      </HeaderAcordion>
      <BodyAcordion open={isOpen}>
        { children }
      </BodyAcordion>
    </BlockAcordion>
  );
}
