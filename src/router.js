import LocationComponent from './stages/locations';
import GearComponent from './stages/gear';
import GameComponent from './stages/game';
import MainMenuComponent from './stages/mainmenu';

const routes = [
  {
    path: '/',
    component: MainMenuComponent,
    exact: true,
    title: 'MainMenu',
  },
  {
    path: '/locations',
    component: LocationComponent,
    exact: false,
    title: 'Location',
  },
  {
    path: '/gear',
    component: GearComponent,
    exact: false,
    title: 'Gear'
  },
  {
    path: '/game/:idMap',
    component: GameComponent,
    exact: false,
    title: 'Game'
  }
];

export default routes;