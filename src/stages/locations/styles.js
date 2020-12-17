import styled from 'styled-components';
import colors from '@/styles/variables';
import { BackgroundHeader, TitleHeaderGlow } from '@/styles/style';

const PathFolder = 'images/ui/location/';

export const ContainerGray = styled.div`
    background: #191919;
    background: linear-gradient(to bottom, #28232b, #342e36);
    border: 5px solid ${colors.primary.normal};
    padding: 25px 0;
    border-left: 0;
    border-right: 0;
    flex: 1;
    max-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    
    margin-top: 60px;
`;

export const ViewMode = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 7px solid #844eb2;
    padding: 0px 25px 20px;
    span {
        text-transform: uppercase;
        font-size: 2em;
        line-height: 1;
        color: #844eb2;
        margin-right: 25px;
        width: 10%;
        @media (max-height: 480px) {
            font-size: 12px;
            margin-right: 15px;
        }
    }
`;

export const ButtonGrid = styled.button`
    width: 35px;
    outline: none;
    height: 35px;
    background-color: transparent;
    border: 0;
    outline: none;
    background-repeat: no-repeat;
    background-image: url(${(props) => (props.grid === 'row'
    ? `${PathFolder}button_small_view_disabled.png` : `${PathFolder}button_big_view_disabled.png`)});
    background-size: contain;
    transition: all 0.4s ease;
    margin: 0 5px;
    &:hover {
        transform: scale(1.04);
    }
    ${({ active }) => active && 'filter: contrast(0.1); transform: scale(1.0.4)'};
    @media (max-height: 480px) {
        width: 20px;
        height: 20px;
    }
`;

export const ScrollListScenaries = styled.div`
    margin: 10px auto;
    padding: 10px 10px 140px;
    width: 90%;
    box-sizing: border-box;
`;

export const ItemGrid = styled.div`
    display:flex;
    flex-wrap: wrap;
    margin: 5px 0;
    padding: 0 5px;
    box-sizing: border-box;
    transition: all 0.4s ease;
`;

export const GridCenaries = styled.div`
    display:flex;
    margin: 0 -5px;
    flex-wrap: wrap;
    justify-content: flex-start;
    ${ItemGrid} {
        width: ${({ type }) => (type === 'row' ? '100%' : '50%')};
    }
`;

export const FooterLocation = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url('images/ui/general_shared_items/background_general.png') no-repeat left top;
    background-size: cover;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    height: 15vh;
    max-height: 100px;
    border-top: 7px solid rgb(17 17 17 / 85%);
    box-shadow: -4px 6px 0px 12px #844eb2;
`;

export const ContainerLocked = styled.div`
    text-align: center;
    border-top: 5px solid ${colors.orange.normal};
    padding: 10% 20px;
    border-bottom: 5px solid ${colors.orange.normal};
    color: #ffffff;
    height: 90vh;
    display: flex;
    flex-direction: column;
    background: #000000;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .ico {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }
    h1 {
        font-size: 4em;
        margin-bottom: 5px;
    }
    p {
        font-size: 2em;
    }
`;

export const Header = styled(BackgroundHeader)`
    background: url('images/ui/location/header_background_location.png') no-repeat left -18px;
    background-size: 100%;
    flex-shrink: 0;
    justify-content: center;
    align-items: flex-start;
    height: 115px;
    ${TitleHeaderGlow} {
        display: flex;
        align-items: center;
    }
`;