const API_AI_TOKEN = 'cc7dceb2a6b74ca2ac0d0e0dc42374f3';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAACmQIVgxGMBAB1G7i82xULBrliyZAtIqkp7UXpiZBcSAhOCWiprJUrWiKzSpozWwZCLaueEIXQyDJ3J3KbmcBBu4XIkZBSV7qUls77pwaLajtLZA6Huh0aAtpNi4ZB6sWt997mLeS7tkkAt9KY1WyALymef6gBvg5frgbJPsJ8AZDZD';
const request = require('request');
const moment = require('moment');

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

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    console.log('------------------------------------------------------------');
    console.log('-------------------------REQUEST----------------------------');
    console.log(message);
    const apiaiSession = apiAiClient.textRequest(message, { sessionId: 'sizlesbotics_bot' });
    apiaiSession.on('response', (response) => {
        if (response !== null && response !== '') {
            console.log('------------------------------------------------------------');
            console.log('-------------------------RESPONSE----------------------------');
            console.log(response);

            const resultFromDialogflow = response.result.fulfillment.speech;
            console.log(resultFromDialogflow);
            sendBotIsTyping(senderId, 'typing_on').then((res) => {
                sendTextMessage(senderId, { text: resultFromDialogflow });
                //sendTextMessage(senderId, { text: 'Si quieres volver a hacer una peticion, escribe o vuelve a saludarme. 😝' });
            });
        }
    });
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};