import { newFakeMapper } from '../mapper/FakeMapper'
import { sortScores, calculateSeats } from './map'
import { etlPartylistData } from './partylist'

import * as tempParties from '../masterData/partyMap.json'
import * as tempProvinces from '../masterData/provinceMap.json'

const provinceData: any = tempProvinces
const partyData: any = tempParties

// remove key `default` from importing using *
delete partyData.default
delete provinceData.default

export async function etlOverallData() {
    const mapper = newFakeMapper()
    const scores = await mapper.fetchScores()
    const seats = calculateSeats(sortScores(scores))

    const partylistData = await etlPartylistData()
    const partylistMap = listToMap(partylistData, 'partyName')

    return Object.keys(seats)
        .map(partyId => {
            const { codeEN, name, logoUrl } = partyData[partyId]
            const partylist = partylistMap[name]
            const constituencyCandidates = seats[partyId].map((c: any) => {
                const { title, firstName, lastName, zone } = c
                const [provinceId, zoneNo] = zone.split(':')
                return {
                    candidate: `${title} ${firstName} ${lastName}`,
                    picture: '',
                    zone: `${provinceData[provinceId].code}:${zoneNo}`,
                }
            })

            return {
                partyCode: codeEN,
                partyName: name,
                picture: logoUrl,
                partylistSeats: partylist ? partylist.seats : 0,
                constituencySeats: constituencyCandidates.length,
                constituencyCandidates,
            }
        })
        .sort((a, b) =>
            a.constituencySeats + a.partylistSeats >
            b.constituencyCandidates + b.partylistSeats
                ? -1
                : 1
        )
}

function listToMap(list: any[], key: string) {
    return list.reduce(
        (map, elem) => {
            map[elem[key]] = elem
            return map
        },
        {} as any
    )
}
