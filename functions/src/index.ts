import { https } from 'firebase-functions'
import { Storage } from '@google-cloud/storage'

import { etlMapData } from './etl/map'
import { etlPartylistData } from './etl/partylist'
import { etlOverallData } from './etl/overall'

const bucketName = 'thailand-election-2019.appspot.com'
const storage = new Storage()

export const main = https.onRequest(async (_, res) => {
    const [mapData, partylistData, overallData] = await Promise.all([
        etlMapData(),
        etlPartylistData(),
        etlOverallData(),
    ])

    const now = Date.now()
    const options = {
        contentType: 'application/json',
        gzip: true,
        resumable: false,
        metadata: {
            cacheControl: 'public, max-age=3600',
        },
    }
    const file = storage
        .bucket(bucketName)
        .file(`data/${now}.json`)
        .createWriteStream(options)
    const latest = storage
        .bucket(bucketName)
        .file(`data/latest.json`)
        .createWriteStream(options)

    const jsonResponse = JSON.stringify({
        map: mapData,
        partylist: partylistData,
        overall: overallData,
        timestamp: now,
    })

    await Promise.all([
        writeAsync(file, jsonResponse).then(() => endAsync(file)),
        writeAsync(latest, jsonResponse).then(() => endAsync(latest)),
    ])

    res.status(200)
    res.type('application/json')
    res.write(jsonResponse)
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

export const overall = https.onRequest(async (_, res) => {
    const overallData = await etlOverallData()

    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(overallData))
    res.end()
})

async function writeAsync(stream: NodeJS.WritableStream, json: string) {
    return new Promise((resolve, reject) => {
        stream.write(json, err => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

async function endAsync(stream: NodeJS.WritableStream) {
    return new Promise(resolve => {
        stream.end(() => {
            resolve()
        })
    })
}
