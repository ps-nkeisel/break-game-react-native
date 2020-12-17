import { keyframes } from 'styled-components';

const rotateEngine = keyframes`
  0% {
    transform: rotate(340deg);
  }
  50% {
    transform: rotate(380deg);
  }
  100% {
    transform: rotate(340deg);
  }
`;


export const FadeIn = keyframes`
  0% {
    background:rgba(0,0,0,.0);
  }
  100% {
    background:rgba(0,0,0,.7);
  }
`;

export const FadeOut = keyframes`
  0% {
    background:rgba(0,0,0,.7);
  }
  100% {
    background:rgba(0,0,0,.0);
  }
`;


export const QuickScaleDown = keyframes`
  0% {
    transform:scale(1);
  }
  99.9% {
    transform:scale(1);
  }
  100% {
    transform:scale(0);
  }
`;



export const RoadRunnerIn = keyframes`
  0% {
    transform:translateX(-1500px) skewX(30deg) scaleX(1.3);
  }
  70% {
    transform:translateX(30px) skewX(0deg) scaleX(.9);
  }
  100% {
    transform:translateX(0px) skewX(0deg) scaleX(1);
  }
`;

export const RoadRunnerOut = keyframes`
  0% {
    transform:translateX(0px) skewX(0deg) scaleX(1);
  }
  30% {
    transform:translateX(-30px) skewX(-5deg) scaleX(.9);
  }
  100% {
    transform:translateX(1500px) skewX(30deg) scaleX(1.3);
  }
`;

export const Pullse = keyframes`
  0% {
    transform: scale(1.3);
  }
  30% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.3);
  }
`;

export const ScaleUp = keyframes`
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
`;

export const Rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: scale(128deg);
  }
`;

export default rotateEngine;
