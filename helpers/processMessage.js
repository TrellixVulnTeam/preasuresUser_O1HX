const API_AI_TOKEN = 'd14a9785b2c947dea91b82a4742679d5';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAAE30GqzORwBADyFcSJKHu09c3uLTRmmJ8ic4J2Cicz16Jij3wFmPtKZBY0lR28uZCYyYfg6MBOjSb8FZC6EuOLUPk5MGRUAB4tpwV8f0BgAn3vr5t4Tl8iSSbFIgmJfZASdKWjZC0vZBdzgnguseP6mjHpPAd3lwPHNRSkGvgAAZDZD';
const request = require('request');
const moment = require('moment');

const fireDB = require('./../controllers/firebaseController');

var resultFromDialogflow = '';
var numMovies = 0;

const sendBotIsTyping = (senderId, type) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: FACEBOOK_ACCESS_TOKEN
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                sender_action: type
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
                reject(true);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
                reject(true);
            }
            resolve(true);
        });
    });
}

const sendMovieTemplate = (senderId, elements) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: FACEBOOK_ACCESS_TOKEN
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'generic',
                            elements: elements
                        }
                    }
                },
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
                reject(true);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
                reject(true);
            }
            resolve(true);
        });
    });
};

const sendTextMessage = (senderId, text) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: FACEBOOK_ACCESS_TOKEN
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: text,
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
                reject(true);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
                reject(true);
            }
            resolve(true);
        });
    });
};

const sendQuickReplie = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: text,
                quick_replies: [{
                        content_type: "text",
                        title: "Si",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "No",
                        payload: "<POSTBACK_PAYLOAD>"
                    }
                ]
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

const sendInitialQuickReplie = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: text,
                quick_replies: [{
                        content_type: "text",
                        title: "Ver ofertas",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Ver peliculas",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Nada. Gracias!",
                        payload: "<POSTBACK_PAYLOAD>"
                    }
                ]
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

const sendCategoryQuickReplie = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: text,
                quick_replies: [{
                        content_type: "text",
                        title: "Moda",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Tecnologia",
                        payload: "<POSTBACK_PAYLOAD>"
                    }
                ]
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

const sendFilterMoviesQuickReplie = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: text,
                quick_replies: [{
                        content_type: "text",
                        title: "Mas valoradas",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Menos valoradas",
                        payload: "<POSTBACK_PAYLOAD>"
                    },
                    {
                        content_type: "text",
                        title: "Mas nuevas",
                        payload: "<POSTBACK_PAYLOAD>"
                    },
                    {
                        content_type: "text",
                        title: "Menos nuevas",
                        payload: "<POSTBACK_PAYLOAD>"
                    },
                    {
                        content_type: "text",
                        title: "Nada. Gracias!",
                        payload: "<POSTBACK_PAYLOAD>"
                    }
                ]
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

const sendShowMoreMoviesQuickReplie = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: text,
                quick_replies: [{
                        content_type: "text",
                        title: "Mostrar peliculas",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Buscar...",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Que va!",
                        payload: "<POSTBACK_PAYLOAD>"
                    }
                ]
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

const sendInitialResponse = (senderId) => {
    sendBotIsTyping(senderId, 'typing_on').then((res) => {
        const initialPhrase = 'Me puedes pedir estas cosas: \n - Ver ofertas \n - Ver peliculas';
        sendTextMessage(senderId, {
            text: initialPhrase
        }).then((res) => {
            const phrase = '¿Qué quieres hacer?';
            sendInitialQuickReplie(senderId, phrase);
        });
    });
}

