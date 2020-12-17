import styled from 'styled-components';
import { ButtonVolume } from '@/components/volumeControl/styles';
import { CoinsBox } from '@/styles/style';

const mapperGradientsItems = {
  blue: '#00626b,#49b1e7',
  green: '#72b10a,#656f3e',
  purple: '#41274e, #a25ba8',
  red: '#6e1d0c, #be5320',
};

export const Header = styled.div`
    position: relative;
    width: 100%;
    box-sizing: border-box;
    ${ButtonVolume} {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    ${CoinsBox} {
        max-width: 100px;
        margin: 0 auto;
    }
`;

export const TopText = styled.p`
    margin: 10px 0;
    color: #ffffff;
    font-size: 18px;
    line-height: 25px;
    text-align: justify;
    margin: 0 auto;
    padding: 0 38px;
    padding-bottom: 15px;
    b {
        color: #ecaa5c;
    }
`;

export const ListItems = styled.ul`
    margin: 10px 0;
    padding: 0;
`;

export const BlockItem = styled.li`
    margin: 5px 0;
    display: flex;
    align-items: center;
    padding: 0;
    list-style: none;
    justify-content: space-between;
    .content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 35px;

        .playerInfo{
            display:  flex;
            align-items: center;
        }
    }
`;

function resolverGradients(theme) {
  return `background-image: radial-gradient(${mapperGradientsItems[theme]})`;
}

export const ItemInfo = styled.div`
    position: absolute;
    border-radius: 100%;
    background-color: #5c8e0a;
    width: 21px;
    height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border: 2px solid #562754;
    font-weight: bold;
    left: -4px;
    top: -10px;
    text-transform: lowercase;
    font-family: Times New Roman;
`;

export const ModalTutorial = styled.div`
    background-image:url(images/ui/in_game_UI/Tutorials_tools/background.png);
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 50px 10%;
    min-height: 90vh;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const ItemAmount = styled.div`
    position: absolute;
    bottom: -5px;
    right: -5px;
    border-radius: 35%;
    background-color: #562754;
    width: 21px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border: 2px solid gray;
    font-weight: bold;
`;

export const FigureItem = styled.div`
    position: relative;
    width: 55px;
    height: 55px;
    border-radius: 8px;
    display: flex;
    align-items: center;
		justify-content: center;
		flex-shrink: 0;
    ${({ theme }) => resolverGradients(theme)};
    border: 2px solid #000000ba;
    box-shadow: 0px 0px 15px 0px black, 1px -4px 14px 2px inset #000000a1;
    img {
        width: 100%;
    }
    ${({ circle }) => circle && 'border-radius: 100%'};
`;

export const DescriptionItem = styled.div`
	padding: 0 5px;
	color: #ffffff;
	font-size: 18px;
	line-height: 1.5;
	span {
        font-size: 18px;
        margin-left: 10px;
		display: block;
		strong {
			color: #72b10a;
		}
	}
`;
