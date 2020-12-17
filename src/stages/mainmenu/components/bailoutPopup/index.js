import React from 'react';
import BackgroundModal from "@/components/backgroundModal";

import { Dispatchers } from '@/store/ducks/modals';
import { ContainerCoinsReceived, ContainerHeader,Divider, RecoveredLavel } from './styles'




function helperGuyContent(coins, photo) {
    return (
        <>
            <ContainerHeader>
                <p>
                    THANKS FOR HELPING!
                    </p>
                <img src={photo} />
            </ContainerHeader>
            <ContainerCoinsReceived>
                <img src={"images/ui/icons_items_all/coins/coins_1.png"} />
                <p className="coinsReceived">
                    COINS RECEIVED
                    </p>
                <p className="coinsLabel">
                    +{coins}
                </p>
            </ContainerCoinsReceived>
        </>
    )
}

function prisonerGuyContent(playerName, coins, photo) {


    return (
        <div style={{margin: "-28px 0"}}>
            <ContainerHeader horizontal>
                <img src={photo} />
                <p>
                    {playerName} HAS<br />HELPED YOU!
                    </p>
            </ContainerHeader>
                
            <RecoveredLavel>
                YOU HAVE RECOVERED<br/>
                <span>+{coins}</span> COINS
            </RecoveredLavel>

            <Divider>
                <img className="coinsImg" src={"images/ui/icons_items_all/coins/coins_1.png"} />
                <img className={"dividerImg"} src={"images/ui/in_game_UI/pop_up_complete/dashed_divider.png"} />
            </Divider>

            <RecoveredLavel>
                HE WILL RECEIVE<br/>
            <span>+{coins}</span> COINS
            </RecoveredLavel>
        </div>
    )
}

export default function BailoutPopup(props) {

    const { photo,playerName, coins, action } = props.data;

    return (
        <BackgroundModal visibility={true} onBackPressed={() => Dispatchers.closeModals()}>
            <div style={{ marginBottom: "-40px;" }}>
                {
                    action === "helperGuy" ?
                        helperGuyContent(coins, photo)
                        :
                        prisonerGuyContent(playerName, coins, photo)
                }
            </div>
        </BackgroundModal>
    )
}