const sendResponse = (senderId, response) => {
    console.log('-------------------------------------------------------------');
    console.log('-------------------------RESPONSE----------------------------');
    console.log('-------------------------------------------------------------');
    console.log(response);
    console.log('-------------------------------------------------------------');
    console.log('-------------------------SEND RESPONSE-----------------------');
    if (response.result.metadata['intentName'] === 'Default Welcome Intent') {
        console.log("WELCOME");
        sendInitialResponse(senderId);
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Offers') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            const phrase = 'Tengo las ofertas clasificadas por categorias. Selecciona una xfi 🤙:';
            sendCategoryQuickReplie(senderId, phrase);
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            console.log('***********************GET MOVIES************************')
            const phrase = 'Tengo muchas peliculas! ¿Quieres que te las enseñe? 😏 \n O si prefieres, selecciona una opcion:';
            sendShowMoreMoviesQuickReplie(senderId, phrase);
            /*
            const phrase = 'Tengo las peliculas clasificadas por categorias. Selecciona una xfi 🤙:';
            sendCategoryQuickReplie(senderId, phrase);
            */
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies - Show Movies') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            const phrase = 'Tengo las peliculas clasificadas. Selecciona una xfi 🤙:';
            sendFilterMoviesQuickReplie(senderId, phrase);
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies - Show Movies - By Category') {
        //Only year and score
        var filters = {
            category: "",
            mode: ""
        };

        if (response.result['parameters']['Categoria'] !== undefined && response.result['parameters']['Categoria'] !== null) {
            filters.category = response.result['parameters']['Categoria'];
        } else if (response.result['parameters']['MoreLess'] !== undefined && response.result['parameters']['MoreLess'] !== null) {
            filters.category = response.result['parameters']['MoreLess'];
        }

        console.log('*******************GETTING MOVIES*******************');

        fireDB.getMovies(numMovies, filters).then((resMovies) => {
            var resultParsered = JSON.stringify(resMovies);
            sendMovieTemplate(senderId, resMovies).then((res) => {
                const phrase = 'Tengo mas peliculas! ¿Quieres que te enseñe cuales? 😏';
                sendShowMoreMoviesQuickReplie(senderId, phrase);
            })
        }).catch((err) => {
            sendBotIsTyping(senderId, 'typing_on').then((res) => {
                const phrase = 'Vaya, hay un fallo en las tripas del server 😔';
                sendTextMessage(senderId, {
                    text: phrase
                }).then((res) => {
                    sendInitialResponse(senderId);
                });
            });
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies - Find Movie - Name Movie') {
        console.log('*******************NAME MOVIE*******************');
        console.log(response);

        const nameMovie = response.result['parameters']['Pelicula'];
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            //FIND MOVIE
            sendMovieTemplate(senderId, {
                text: {
                    title: nameMovie,
                    subtitle: "https://www.plusdede.com/peli/deadpool",
                    image_url: "https://cdn0.plusdede.com/cdn/media/peli/5/7/9/3/4-medium.jpg?v=0"
                }
            }).then((res) => {
                sendLastResponse(senderId);
            });
        });

        /*
        //FIND MOVIE IN DB
        fireDB.getMovies(numMovies).then((resMovies) => {
            var resultParsered = JSON.stringify(resMovies);
            sendOneMovieTemplate(senderId, resMovies).then((res) => {
                const phrase = 'Aquí la tienes ';
            })
        }).catch((err) => {
            sendBotIsTyping(senderId, 'typing_on').then((res) => {
                const phrase = 'Vaya, hay un fallo en las tripas del server 😔';
                sendTextMessage(senderId, {
                    text: phrase
                }).then((res) => {
                    sendInitialResponse(senderId);
                });
            });
        });
        */
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies - yes') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            const phrase = 'Tengo mas peliculas! ¿Quieres que te enseñe cuales? 😏:';
            sendShowMoreMoviesQuickReplie(senderId, phrase);
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies - no') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            sendLastResponse(senderId);
        });
    }
}

const sendLastResponse = (senderId) => {
    sendBotIsTyping(senderId, 'typing_on').then((res) => {
        const phrase = '!Si quieres algo más, no dudes en volver a escribirme!';
        sendTextMessage(senderId, {
            text: phrase
        });
    });
}

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    console.log('------------------------------------------------------------');
    console.log('-------------------------REQUEST----------------------------');
    console.log('------------------------------------------------------------');
    console.log(message);
    console.log('------------------------------------------------------------');

    const apiaiSession = apiAiClient.textRequest(message, {
        sessionId: 'sizlesbotics_bot'
    });
    apiaiSession.on('response', (response) => {
        if (response !== null && response !== '') {
            resultFromDialogflow = response.result.fulfillment.speech;
            console.log(resultFromDialogflow);

            sendBotIsTyping(senderId, 'typing_on').then((res) => {
                sendTextMessage(senderId, {
                    text: resultFromDialogflow
                }).then((res) => {
                    sendResponse(senderId, response);
                });
            });
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};