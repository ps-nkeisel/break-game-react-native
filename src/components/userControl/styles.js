import styled from 'styled-components';

const GlobalVariables = {
  radius: 20,
};

export const ContainerControl = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 5%;
    color: #ffffff;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    .name {
        text-transform: uppercase;
        color: #ffffff;
        font-weight: bold;
        font-size: 2.0rem;
        margin: 0 5%;
        line-height: 1.2;
        @media (max-width: 650px) {
            font-size: 1.5rem;
        }
    }
    .box {
        display: flex;
        flex: 1;
        align-items: center;
    }
`;

export const ContainerCounter = styled.div`
    width: 120px;
    height: 120px;
    padding: 15px 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    right: -3px;
    position: relative;
    z-index: 3;
    justify-content: center;
    flex-direction: center;
    flex-direction: column;
    background: #1e1428;
    border-radius: ${GlobalVariables.radius}px 0 0 ${GlobalVariables.radius}px;
    @media (max-width: 650px) {
        width: 60px;
        height: 68px;
    }
    .counter {
        text-align: center;
        font-weight: bold;
        margin: 5px 0;
        color: #ffffff;
        font-size: 2rem;
        line-height: 1;
    }
`;

export const ContainerAvatar = styled.div`
    width: 160px;
    height: 160px;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    margin-left: -1px;
    align-items: center;
    position: relative;
    overflow: hidden;
    z-index: 3;
    justify-content: center;
    flex-direction: center;
    flex-direction: column;
    background: #000000;
    border: 20px solid #1e1428;
    box-shadow: 2px 1px 20px 8px #00000042 inset;
    border-radius: ${GlobalVariables.radius}px;
    .avatar {
        width: 100%;
        object-fit: contain;
    }
    @media (max-width: 650px) {
        width: 80px;
        height: 80px;
        border-width: 5px;
    }
`;

export const ProgressBox = styled.div`
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    position: relative;
    display: block;
    overflow: hidden;
    background: #0d0a10;
    border-radius: ${GlobalVariables.radius / 2}px;
    box-shadow: 1px 1px 12px 2px #844eb27a;
    .line {
        width: ${props => props.porcentage}%;
        height: 100%;
        background: #844eb2;
    }
`;
