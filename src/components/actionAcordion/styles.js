import styled from 'styled-components';

import colors, { ConfigsGlobal } from '@/styles/variables';

export const BlockAcordion = styled.div`
    margin-bottom: 10px;
    padding: 0 20px;
`;

export const HeaderAcordion = styled.header`
    background: ${colors.orange.normal};
    padding: 2px 5px;
    border-radius: ${ConfigsGlobal.border_radius - 11}px;
    text-transform: uppercase;
    font-size: 2em;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    p {
        margin: 5px 0;
    }
    transition: all 0.2s ease;
    &:active {
        background: ${colors.primary.dark};
    }
    div {
        margin-right: 2px;
    }
`;

export const BodyAcordion = styled.div`
    transition: all 0.2s ease-in;
    ${props => props.open ? '' : 'display: none;'}
`