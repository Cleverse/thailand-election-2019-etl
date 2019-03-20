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
    const scores = await mapper.scores()
    const partySeats = calculateSeats(sortScores(scores))

    const partylistMap = await etlPartylistData().then(list =>
        listToMap(list, 'partyName')
    )

    return partySeats
        .map(seats => {
            const { codeEN, name, colorCode } = partyData[`${seats[0].partyId}`]
            const partylist = partylistMap[name]
            const constituencyCandidates = seats.map(seat => {
                const { title, firstName, lastName, zone, provinceId } = seat
                const { code, name: provinceName } = provinceData[
                    `${provinceId}`
                ]
                const constituency =
                    constituencyData[`${provinceName}:${zone}:${name}`]
                const imgName: string = constituency
                    ? `${constituency.GUID}.jpg`
                    : 'placeholder.png'

                return {
                    candidate: `${title} ${firstName} ${lastName}`,
                    picture: `${CDN_IMGURL}/candidates/${imgName.toLowerCase()}`,
                    zone: `${code}:${zone}`,
                }
            })

            return {
                partyCode: codeEN,
                partyName: name,
                color: `#${colorCode}`,
                picture: `${CDN_IMGURL}/parties/${name}.png`,
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
    const provinces = await mapper.provinces()
    const scores = await mapper.scores()
    const partySeats = calculateSeats(sortScores(scores))

    const invalidVotes = provinces.reduce((sum, province) => {
        const { badVotes, noVotes } = province
        return badVotes + noVotes + sum
    }, 0)
    const TOTAL_VOTES = parseInt(process.env.TOTAL_VOTES as string)
    const totalVotes = TOTAL_VOTES
        ? TOTAL_VOTES + invalidVotes
        : provinces.reduce((sum, province) => sum + province.votesTotal, 0)

    return partySeats
        .map(seats => {
            const { codeEN, name, colorCode } = partyData[`${seats[0].partyId}`]
            const votes = seats.reduce((sum, seat) => sum + seat.score, 0)

            return {
                partyCode: codeEN,
                partyName: name,
                color: `#${colorCode}`,
                picture: `${CDN_IMGURL}/parties/${name}.png`,
                seats: Math.floor(votes / (totalVotes / 500)),
            }
        })
        .sort((a, b) => b.seats - a.seats)
}
