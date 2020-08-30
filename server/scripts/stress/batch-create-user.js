import http from 'k6/http'
import {sleep} from 'k6';

export let options = {
    stages: [
        {duration: '10s', target: 10}, // below normal load
        {duration: '10s', target: 100}, // below normal load
        {duration: '20s', target: 500}, // spike to 500 users
        {duration: '10s', target: 100}, // scale down. Recovery stage.
        {duration: '10s', target: 0},
    ],
};

export default function () {
    const email = makeid(10) + "@" + makeid(5) + ".com"
    const zip = makeid(4)

    http.batch([

        http.get( 'http://localhost:1337/user/auth'),
        http.post('http://localhost:1337/user', {
            name: "tester",
            email: email,
            zipCode: zip
        })
    ])
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
