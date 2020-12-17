import axios from '../../utils/axios';
import _ from 'underscore';
import Store from '@/store';
import { Dispatchers as DispatchersUser } from '@/store/ducks/user';

import RsExperienceCalc from '@/stages/game/scripts/utils/rsExperienceCalc';

const services = {

    makeId: () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    getTimesPlayed: () => {
        var app = Store.getState();
        const { timesPlayed } = app.user;
        return timesPlayed;
    },
    incrementTimesPlayed: () => {
        DispatchersUser.incrementPlayedTimes();
    },

    createBailout: (coins) => {
        return axios.post("social/bailout", { total_coins: coins });
    },

    addGuestToBailout: (id, facebook_id, facebook_name, facebook_profile_photo) => {
        var obj = {
            facebook_id: facebook_id,
            facebook_name: facebook_name,
            facebook_profile_photo: facebook_profile_photo
        };

        return axios.post("social/bailout/" + id + "/guest", obj);
    },


    registerFacebook: (facebook_signature, facebook_name, facebook_photourl) => {
        return axios.post("/user/register/facebook", {
            facebook_signature,
            facebook_name,
            facebook_photourl
        });
    },

    calculateMatchCoins: (backpackWorthy, itemsGot, maxLootValue) => {
        var stars = Math.floor((backpackWorthy / maxLootValue) * 3);
        stars = stars === 0 && itemsGot.length > 0 ? 1 : stars;

        var starBonusRatio = 1
        if (stars === 2)
            starBonusRatio = 1.2
        else if (stars >= 3)
            starBonusRatio = 1.5

        return { starBonusRatio: starBonusRatio, stars: stars, coins: Math.round(backpackWorthy * starBonusRatio) };
    },

    hasRewardedBailout: (uniqId) => {
        var app = Store.getState();
        const { rewardedBailout } = app.user;
        return rewardedBailout.indexOf(uniqId) > -1;
    },

    getCurrentPlayerBackpack: () => {
        var app = Store.getState();
        const { backpackId } = app.user;
        return services.getItem(backpackId);
    },

    getNextBackpack: () => {
        let currentBackpackCapacity = services.getCurrentPlayerBackpack().capacity;
        let backpacks = services.getAllItems("Backpack");
        let sortedBackpack = _.filter(_.sortBy(backpacks, (item) => {
            return item.capacity;
        }), (item) => {
            return item.capacity > currentBackpackCapacity;
        });
        return sortedBackpack[0] ? sortedBackpack[0] : false;
    },

    getNextPlayerHat: () => {
        let currentHatPrice = services.getCurrentPlayerHat().price;
        let hats = services.getAllItems("Hat");
        let sortedHat = _.filter(_.sortBy(hats, (item) => {
            return item.price;
        }), (item) => {
            return item.price > currentHatPrice;
        });
        return sortedHat[0] ? sortedHat[0] : false;
    },

    getCurrentPlayerHat: () => {
        var app = Store.getState();
        const { hatId } = app.user;
        return services.getItem(hatId);
    },

    getCurrentPlayerEscapeCar: () => {
        var app = Store.getState();
        const { escapeCarId } = app.user;
        return services.getItem(escapeCarId);
    },

    getItem(id) {
        var items = require("@/stages/game/manifests/items.json");
        return _.findWhere(items, { id: id })
    },

    getAllItems(type) {
        var items = require("@/stages/game/manifests/items.json");
        if (type) {
            items = items.filter((item) => (
                item.type === type
            ));
        }
        return items;
    },

    isInDevMap() {
        let id = Store.getState().gameplay.scenary_manifest.id;
        return id == "devMap";
    },

    getCurrentSceneryTimes() {
        let id = Store.getState().gameplay.scenary_manifest.id;
        let sceneriesPlayed = _.findWhere(Store.getState().user.sceneriesPlayed, { id: id });
        return sceneriesPlayed?.times ?? 0;
    },

    getSceneries() {
        var sceneries = require("@/stages/game/manifests/scenaries.json");
        var store = Store.getState();
        var sceneriesCompleted = store.user.sceneriesCompleted;
        var lastCompleted = true;

        sceneries.forEach(scenery => {
            var found = _.findWhere(sceneriesCompleted, { id: scenery.id });
            if (found) {
                scenery.locked = false;
                scenery.stars = found.stars;
                lastCompleted = true;
            } else if (lastCompleted === true) {
                scenery.locked = false;
                lastCompleted = false;
            }
            if (!window.fbEnv)
                scenery.locked = false;
        });

        return sceneries;
    },
    havePlayerRequiredTool(sceneryId) {
        let inventory = services.getUserInventory();
        let scenery = services.getSceneries().find((scenery) => (
            scenery.id === sceneryId
        ));
        function makeString(arr, finalConjunction = "and", separator = ", ") {
            if (arr.length === 1) return arr[0];
            const firsts = arr.slice(0, arr.length - 1);
            const last = arr[arr.length - 1];
            return firsts.join(separator) + ' ' + finalConjunction + ' ' + last;
        }

        var andGroupResults = [];
        if (!scenery.requiredTools) return { result: true };

        scenery.requiredTools.forEach((orGroup) => {

            var lastTest = false;
            var fullName = makeString(_.map(orGroup, (itemId) => (
                services.getItem(itemId).name
            )), "or");


            orGroup.forEach(itemId => {
                if (_.find(inventory, { id: itemId }))
                    lastTest = true

            });

            andGroupResults.push({ fullName: fullName, result: lastTest });
        });
        let finalResult = !!!_.find(andGroupResults, { result: false });
        let neededToolsMessage = makeString(_.pluck(_.where(andGroupResults, { result: false }), "fullName"), "and", "\n");
        let obj = { result: finalResult, neededToolsMessage, tests: andGroupResults }

        console.log(obj)
        return obj;
    },

    canOpenAvailableShop() {
        return Store.getState().user.coins > 30 && Store.getState().user.tutorialUpgradesDone === false;
    },

    doTransactionShop(itemid, amount) {
        let item = services.getItem(itemid);
        if (!item)
            throw new Error("Item ID " + itemid + " not found.");
        let userCoins = Store.getState().user.coins;
        let price = item.price;
        if (price <= userCoins) {
            DispatchersUser.addUserCoins(price * -1);

            if (item.type === "Tool") {
                DispatchersUser.addUserInventory(itemid, 1);
            } else if (item.type === "Backpack") {
                DispatchersUser.setUserBackpack(itemid);
            } else if (item.type === "Hat") {
                DispatchersUser.setUserHat(itemid);
            } else if (item.type === "EscapeCar") {
                DispatchersUser.setUserEscapeCar(itemid);
            } else
                return false;

            window.gameWorld.refreshTools();
            return true;
        } else
            return false;
    },

    getUserInventory: (itemid) => {
        let inventory = Store.getState().user.inventory;
        if (itemid) {
            inventory = _.findWhere(inventory, { id: itemid });
        }
        return inventory;
    },

    getCurrentLevel: () => {
        return Store.getState().user.level;
    },
    getCurrentExperience: () => {
        return Store.getState().user.experience;
    },
    transformXpIntoLevel: () => {
        let currentExp = services.getCurrentExperience();
        var rsExperienceCalc = new RsExperienceCalc();
        return rsExperienceCalc.xp_to_level(currentExp);
    },
    getXpNeededNextLevel: () => {
        var rsExperienceCalc = new RsExperienceCalc();
        var currentLevel = services.getCurrentLevel();
        return rsExperienceCalc.level_to_xp(currentLevel + 1);
    },

    getDateNow: () => {
        let d = new Date();
        let dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()].join('-') + ' ' +
            [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');

        let dtoday = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()].join('-');

        let dateObj = {
            date: dtoday,
            datetime: dformat,
            timestamp: Date.now()
        };

        return dateObj;
    },

    getConsecutiveLoginsDays: () => {
        var today = new Date();
        let lastDayOfThisMonth = (new Date(today.getFullYear(), today.getMonth() + 1, 0)).getDate();
        let dateNow = services.getDateNow();

        //--- For test purposes
        // DispatchersUser.clearUserDayStreak(); //OK!
        // DispatchersUser.addUserDayStreak('2020-11-1', '2020-11-1 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-2', '2020-11-2 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-3', '2020-11-3 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-4', '2020-11-4 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-5', '2020-11-5 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-6', '2020-11-6 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-7', '2020-11-7 00:00:00', Date.now());
        // DispatchersUser.addUserDayStreak('2020-11-8', '2020-11-8 00:00:00', Date.now());
        // return Store.getState().user.daystreak.length;
        //--- end tests

        //dia de hoje já está na lista?
        let days = Store.getState().user.daystreak;
        if (days.length > 0 && days[days.length - 1].date === dateNow.date) {
            console.log("TODAY PRIZE ALREADY GIVEN OR FIRST DAY PLAYING");
            return 0;
        }

        //é o último dia deste mes? Se sim, adiciona hoje, retorna o daystreak.
        if (today.getDate() === lastDayOfThisMonth) {
            console.log("LAST DAY OF THE MONTH");
            DispatchersUser.addUserDayStreak(dateNow.date, dateNow.datetime, dateNow.timestamp);
            return Store.getState().user.daystreak.length;
        }

        //é o primeiro dia do mês? limpa o daystreak, adiciona hoje, retorna o daystreak.
        if (today.getDate() === 1) {
            console.log("FIRST DAY OF THE MONTH");
            DispatchersUser.clearUserDayStreak();
            DispatchersUser.addUserDayStreak(dateNow.date, dateNow.datetime, dateNow.timestamp);
            return Store.getState().user.daystreak.length;
        }

        // - Se dias consecutivos dentro do mês, retorna numero de dias
        //dia anterior está na lista? Se sim, adiciona hoje e retorna o daystreak.
        if (today.getDate() - 1 > 0 && today.getDate() < lastDayOfThisMonth) {
            console.log("CHECKING DAYSTREAK...");
            let days = Store.getState().user.daystreak;

            if (days.length > 0) {
                let lastDay = days[days.length - 1];
                let dayDate = new Date(lastDay.datetime);
                let day = dayDate.getDate();

                if (day === today.getDate() - 1) {
                    console.log("STREAK!");
                    DispatchersUser.addUserDayStreak(dateNow.date, dateNow.datetime, dateNow.timestamp);
                    return Store.getState().user.daystreak.length;
                } else {
                    // - Se pulou um dia, zero a lista e adiciono o atual
                    console.log("ZERO STREAK.");
                    DispatchersUser.clearUserDayStreak();
                    DispatchersUser.addUserDayStreak(dateNow.date, dateNow.datetime, dateNow.timestamp);
                    return 0; //Store.getState().user.daystreak.length;
                }
            } else {
                //primeira vez registrando o dia.
                console.log("FIRST DAY STREAK.");
                DispatchersUser.addUserDayStreak(dateNow.date, dateNow.datetime, dateNow.timestamp);
                return 0;
            }
        }

    }

}

export default services;