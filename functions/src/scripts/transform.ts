import * as fs from 'fs'
import { Parser } from 'csv-parse'

const content = fs.createReadStream('constituency.csv')
const parser = new Parser({})

const output: Array<string[]> = []

parser.on('readable', () => {
    let record
    do {
        record = parser.read()
        output.push(record)
    } while (record)
})

parser.on('error', err => {
    console.log('ERROR', err)
})

parser.on('end', () => {
    const records = output
        .slice(1)
        .filter(record => record && record[11] === 'ประกาศ')
    console.log('length', records.length)
    const constituencyMap = records.reduce(
        (map, record) => {
            const [
                guid,
                province,
                zone,
                no,
                title,
                firstName,
                lastName,
                partyName,
                age,
                education,
                occupation,
                voteable,
            ] = record

            const key = `${province}:${zone}:${partyName}`
            map[key] = {
                guid,
                province,
                zone,
                no,
                title,
                firstName,
                lastName,
                partyName,
                age,
                education,
                occupation,
                voteable,
            }

            return map
        },
        {} as any
    )

    fs.writeFileSync('test.json', JSON.stringify(constituencyMap, undefined, 2))
})

content.pipe(parser)
