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
            color: ${colors.yellow.normal};
            font-size: 1.1em;
        }
    }
`;

export const IconBag = styled.img`
    width: 70px;
    height: 73px;
    position: relative;
    top: -10px;
`;

