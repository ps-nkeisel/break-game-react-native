import styled from 'styled-components';

const PathVolume = 'images/ui/general_shared_items/';

export const ButtonVolume = styled.button`
    outline: none;
    width: 90px;
    height: 90px;
    cursor: pointer;
    position: relative;
    z-index: 10;
    background-image: url(${PathVolume}soundVolume.png);
    background-position-y: center;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position-x: ${props => props.active ? '0': '100%'};
    background-size: 200%;
    border: 0;
    @media (max-width: 650px) {
        width: 50px;
        height: 50px;
    }
`;