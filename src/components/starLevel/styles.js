import styled from 'styled-components';

import { ScaleUp } from '@/styles/animations';

const StarDisabledPath = 'images/ui/in_game_UI/pop_up_complete/star_disabled.png';
const StarEnabledPath = 'images/ui/in_game_UI/pop_up_complete/star_active.png';

export const Star = styled.div`
    width: 60px;
    height: 60px;
    background-repeat: no-repeat;
    background-position: left top;
    background-size: contain;
    transition: background-image 0.4s ease;
    transform: scale(0.8);
    background-image: url(${(props) => (props.active ? StarEnabledPath : StarDisabledPath)});
    display: block;
    animation: ${(props) => (props.active ? ScaleUp : 'none')} 1s forwards ease-in;
`;

export const ListStars = styled.div`
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: center;
    margin-bottom: 10px;
    position: relative;
    &.block {
        position: absolute;
        top: -15px;
        padding: 5px;
        border-radius: 5px;
        left: 0;
        right: 0;
        margin: auto;
        max-width: 80px;
        background: black;
        ${Star} {
            width: 25px;
            height: 25px;
        }
    }
    ${Star}:first-child {
        animation-delay: 1s;
    }
    ${Star}:nth-child(2) {
        animation-delay: 1.3s;
    }
    ${Star}:nth-child(3) {
        animation-delay: 1.6s;
    }
    ${Star}:nth-child(4) {
        animation-delay: 1.9s;
    }
    ${Star}:nth-child(5) {
        animation-delay: 2.2s;
    }
    &.list5:not(.block) {
        ${Star}{
            width: 50px;
            height: 50px;
        }
    }
`;
