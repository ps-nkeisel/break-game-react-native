import styled from 'styled-components';
import colors from '@/styles/variables';

export const ContainerOffer = styled.div`
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    border-top: 6px solid ${colors.primary.normal};
    border-bottom: 6px solid ${colors.primary.normal};
    text-align: center;
    background: #1a1b1b;
    .title {
        font-size: 2.2em;
        text-transform: uppercase;
        line-height: 1.5;
        span {
            color: #ffbb0f;
        }
        strong {
            font-size: 1.3em;
        }
    }
    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;
