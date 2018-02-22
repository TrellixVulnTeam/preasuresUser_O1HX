const admin = require("firebase-admin");
const request = require("request");
const fs = require('fs');
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
    getMovies: function (numMovies, filters) {
        return new Promise((resolve, reject) => {
            if (filters.category === "") {
                filters.category = 'score'
            }
            if (filters.mode === "") {
                filters.mode = 'desc'
            } else if (filters.category === "asc") {
                filters.category = ''
            }

            console.log('************************************************************');
            console.log('**********************SEARCH MOVIES*************************');
            console.log('************************************************************');
            console.log(filters);
            console.log('************************************************************');

            const docRef = db.collection('movies');
            docRef.orderBy(filters.category, filters.mode).limit(10).get().then((snapshot) => {
                console.log(snapshot);
                var docsFound = [];
                snapshot.forEach((doc) => {
                    console.log(doc);
                    var json = {
                        title: "",
                        image_url: "",
                        subtitle: ""
                    };
                    const data = doc.data();

                    json.title = data.title;
                    json.image_url = data.image_url;
                    json.subtitle = data.link;

                    docsFound.push(json);
                });
                const jsonFormatted = JSON.stringify(docsFound);
                resolve(jsonFormatted);
            }).catch((err) => {
                console.log('Error to get document: ' + err);
                reject(err);
            });

            /*
            this.getMoviesFromApiAndParseToFirebase().then((resMovies, error) => {
                if (resMovies !== undefined && resMovies !== null && resMovies.length > 0) {
                    resolve(resMovies);
                }
                reject(error);
            })
            */

        });
    },

    getMoviesFromApiAndParseToFirebase: function () {
        console.log('-----------------------getMoviesFromApiAndParseToFirebase--------------------------------');
        return new Promise((resolve, reject) => {
            var options = {
                url: 'https://sizleapimovies.herokuapp.com'
            };
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    var promisesArr = [];
                    fs.writeFile("bbddPordede.json", body, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log("The file was saved!");
                    });
                    var moviesFound = JSON.parse(body);
                    const docRef = db.collection('movies');
                    if (moviesFound.length > 0) {
                        moviesFound.forEach((movie) => {
                            var newPromise = docRef.add(movie);
                            promisesArr.push(newPromise);
                        });
                    }

                    if (promisesArr.length > 0) {
                        Promise.all(promisesArr).then((res) => {
                            console.log('All movies added!!!!');
                            resolve(moviesFound);
                        }).catch((err) => {
                            reject(err);
                        });
                    } else {
                        reject(true);
                    }
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