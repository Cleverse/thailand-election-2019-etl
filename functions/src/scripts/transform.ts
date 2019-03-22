import * as fs from 'fs'
import { Parser } from 'csv-parse'

const content = fs.createReadStream('partylist.csv')
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
    const records = output.slice(1).filter(record => record !== null)
    console.log('length', records.length)
    const partyListMap = records.reduce(
        (map, record) => {
            const name = record[1]
            map[name] = map[name] || {
                name,
                candidates: [] as any,
            }

            map[name].candidates.push({
                id: record[0],
                no: parseInt(record[5]),
                title: record[2],
                firstName: record[3],
                lastName: record[4],
                votable: record[9] === 'ประกาศ',
            })

            return map
        },
        {} as any
    )

    fs.writeFileSync(
        'partylistMap.json',
        JSON.stringify(partyListMap, undefined, 2)
    )
})

content.pipe(parser)
