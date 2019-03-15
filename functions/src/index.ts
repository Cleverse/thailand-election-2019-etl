import { https } from 'firebase-functions'

import { etlMapData } from './etl/map'

export const main = https.onRequest(async (__, res) => {
    res.status(200)
    res.type('application/json')
    res.write('Hello, world!')
    res.end()
})

export const map = https.onRequest(async (__, res) => {
    const mapData = await etlMapData()

    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(mapData))
    res.end()
})
