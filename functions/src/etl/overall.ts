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
    const partySeats = calculateSeats(sortScores(scores))

    const partylistMap = await etlPartylistData().then(list =>
        listToMap(list, 'partyName')
    )

    return partySeats
        .map(seats => {
            const { codeEN, name, logoUrl } = partyData[`${seats[0].partyId}`]
            const partylist = partylistMap[name]
            const constituencyCandidates = seats.map(seat => {
                const {
                    title,
                    firstName,
                    lastName,
                    zone,
                    provinceId,
                    id,
                } = seat
                return {
                    candidate: `${title} ${firstName} ${lastName}`,
                    picture: `https://cdn.vote.phantompage.com/images/partylist/${id.toLowerCase()}.jpg`,
                    zone: `${provinceData[`${provinceId}`].code}:${zone}`,
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
        .sort(
            (a, b) =>
                b.constituencySeats +
                b.partylistSeats -
                a.constituencySeats -
                a.partylistSeats
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
