import { newFakeMapper } from '../mapper/FakeMapper'
import { sortScores, calculateSeats } from './map'
import { etlPartylistData } from './partylist'
import { CDN_IMGURL } from '../constants'

import * as tempParties from '../masterData/idToPartyMap.json'
import * as tempProvinces from '../masterData/idToProvinceMap.json'
import * as tempConstituency from '../masterData/uniqueKeyToConstituencyMemberMap.json'

const provinceData: any = tempProvinces
const partyData: any = tempParties
const constituencyData: any = tempConstituency

// remove key `default` from importing using *
delete partyData.default
delete provinceData.default
delete constituencyData.default

export async function etlOverallData() {
    const mapper = newFakeMapper()
    const scores = await mapper.fetchScores()
    const partySeats = calculateSeats(sortScores(scores))

    const partylistMap = await etlPartylistData().then(list =>
        listToMap(list, 'partyName')
    )

    return partySeats
        .map(seats => {
            const { codeEN, name } = partyData[`${seats[0].partyId}`]
            const partylist = partylistMap[name]
            const constituencyCandidates = seats.map(seat => {
                const { title, firstName, lastName, zone, provinceId } = seat
                const { code, name: provinceName } = provinceData[
                    `${provinceId}`
                ]
                const guid: string =
                    constituencyData[`${provinceName}:${zone}:${name}`].GUID

                return {
                    candidate: `${title} ${firstName} ${lastName}`,
                    picture: `${CDN_IMGURL}/candidates/${guid.toLowerCase()}.jpg`,
                    zone: `${code}:${zone}`,
                }
            })

            return {
                partyCode: codeEN,
                partyName: name,
                picture: `${CDN_IMGURL}/parties/${codeEN}.png`,
                partylistSeats: partylist ? partylist.seats : 0,
                constituencySeats: constituencyCandidates.length,
                constituencyCandidates,
            }
        })
        .sort(
            (a, b) =>
                b.constituencySeats +
                b.partylistSeats -
                (a.constituencySeats + a.partylistSeats)
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

export async function roughlyEstimateOverall() {
    const mapper = newFakeMapper()
    const parties = await mapper.fetchParties()

    return parties
        .map(party => {
            const { codeEN, name, votesTotal } = party
            return {
                partyCode: codeEN,
                partyName: name,
                picture: `${CDN_IMGURL}/parties/${codeEN}.png`,
                seats: Math.floor(
                    votesTotal /
                        (parseInt(process.env.TOTAL_VOTES || '0') / 500)
                ),
            }
        })
        .sort((a, b) => b.seats - a.seats)
}
