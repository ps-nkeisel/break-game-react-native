import React from 'react';

import { ListStars, Star } from './styles';

function StarLevelComponent(props) {
  let { levelCurrent, levelTotal } = props;

  if (!levelTotal) {
    levelTotal = 3;
  }

  function setStars() {
    const listStars = [];

    for (let i = 1; i <= levelTotal; i++) {
      listStars.push(
        <Star key={i} active={levelCurrent >= i} />,
      );
    }

    return listStars;
  }

  return (
    <>
      <ListStars className={'list'+levelTotal+ ' ' + props.styling}>
        { setStars() }
      </ListStars>
    </>
  );
}

export default StarLevelComponent;
