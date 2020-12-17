import styled from 'styled-components';

import colors from '@/styles/variables';

export const ContainerPack = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    .block {
        flex: 1;
        width: 100%;
        span {
            display: block;
            color: #ffb200;
            font-size: 1.3em;
        }
    }
`;

export const IconBag = styled.img`
    width: 75px;
    height: 75px;
`;

export const BarCapacity = styled.div`
    width: 100%;
    height: 35px;
    border-radius: 5px;
    border: 4px solid #ffffff70;
    background: ${colors.primary.dark};
    position: relative;
    margin: 3px 0 0;
    box-sizing: border-box;
    label {
        width: 100%;
        height: 100%;
        display: flex;
        position: absolute;
        font-size: 1.4em;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        text-shadow: 0px 1px 1px black
    }
`

export const PctCapacity = styled.div`
    width: 25%;
    height: 100%;
    background: orange;
    background: linear-gradient(to bottom, #e79c0f, #ffc70a);
    box-shadow: 1px -1px 5px 8px #FF9800 inset;
`