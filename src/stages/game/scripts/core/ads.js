import { Retrier } from '@jsier/retrier';



class Advertisement {

    static STATUS = {
        UNLOADED: 0,
        LOADING: 1,
        LOADED: 2,
        ERROR: 3
    }

    constructor(type, placementId) {
        this.type = type;
        this.placementId = placementId;
        this.adInstance = null;
        this.status = Advertisement.STATUS.UNLOADED;
        this.lastErrorMessage = null;
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }

    getAdInstance() {
        return new Promise((resolve, reject) => {
            if (!this.adInstance) {
                const { getInterstitialAdAsync, getRewardedVideoAsync } = window.FBInstant;
                console.log("BEFORE TO CREATE INSTANCE " + this.type + "!!!")
                let createAdInstance = this.type === "interstitial" ? getInterstitialAdAsync : getRewardedVideoAsync;

                resolve(Promise.resolve(createAdInstance(this.placementId)).then((instance) => {
                    console.log("CREATED!")
                    return instance;
                }))
            } else {
                resolve(this.adInstance);
            }
        })
    }

    load() {

        const options = { limit: 5, delay: 5000 };
        const retrier = new Retrier(options);

        return retrier
            .resolve((attempts) => this.getAdInstance().then((adInstance) => {
                this.adInstance = adInstance;
                console.log("INSTANCIA CRIADA", this.adInstance)
                this.setStatus(Advertisement.STATUS.LOADING);
                return this.adInstance.loadAsync();
            }).then(() => {
                this.setStatus(Advertisement.STATUS.LOADED);
            }).catch((err) => {
                this.setStatus(Advertisement.STATUS.ERROR);
                this.lastErrorMessage = err.message;
                console.error('Ad failed to preload: ' + err.message);
                throw err;
            }))
    }

    show() {
        if (this.status === Advertisement.STATUS.LOADED) {
            console.log("Opening the ad...")
            setAdsBackgroundVisibility(true);

            return this.adInstance.showAsync().then((result) => {
                console.log("result",result)
                this.setStatus(Advertisement.STATUS.UNLOADED);
                this.adInstance = null;
                setAdsBackgroundVisibility(false);
            }).catch((retorno) => {
                this.adInstance = null;
                this.setStatus(Advertisement.STATUS.UNLOADED);
                setAdsBackgroundVisibility(false);
                throw retorno;
            });
        } else if (this.status === Advertisement.STATUS.UNLOADED) {
            // Show blank screen during the loading
            return this.load().then(() => {
                return this.show();
            });
        }
        else
            return Promise.reject({ message: "ERROR." });
    
    }

}

function setAdsBackgroundVisibility(value) {
    var x = document.getElementById("adsBackground");
    if (value) {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

export default {
    completingScreen: {
        onLoad: new Advertisement("interstitial", "2730084950605312_2808916919388781"),
        doubleCoins: new Advertisement("reward", "2730084950605312_2808962602717546")
    },
    shop: {
        freeCoins: new Advertisement("reward", "2730084950605312_2815000462113760")
    },
    IAP: {
        CoinsRewardedVideo: new Advertisement("reward", "2730084950605312_2842545269359279")
    }
}