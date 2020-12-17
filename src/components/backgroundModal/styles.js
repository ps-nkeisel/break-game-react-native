import styled from 'styled-components';



export const ModalTutorial = styled.div`
    position: relative;    
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 50px 10%;
    min-height: 270px;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.9;

    .background {
        background-color: #22132B;
        border-top: 4px solid #442D52;
        top: 0;
        left: 0%;
        z-index: -10;
        flex-grow: 1;
        width: 100%;
        height: 100%;
        position: absolute;
        transform: skew(0deg, -3deg);
        border-bottom: 4px solid #442D52;
    }
`;