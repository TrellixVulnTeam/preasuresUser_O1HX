const API_AI_TOKEN = 'd14a9785b2c947dea91b82a4742679d5';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAAE30GqzORwBADyFcSJKHu09c3uLTRmmJ8ic4J2Cicz16Jij3wFmPtKZBY0lR28uZCYyYfg6MBOjSb8FZC6EuOLUPk5MGRUAB4tpwV8f0BgAn3vr5t4Tl8iSSbFIgmJfZASdKWjZC0vZBdzgnguseP6mjHpPAd3lwPHNRSkGvgAAZDZD';
const request = require('request');
const moment = require('moment');

const fireDB = require('./../controllers/firebaseController');

var resultFromDialogflow = '';

const sendBotIsTyping = (senderId, type) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: senderId },
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

const sendTextMessage = (senderId, text) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: senderId },
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
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: text,
                quick_replies: [
                    {
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
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: text,
                quick_replies: [
                    {
                        content_type: "text",
                        title: "Ver Ofertas",
                        payload: "<POSTBACK_PAYLOAD>",
                    },
                    {
                        content_type: "text",
                        title: "Ver Peliculas",
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
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: text,
                quick_replies: [
                    {
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

const sendResponse = (senderId, response) => {
    console.log('-------------------------------------------------------------');
    console.log('-------------------------RESPONSE----------------------------');
    console.log('-------------------------------------------------------------');
    console.log(response);
    console.log('-------------------------------------------------------------');
    console.log('-------------------------SEND RESPONSE-----------------------');
    if (response.result.metadata['intentName'] === 'Default Welcome Intent') {
        console.log("WELCOME");
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            fireDB.getUsers().then((res) => {
                console.log(res);
            });
            const initialPhrase = 'Me puedes pedir estas cosas: \n - Ver ofertas';
            sendTextMessage(senderId, { text: initialPhrase }).then((res) => {
                const phrase = '¿Qué quieres hacer?';
                sendInitialQuickReplie(senderId, phrase);
            });
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Offers') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            fireDB.getUsers().then((res) => {
                console.log(res);
            });
            const phrase = 'Tengo las ofertas clasificadas por categorias. Selecciona una xfi 🤙:';
            sendCategoryQuickReplie(senderId, phrase);
        });
    }

    if (response.result.metadata['intentName'] === 'Default Welcome Intent - Show Movies') {
        sendBotIsTyping(senderId, 'typing_on').then((res) => {
            fireDB.getMovies().then((res) => {
                console.log(res);
            });
            const phrase = 'Tengo las peliculas clasificadas por categorias. Selecciona una xfi 🤙:';
            sendCategoryQuickReplie(senderId, phrase);
        });
    }
}

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    console.log('------------------------------------------------------------');
    console.log('-------------------------REQUEST----------------------------');
    console.log('------------------------------------------------------------');
    console.log(message);
    console.log('------------------------------------------------------------');

    const apiaiSession = apiAiClient.textRequest(message, { sessionId: 'sizlesbotics_bot' });
    apiaiSession.on('response', (response) => {
        if (response !== null && response !== '') {
            resultFromDialogflow = response.result.fulfillment.speech;
            console.log(resultFromDialogflow);

            sendBotIsTyping(senderId, 'typing_on').then((res) => {
                sendTextMessage(senderId, { text: resultFromDialogflow }).then((res) => {
                    sendResponse(senderId, response);
                });
            });
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};