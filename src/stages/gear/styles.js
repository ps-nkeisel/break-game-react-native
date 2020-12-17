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
        max-width: 70%;
    }
`;

function resolverGradients(theme) {
  return `background-image: radial-gradient(${mapperGradientsItems[theme]})`;
}

export const FigureItem = styled.div`
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
		font-size: 11px;
		display: block;
		strong {
			color: #72b10a;
		}
	}
`;
