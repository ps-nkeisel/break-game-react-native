import React, { useState } from 'react'
import {
    ButtonGradientBigger, ButtonBuy, ContainerSuccess
} from '@/styles/style';
import {
    BlockItem, FigureItem, ItemInfo, ModalTutorial, ItemAmount, DescriptionItem,
} from './styles';
import { connect } from 'react-redux';
import GameService from '@/stages/game/scripts/core/services/GameService';
import _ from 'underscore';
import Sound from '@/stages/game/scripts/core/sound';
import ads from '@/stages/game/scripts/core/ads';
import { Dispatchers as UserDispatchers } from '@/store/ducks/user';

import Modal from '@/components/modal/index';

function ItemShop(props) {

    const { upgradeItem, upgrade, item = {}, quantity, coins } = props;
    const { description, stackable, usable_description, name, price, texture_shop = "images/ui/icons_items_all/hat/sky_mask.png" } = item;
    const [isVisible, setVisible] = useState(false);

    const [enabledFeedbackRewardAds, setFeedbackRewardAds] = useState(false);



    const items = require("@/stages/game/manifests/items.json");


    function buyButton(item) {
        const purchase = GameService.doTransactionShop(item.id, 1);
        if (purchase) {
            var soundCoins = new Sound("getCoins", {
                volume: 1
            });
            soundCoins.play();
        }
    }

    function checkPlayerCanBuy(priceItem) {
        return priceItem <= coins;
    }

    function itemImage() {
        let item = _.findWhere(items, { name });
        console.log(item); //texture maps/tools
        return "gameplay/" + item.texture;
    }
    function hasTutorial() {
        return !!_.findWhere(items, { name })?.tutorial_image;
    }
    function itemTutorialImage() {
        let item = _.findWhere(items, { name });
        return "images/ui/in_game_UI/Tutorials_tools/" + item.tutorial_image;
    }

    function itemTutorialDescription() {
        let item = _.findWhere(items, { name });
        return item.tutorial_description;
    }



    function freeCoins() {
        ads.shop.freeCoins.show().then(() => {
            setFeedbackRewardAds(true);
        });
    }
    
    function receiveReward(){
        UserDispatchers.addUserCoins(1000);
        setFeedbackRewardAds(false);
    }
    


    return (
        <>
            <Modal visibility={isVisible}>
                <ModalTutorial onClick={() => setVisible(false)}>
                    <div>
                        <img src={itemImage()} style={{ marginTop: 24 + 'px', marginBottom: -28 + 'px', width: 40 + '%' }} />
                    </div>
                    <span style={{ fontSize: 55 + 'px', fontFamily: 'Sugar', marginBottom: -10 + 'px' }}>{name}</span>
                    <div>
                        <img src={itemTutorialImage()} width="100%" style={{ marginTop: -10 + 'px' }} />
                    </div>
                    <span style={{ fontSize: 22 + 'px', position: "relative", bottom: "35px" }}>{itemTutorialDescription()}</span>
                </ModalTutorial>
            </Modal>
            <BlockItem>
                <div className="content">
                    <FigureItem theme="blue">
                        <img alt={name} src={texture_shop} />
                        {
                            Number.isInteger(quantity) && !upgrade &&
                                <ItemAmount>{quantity}</ItemAmount>
                        }
                        {
                            hasTutorial() &&
                                <ItemInfo data-name={name} onClick={() => { setVisible(true) }}>i</ItemInfo>
                        }
                    </FigureItem>
                    <DescriptionItem>
                        {name}
                        <span>
                            <strong>{description}</strong>
                            <br />
                            {' '}
                            {usable_description}
                        </span>
                    </DescriptionItem>
                </div>
                {
                    item.type === "freecoins" ?
                        <ButtonBuy onPointerUp={freeCoins} >
                            WATCH AD
                        </ButtonBuy>
                        :

                        !stackable && quantity >= 1 ?
                            (
                                <ButtonBuy style={{ filter: "grayscale(1)" }}>
                                    Reached Limit
                                    {' '}
                                </ButtonBuy>
                            ) :

                            upgrade ?
                                upgradeItem ?
                                    <ButtonBuy style={checkPlayerCanBuy(price) ? {} : { filter: "grayscale(1)" }} onPointerUp={() => buyButton(upgradeItem)}>
                                        Upgrade
                        {' '}
                                        <span className="coin">{upgradeItem.price}</span>
                                    </ButtonBuy>
                                    :
                                    <ButtonBuy style={{ filter: "grayscale(1)" }}>
                                        Reached Limit
                        {' '}
                                    </ButtonBuy>

                                :
                                <ButtonBuy style={checkPlayerCanBuy(price) ? {} : { filter: "grayscale(1)" }} onPointerUp={() => buyButton(item)} disabled={true}>
                                    Buy
                        {' '}
                                    <span className="coin">{price}</span>
                                </ButtonBuy>
                }
            </BlockItem>

            <Modal visibility={enabledFeedbackRewardAds}>
                <ContainerSuccess center={true}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <h1 style={{ color: "white", fontSize: "42px" }}>Thank you!</h1>
                        <p style={{ color: "white" }}>Click on the button below to get your prize!</p>
                        <ButtonGradientBigger noborder onClick={receiveReward} >
                            <span>CLAIM</span>
                        </ButtonGradientBigger>
                    </div>
                </ContainerSuccess>
            </Modal>
        </>
    );
}

export default connect((state, ownProps) => {
    let currentItem = ownProps.item;
    let items = state.user.inventory;
    let item = _.findWhere(items, { id: currentItem?.id })
    return {
        quantity: item?.quantity ?? 0,
        coins: state.user.coins
    }
})(ItemShop) 
