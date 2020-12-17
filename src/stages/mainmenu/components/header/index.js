import React from 'react';

import { BackgroundHeader, BrandGame } from '../../../../styles/style';

const topBackground = (props) => (

  <div>
    <BackgroundHeader>
      <BrandGame alt="Break and Enter" src="images/ui/mainmenu/logo.png" />
    </BackgroundHeader>
  </div>

  // { /* <Sprite {...backgroundStyle} texture={ui_textures[backgroundStyle.texture]} />
  // <Sprite {...backgroundCoinsStyle} texture={ui_textures[backgroundCoinsStyle.texture]} />
  // <Sprite {...coinsIconStyle} texture={ui_textures[coinsIconStyle.texture]} />
  // <Sprite {...iconPlusIconStyle} texture={ui_textures[iconPlusIconStyle.texture]} />
  // <Text {...coinsTextStyle} text={"9.999.999"}  /> */}

);

export default topBackground;
