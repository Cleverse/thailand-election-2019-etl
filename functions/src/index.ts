import { https } from 'firebase-functions'

import { etlMapData } from './etl/map'
import { etlPartylistData } from './etl/partylist'

export const main = https.onRequest(async (_, res) => {
    res.status(200)
    res.type('application/json')
    res.write('Hello, world!')
    res.end()
})

export const map = https.onRequest(async (_, res) => {
    const mapData = await etlMapData()

    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(mapData))
    res.end()
})

export const partylist = https.onRequest(async (_, res) => {
    const partylistData = await etlPartylistData()

    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(partylistData))
    res.end()
})
