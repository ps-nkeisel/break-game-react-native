import styled from 'styled-components';

export const ContainerBar = styled.div`
    height: 5px;
    display: flex;
    width: 100%;
    .bar {
        flex: 1;
        background-color: ${(props) => props.color || '#ffffff'};
        height: 100%;
        margin: 0 2px;
    }
`;
