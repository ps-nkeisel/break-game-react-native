import styled from 'styled-components';
import colors, { ConfigsGlobal } from '@/styles/variables';

export const Picture = styled.img`
    width: 100%;
    background-size: contain;
    height: 100%;
`;

export const ContainerCenarie = styled.div`
    border-radius: ${ConfigsGlobal.border_radius}px;
    border: 5px solid ${colors.primary.normal};
    color: ${colors.primary.normal};
    background-color: black;
    height: 170px;
    position: relative;
    width: 100%;
    cursor: pointer;
    box-shadow: 1px 1px 6px black;
    @media (max-height: 480px) {
        height: 120px;
    }
    ${({ locked }) => locked
        && `border-color: #3a284a; 
        box-shadow: none; 
        cursor: default;`
    };
    @media (min-width: 768px) {
        height: 285px;
    }
    .text {
        width: 100%;
    }
    .footer {
        background: rgba(0,0,0, 0.8);
        position: absolute;
        left: 0;
        bottom: 0;
        border-radius: 0 0 ${ConfigsGlobal.border_radius}px ${ConfigsGlobal.border_radius}px;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        box-sizing: border-box;
        .number {
            font-size: 1.6em;
            color: ${colors.orange.normal};
            padding-right: 5px;
        }
        .title {
            color: #ffffff;
            letter-spacing: 2px;
            font-weight: 400;
            font-size: 1.05em;
            margin: 3px 5px;
        }
    }
    ${Picture} {
        border-radius: ${ConfigsGlobal.border_radius}px;
        ${({ locked }) => locked
            && `opacity: 0.3; 
            filter: grayscale(0.8);`
        };
    }
    &:after {
        ${({ locked }) => locked
            && 'content: \'\''
};
        background: url('images/ui/location/icon_locked.png') no-repeat center center;
        display: block;
        width: 60px;
        background-size: contain;
        height: 60px;
        position: absolute;
        top: -45px;
        right: 0;
        margin: auto;
        left: 0;
        bottom: 0;
        @media (max-height: 480px) {
           width: 22px;
           height: 22px;
        }
    }
`;
