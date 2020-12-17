import React, { useState, useEffect } from 'react';
import Modal from '../modal';
import {
    ContainerSuccess, ButtonBuy, BackButton, ButtonGradientMedium
} from '../../styles/style';
import GameService from '@/stages/game/scripts/core/services/GameService';
import _ from 'underscore'
import images from '@/stages/game/manifests/images.json'

import {
    BlockItem, FigureItem, DescriptionItem, TopText
} from './styles';




export default function (props) {
    const {gotoBack ,usedContexts, setUsedContexts, usedPlayers, setUsedPlayers, visibility, onBackPressed, coins = 0 } = props;

    let playerName = window.FBInstant.player.getName();


    const [friends, setFriends] = useState([]);

    const [loading, setLoading] = useState(true);

    const [totalFriendsAsked, setTotalFriendsAsked] = useState(0);






    const rewardCoins = Math.ceil(coins * 0.25);

    useEffect(() => {
        getPlayers();
    }, []);

    function getPlayers() {
        window.FBInstant.player.getConnectedPlayersAsync().then(function (friendsGot) {
            var _friends = [];

            friendsGot.forEach((friendGot) => {
                var friendId = friendGot['$1'].id;
                var friendName = friendGot['$1'].name;
                var photo = friendGot['$1'].photo;
                _friends.push({ id: friendId, name: friendName, photo: photo })
            });


            setLoading(false);

            setFriends(_friends);
        })
    }

    // function getBailoutID() {
    //     if (bailOutId.current) {
    //         return Promise.resolve(bailOutId.current)
    //     } else {
    //         return GameService.createBailout(coins).then((response) => {
    //             const { id, total_coins_user } = response.data
    //             setFriendReward(total_coins_user);
    //             bailOutId.current = id;
    //             return id;
    //         });
    //     }
    // }

    function invite() {
        window.FBInstant.context
            .chooseAsync({
                filters: ['NEW_PLAYERS_ONLY'],
                maxSize: 2,
                minSize: 2
            })
            .then(function () {
                sendAskUpdate();
                let contextID = window.FBInstant.context.getID();
                if (usedContexts.indexOf(contextID) === -1) {
                    setUsedContexts([...usedContexts, contextID])
                }

                window.FBInstant.context.getPlayersAsync()
                    .then(function (players) {
                        console.log("playersplayers", players)
                        let friend = _.reject(_.pluck(players, "$1"), (player) => (
                            window.FBInstant.player.getID() === player.id
                        ));
                        if (friend.length > 0) {
                            setUsedPlayers([...usedPlayers, friend[0].id]);
                        }
                    })
            });
    }

    function sendAskUpdate() {

        let payload = {
            action: 'CUSTOM',
            cta: {
                default: "Help",
                localizations: {
                    en_US: 'Help',
                    es_LA: 'Ayudar',
                    pt_BR: 'Ajudar'
                }
            },
            text: {
                default: playerName + ' asked you to bail him out of jail.',
                localizations: {
                    en_US: playerName + ' asked you to bail him out of jail.',
                    es_LA: '\u00A1' + playerName + ' te pidió que lo saques de la cárcel.',
                    pt_BR: playerName + ' está precisando da sua ajuda para escapar da cadeia!'
                }
            },
            template: 'bail_out_ask',
            data: {
                uniqId: GameService.makeId(),
                coins: rewardCoins,
                action: "bailout",
                playerID: window.FBInstant.player.getID(),
                playerName: window.FBInstant.player.getName(),
                photo: window.FBInstant.player.getPhoto()
            },
            strategy: 'IMMEDIATE_CLEAR',
            notification: 'PUSH',
            image: images.rsz_ask_for_bail_out
        };

        setTotalFriendsAsked(totalFriendsAsked + 1);
        return window.FBInstant.updateAsync(payload).then(function () {
            console.log('POSTADO!!!');
        }).catch(function (error) {
            setTotalFriendsAsked(totalFriendsAsked - 1);
            console.error('Message was not posted: ' + error.message);
        });


    }

    function askHelp(player) {

        function getContext() {
            if (window.FBInstant.context.getType() === "SOLO") {
                return window.FBInstant.context.createAsync(player.id);
            } else {
                return Promise.resolve(window.FBInstant.context.getPlayersAsync()
                    .then(function (players) {
                        let found = _.findWhere(_.pluck(players, "$1"), { id: player.id });
                        if (found) {
                            return window.FBInstant.context;
                        }
                        else {
                            console.log("Changing context...", player.id)
                            return window.FBInstant.context.createAsync(player.id).catch((reason) => {
                                if (reason.code === "SAME_CONTEXT") {
                                    console.log("Same context, all right...")
                                    return Promise.resolve(window.FBInstant.context)
                                }
                            });
                        }
                    }))

            }
        }

        getContext(player.id)
            .then(function () {
                sendAskUpdate();
                setUsedPlayers([...usedPlayers, player.id]);

                let contextID = window.FBInstant.context.getID();
                if (usedContexts.indexOf(contextID) === -1) {
                    setUsedContexts([...usedContexts, contextID])
                }


            }).catch((reason) => {
                console.error(reason)
            });

    }

    return (
        <>
            <Modal visibility={visibility}>
                <ContainerSuccess color="#f28403">
                    <TopText>Hey, {playerName}!<br /><br />
                    ALL IS NOT LOST! IF ANY FRIEND BAILS YOU OUT OF JAIL, YOU WILL SPLIT THE PROFITS AND EACH GET <b> {rewardCoins} COINS</b>.
                </TopText>
                    <div>
                        {
                            loading ?
                                <TopText style={{ textAlign: "center", position: "absolute", top: "50%", left: "calc(50% - 135px)" }}>Loading..</TopText>
                                :
                                friends.length === 0 ?
                                    <TopText>Unfortunatly you don't have friends who play yet.<br />But you can yet invite them to help you now!</TopText>
                                    : friends.map((player) => (
                                        <BlockItem>
                                            <div className="content">
                                                <div className={"playerInfo"}>
                                                    <FigureItem theme="blue">
                                                        <img src={player.photo} />
                                                    </FigureItem>
                                                    <DescriptionItem>
                                                        <span>
                                                            <strong>{player.name}</strong>
                                                        </span>
                                                    </DescriptionItem>
                                                </div>
                                                {
                                                    usedPlayers.indexOf(player.id) > -1 ? (
                                                        <ButtonBuy disabled={true} style={{ filter: "grayscale(1)" }}>
                                                            WAITING ANSWER
                                                        </ButtonBuy>
                                                    )
                                                        :
                                                        <ButtonBuy onClick={() => askHelp(player)}>
                                                            ASK FOR HELP!
                                            </ButtonBuy>
                                                }
                                            </div>
                                        </BlockItem>
                                    ))
                        }

                        <BlockItem style={{ marginTop: "15px" }}>
                            <div className="content">
                                <div className={"playerInfo"}>
                                    <FigureItem theme="blue">
                                        <img src="images/ui/mainmenu/button_add_friends.png" />
                                    </FigureItem>
                                    <DescriptionItem>
                                        <span>
                                            <strong>Invite new friends</strong>
                                        </span>
                                        <span style={{ textAlign: "left", fontSize: "12px" }}>
                                            <strong style={{ color: "#ecaa5c" }}>FOR DOUBLE THE PROFITS!</strong>
                                        </span>
                                    </DescriptionItem>
                                </div>

                                <ButtonBuy onClick={() => invite()}>
                                    INVITE
                                </ButtonBuy>

                            </div>
                        </BlockItem>

                    </div>
                    {/* <img className={"dividerImg"} src={"images/ui/in_game_UI/pop_up_complete/dashed_divider.png"} /> */}

                    <br />
                    {
                        usedPlayers.length > 0 ?
                            <TopText>
                                You asked {usedContexts.length} friend{usedContexts.length == 1 ? "" : "s"} to make your bail.
                            </TopText>
                            : null
                    }
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <BackButton onClick={onBackPressed} />
                        {
                            usedPlayers.length > 0 ?
                                <ButtonGradientMedium bordertop="#8bc34a" style={{ marginLeft: "20px" }} onClick={gotoBack}>
                                    <span>Go to Jail</span>
                                    <span style={{ position: "absolute", fontSize: "9px", left: "35px", top: "30px", color: "white" }}>
                                        and wait for bail
                                    </span>
                                </ButtonGradientMedium>
                                : null
                        }
                    </div>


                </ContainerSuccess>
            </Modal>


            {/* <Modal visibility={true}>
                <ContainerSuccess color="#f28403">
                    <TopText>
                        Want more?<br/>
                        <br />
                        Share it as you can reach more people!
                    </TopText>

                    <BackButton onClick={onBackPressed} />
                </ContainerSuccess>
            </Modal > */}
        </>
    )
}