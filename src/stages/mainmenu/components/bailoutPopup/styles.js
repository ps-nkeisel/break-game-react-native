import styled from 'styled-components';
import variables from "@/styles/variables"


export const ContainerHeader = styled.div`

${({ horizontal }) => (
        horizontal ?
            `
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    ` : ""
    )}

    margin-bottom: 30px;

p{
    color: white;
    font-size: 29px;
    margin-top: -20px;
    margin-bottom: 0px;
}

img {
    width: 80px;
    border-radius: 50%;
}
`

export const RecoveredLavel = styled.p`
    
    color: ${variables.yellow.normal};
    font-size: 21px;
    margin: 0;
    span {
        color: white;
    }
    
`

export const Divider = styled.div`

display: flex;
align-items: center;
justify-content: space-between;
margin: -15px 0;

.coinsImg{
    width: 67px;
    position: relative;
    top: -4px;
}

.dividerImg{
    height: 11px;
    flex-grow: 1;
    margin-left: -20px;
}

`


export const ContainerCoinsReceived = styled.div`

margin-bottom: -40px;

img {
    width: 85px;
    margin-bottom: -7px;
}

.coinsReceived {
    font-size: 21px;
    margin: 0;
    color: ${variables.yellow.normal};
}

.coinsLabel{
    color: white;
    font-size: 32px;
    margin: 0;
}
    
`;