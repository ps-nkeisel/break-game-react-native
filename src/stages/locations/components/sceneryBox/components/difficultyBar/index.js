import React from 'react';

import { ContainerBar } from './styles';
import { DifficultyLevels } from '@/enums/game-enums';

export default function DifficultyBar(props) {
  const { difficulty } = props || DifficultyLevels.easy;
  const bars = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < difficulty; i++) {
    bars.push(
      <div className="bar" key={i} />,
    );
  }

  const resolverColorDifficulty = () => {
    let color = '#ffffff';

    switch (difficulty) {
      case DifficultyLevels.easy:
        color = '#729527';
        break;
      case DifficultyLevels.medium:
        color = '#2d82bd';
        break;
      case DifficultyLevels.hard:
        color = '#a16dcd';
        break;
      case DifficultyLevels.expert:
        color = '#bd852d';
        break;
      case DifficultyLevels.insane:
        color = '#c64545';
        break;
      default:
        color = '#ffffff';
        break;
    }

    return color;
  };

  return (
    <ContainerBar color={resolverColorDifficulty()}>
      { bars }
    </ContainerBar>
  );
}
