export default class FacebookStorage {

    static getItem(key, callback) {
        return new Promise((resolve) => {
            window.FBInstant.player.getDataAsync([key]).then((data) => {
                if (callback) {
                    callback(null, data[key]);
                }
                resolve(data[key]);
            });
        })
    }
    
    static setItem(key, value, callback) {
        return new Promise((resolve) => {
            var dataset = {};
            dataset[key] = value;
            window.FBInstant.player.setDataAsync(dataset).then(() => {
                if (callback) {
                    callback(null);
                }
                resolve(null);
            });
        });
    }

    static removeItem(key, callback) {
        return new Promise((resolve) => {
            var dataset = {};
            dataset[key] = null;
            window.FBInstant.player.setDataAsync(dataset).then(() => {
                if (callback) {
                    callback(null);
                }
                resolve(null);
            });
        });
    }


}