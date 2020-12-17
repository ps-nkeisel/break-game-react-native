import { layout } from '../../../../config/constant';

export const backgroundStyle = {
  x: (window.innerWidth / 2) - 25,
  y: (window.innerHeight / 2) + 65,
  anchor: '0.5',
  scale: layout.default_scale_design,
  texture: 'mainmenu/backgroundSafe.png',
};

export const knobStyle = {
  x: backgroundStyle.x - (220 * layout.default_scale_design),
  y: backgroundStyle.y + 2,
  anchor: '0.5',
  scale: layout.default_scale_design,
  texture: 'mainmenu/safe_knob_middle.png',
};

export const playButtonStyle = {
  x: backgroundStyle.x + (100 * layout.default_scale_design),
  y: backgroundStyle.y - (100 * layout.default_scale_design),
  anchor: '0.5',
  scale: layout.default_scale_design,
  texture: 'mainmenu/label_play.png',
};

export const gearButtonStyle = {
  x: backgroundStyle.x + (100 * layout.default_scale_design),
  y: backgroundStyle.y + (100 * layout.default_scale_design),
  anchor: '0.5',
  scale: layout.default_scale_design,
  texture: 'mainmenu/label_gear.png',
};

export const seasonIconStyle = {
  x: backgroundStyle.x + (360 * layout.default_scale_design),
  y: backgroundStyle.y + (330 * layout.default_scale_design),
  anchor: '0.5',
  scale: layout.default_scale_design,
};
