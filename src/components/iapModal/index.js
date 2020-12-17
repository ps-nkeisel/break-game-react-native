import React, { useState, useEffect } from 'react';
import Modal from '../modal';
import {
    ContainerSuccess, ButtonBuy, BackButton, ButtonGradientMedium
} from '../../styles/style';
import GameService from '@/stages/game/scripts/core/services/GameService';
import _ from 'underscore'
import images from '@/stages/game/manifests/images.json';
import { Dispatchers } from '@/store/ducks/user';
import ads from '@/stages/game/scripts/core/ads';

import {
    BlockItem, FigureItem, DescriptionItem, TopText
} from './styles';


export default function (props) {
    const { visibility, onGoBack } = props;

    let playerName = window.FBInstant.player.getName();

    const [purchasingSupported, setPurchasingSupported] = useState(false);

    const [loading, setLoading] = useState(true);

    const [iapProducts, setIapProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    function getProducts() {
        var supportedAPIs = window.FBInstant.getSupportedAPIs();
        if (supportedAPIs.includes("payments.purchaseAsync")) {
            setPurchasingSupported(true);
            window.FBInstant.payments.onReady(function () {
                console.log('Payments Ready!');
                //document.getElementById("divTest").innerHTML = 'Payments Ready!';

                window.FBInstant.payments.getCatalogAsync().then(function (catalog) {
                    setLoading(false);
                    // catalog contains an array of products
                    console.log("Products:", catalog);
                    setIapProducts(catalog);
                    //document.getElementById("divTest").innerHTML = JSON.stringify(catalog);
                }).catch(function (err) {
                    // There was an error
                    console.log(err.message);
                    //document.getElementById("divTest").innerHTML = err.message;
                });
            });
        } else {
            setLoading(false);
            console.log("Purchases not supported on platform.");
            //document.getElementById("divTest").innerHTML = ("Purchases not supported on platform.");
        }
    }

    function buyIapProduct(product) {
        window.FBInstant.payments.purchaseAsync({
            productID: product.productID,
            developerPayload: "payload",
        }).then(function (purchase) {
            // Purchase success (purchaseToken is available in purchase)
            // As they are all coins, consume right now:
            window.FBInstant.payments.consumePurchaseAsync(purchase.purchaseToken)
                .then(function () {
                    // Product consumed
                    console.log("Product consumed.");
                    onGoBack();
                    let coins = parseInt(product.title);
                    Dispatchers.addUserCoins(coins);
                }).catch(function (e) {
                    // Error occurred
                    console.log(e.message);
                });

        }).catch(function (err) {
            // Purchase failed
            console.log(err.message);
        });
    }

    function buyProduct(product) {
        ads.IAP.CoinsRewardedVideo.show().then(() => {
            //setShowDoubleCoinsFeedback(true);
            //setHasRewardAds(false);
            console.log("BUY WITH ADS OK!");
            onGoBack();
            Dispatchers.addUserCoins(50);
        });
    }

    function getIapProductsList() {
        /*let IapProducts = [
            {
                title: '50 coins', // string Product title
                productID: '50_coins', // string Product ID
                description: 'buy 50 coins', // string? Product description
                imageURI: 'images/ui/popup_login_streak/streack_icons_512px/coins_icon.png', // string? A link to the products icon
                price: '0.99', // string Product price
                priceCurrencyCode: 'BRL' // string Currency code for the product
            },
            {
                title: '150 coins', // string Product title
                productID: '150_coins', // string Product ID
                description: 'buy 150 coins', // string? Product description
                imageURI: 'images/ui/popup_login_streak/streack_icons_512px/coins_icon.png', // string? A link to the products icon
                price: '2.99', // string Product price
                priceCurrencyCode: 'BRL' // string Currency code for the product
            }
        ];*/
        return (
            iapProducts.map((product) => (
                <BlockItem style={{ marginTop: "15px" }}>
                    <div className="content">
                        <div className={"playerInfo"}>
                            <FigureItem theme="blue">
                                <img src={product.imageURI} />
                            </FigureItem>
                            <DescriptionItem>
                                <span style={{ textAlign: "left" }}>
                                    <strong>{product.title}</strong>
                                </span>
                            </DescriptionItem>
                        </div>

                        <ButtonBuy onClick={() => buyIapProduct(product)}>
                            {product.price}
                        </ButtonBuy>

                    </div>
                </BlockItem>
            ))
        )
    }

    function getAdProductsList() {
        return (
            <BlockItem style={{ marginTop: "15px" }}>
                <div className="content">
                    <div className={"playerInfo"}>
                        <FigureItem theme="blue">
                            <img src="images/ui/popup_login_streak/streack_icons_512px/coins_icon.png" />
                        </FigureItem>
                        <DescriptionItem>
                            <span style={{ textAlign: "left" }}>
                                <strong>50 coins</strong>
                            </span>
                        </DescriptionItem>
                    </div>

                    <ButtonBuy onClick={() => buyProduct()}>
                        Watch AD
                    </ButtonBuy>

                </div>
            </BlockItem>
        );
    }

    return (
        <>
            <Modal visibility={visibility}>
                <ContainerSuccess color="#f28403">
                    <TopText>Hey, {playerName}!<br />
                    </TopText>
                    <div>
                        {
                            loading ?
                                <TopText style={{ textAlign: "center", position: "absolute", top: "50%", left: "calc(50% - 135px)" }}>Loading..</TopText>
                                :
                                (
                                    purchasingSupported ?
                                        <TopText>How about to buy some coins to upgrade your player?</TopText>
                                        :
                                        <TopText>Whatch an AD and earn some coins!</TopText>
                                )
                        }

                        {
                            purchasingSupported ? getIapProductsList() : getAdProductsList()
                        }

                    </div>
                    <br />
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <BackButton onClick={onGoBack} />
                    </div>

                </ContainerSuccess>
            </Modal>
        </>
    )
}