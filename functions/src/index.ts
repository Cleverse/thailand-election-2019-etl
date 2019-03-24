import dotenv from 'dotenv'
import { https } from 'firebase-functions'
import { Storage } from '@google-cloud/storage'
import hash from 'object-hash'

import { calculateTotalVotesFromEct } from './util'
import { invalidateCache } from './util/cache'
import { etlMapData } from './etl/map'
import { etlPartylistData } from './etl/partylist'
import { etlOverallData, roughlyEstimateOverall } from './etl/overall'

interface IVersion {
    hash: string
    timestamp: number
}

dotenv.config()

const bucketName = 'thailand-election-2019.appspot.com'
const storage = new Storage()

export const main = https.onRequest(async (_, res) => {
    const mapData = await etlMapData()
    const partylistData = await etlPartylistData()
    const overallData = await etlOverallData()

    const now = Date.now()
    const fileStream = storage
        .bucket(bucketName)
        .file(`data/${now}.json`)
        .createWriteStream(buildOptions(3600))
    const latestStream = storage
        .bucket(bucketName)
        .file(`data/latest.json`)
        .createWriteStream(buildOptions(30))

    const { percentage } = mapData.overview
    const totalVotesFromEct = await calculateTotalVotesFromEct()
    const response = {
        map: mapData,
        partylist: partylistData,
        overall: overallData,
        partylistHidden: process.env.FORCE_PRE70PERCENT || percentage < 70,
        pre70Overall:
            process.env.FORCE_PRE70PERCENT || percentage < 70
                ? await roughlyEstimateOverall()
                : null,
        timestamp: now,
        hash: '',
        totalVotesFromEct,
    }

    const versionFile = await storage
        .bucket(bucketName)
        .file('data/version.json')

    const version: IVersion = await versionFile
        .download()
        .then(buffer => JSON.parse(buffer.toString()))

    const newHash = hash(response, {
        excludeKeys: key =>
            key === 'timestamp' ||
            key === 'partylistHidden' ||
            key === 'pre70Overall' ||
            key === 'hash',
    })

    response.hash = newHash
    const jsonResponse = JSON.stringify(response)
    const versionStream = versionFile.createWriteStream(buildOptions(0))
    const jsonVersion = JSON.stringify({ hash: newHash, timestamp: now })

    await Promise.all([
        writeAsync(fileStream, jsonResponse).then(endAsync),
        writeAsync(latestStream, jsonResponse).then(endAsync),
    ])
    await invalidateCache()
    await writeAsync(versionStream, jsonVersion).then(endAsync)

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
    return new Promise<NodeJS.WritableStream>((resolve, reject) => {
        stream.write(json, err => {
            if (err) {
                reject(err)
            } else {
                resolve(stream)
            }
        })
    })
}

async function endAsync(stream: NodeJS.WritableStream) {
    return new Promise(resolve => {
        stream.end(() => {
            resolve(stream)
        })
    })
}

function buildOptions(expireSec: number) {
    return {
        contentType: 'application/json',
        gzip: true,
        resumable: false,
        metadata: {
            cacheControl: `public, max-age=${expireSec}`,
        },
    }
}
