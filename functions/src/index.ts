import { https } from 'firebase-functions'

export const requestHandler = https.onRequest((_, res) => {
    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify({ status: 'ok', message: 'Hello' }))
    res.end()
})
