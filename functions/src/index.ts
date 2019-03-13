import { https } from 'firebase-functions'
import * as mapData from './map.json'
import * as partyListData from './partyList.json'

export const map = https.onRequest((_, res) => {
    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(mapData))
    res.end()
})

export const partyList = https.onRequest((_, res) => {
    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(partyListData))
    res.end()
})
