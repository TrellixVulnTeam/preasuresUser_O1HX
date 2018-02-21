const admin = require("firebase-admin");
const request = require("request");
var serviceAccount = require("./../preasures-bot-firebase-adminsdk-1lkmb-90a46c2444.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://preasures-bot.firebaseio.com"
});

const db = admin.firestore();
console.log('************************************************************');
console.log('**********************INIT FIREBASE*************************');
console.log('************************************************************');
module.exports = {
    getMovies: function () {
        return new Promise((resolve, reject) => {
            const docRef = db.collection('movies');
            docRef.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (!doc.exists) {
                        console.log('No doc');
                        reject('No doc');
                    } else {
                        resolve(doc.data());
                    }
                })
            }).catch((err) => {
                console.log('Error to get document: ' + err);
                reject(err);
            });
        });
    },

    getMoviesFromApiAndParseToFirebase: function () {
        return new Promise((resolve, reject) => {
            var options = {
                url: 'https://sizleapimovies.herokuapp.com'
            };
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    var moviesFound = JSON.parse(body);

                    resolve(moviesFound);
                    /*
                    const docRef = db.collection('movies');
                    docRef.get().then((snapshot) => {
                        snapshot.forEach((doc) => {
                            if (!doc.exists) {
                                console.log('No doc');
                                reject('No doc');
                            } else {
                                resolve(doc.data());
                            }
                        })
                    }).catch((err) => {
                        console.log('Error to get document: ' + err);
                        reject(err);
                    });
                    */
                } else {
                    reject(error);
                }
            });
        });
    },

    getUsers: function () {
        return new Promise((resolve, reject) => {
            const docRef = db.collection('users');
            docRef.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (!doc.exists) {
                        console.log('No doc');
                        reject('No doc');
                    } else {
                        resolve(doc.data());
                    }
                })
            }).catch((err) => {
                console.log('Error to get document: ' + err);
                reject(err);
            });
        });
    }
}