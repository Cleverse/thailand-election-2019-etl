import { https } from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const requestHandler = https.onRequest((_, res) => {
    res.status(200)
    res.type('application/json')
    res.write({ status: 'ok', message: 'Hello' })
    res.end()
})
