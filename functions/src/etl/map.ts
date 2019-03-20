import { newFakeMapper } from '../mapper/FakeMapper'
import { IScore } from '../mapper/IMapper'
import { CDN_IMGURL } from '../constants'

import * as tempParties from '../masterData/idToPartyMap.json'
import * as tempProvinces from '../masterData/idToProvinceMap.json'
import * as tempConstituency from '../masterData/uniqueKeyToConstituencyMemberMap.json'

const partyData: any = tempParties
const provinceData: any = tempProvinces
const constituencyData: any = tempConstituency

// remove key `default` from importing using *
delete partyData.default
delete provinceData.default
delete constituencyData.default

export async function etlMapData() {
    const mapper = newFakeMapper()
    const scoresByZone = await mapper.fetchScores().then(sortScores)
    const provinceMap = scoresByZone.reduce(
        (map, scores) => {
            const { provinceId, zone } = scores[0]
            map[provinceId] = map[`${provinceId}`] || {}
            map[provinceId][`${zone}`] = scores
            return map
        },
        {} as any
    )

    const provinces = Object.values(provinceMap).map((province: any) => {
        const zones: Array<IScore[]> = Object.values(province)
        const { code, name } = provinceData[`${zones[0][0].provinceId}`]

        return {
            provinceCode: code,
            provinceName: name,
            zones: Object.values(province).map(mapZone),
        }
    })

    const fetchedProvinces = await mapper.fetchProvinces()
    const fetchedParties = await mapper.fetchParties()

    const sumVotes = fetchedParties.reduce(
        (sum, party) => sum + party.votesTotal,
        0
    )
    const counted =
        sumVotes +
        fetchedProvinces.reduce((sum, province) => {
            const { badVotes, noVotes } = province
            return badVotes + noVotes + sum
        }, 0)

    const partyMap = fetchedParties.reduce(
        (map, party) => {
            map[`${party.id}`] = party
            return map
        },
        {} as any
    )

    const partySeats = calculateSeats(scoresByZone)
    const parties = partySeats.map(seats => {
        const { name, codeEN, colorCode, votesTotal } = partyMap[
            `${seats[0].partyId}`
        ]

        const percentage = sumVotes
            ? Math.round((votesTotal / sumVotes) * 100 * 10) / 10
            : 0

        return {
            partyName: name,
            partyCode: codeEN,
            partyPic: `${CDN_IMGURL}/parties/${name}.png`,
            color: `#${colorCode}`,
            seats: seats.length,
            votes: votesTotal,
            percentage,
        }
    })

    const totalVotes =
        parseInt(process.env.TOTAL_VOTES as string) ||
        fetchedProvinces.reduce((sum, province) => {
            const { badVotes, noVotes } = province
            return sum + badVotes + noVotes
        }, 0) + fetchedParties.reduce((sum, p) => sum + p.votesTotal, 0)

    return {
        provinces,
        overview: {
            counted,
            totalVotes,
            percentage: (counted / totalVotes) * 100,
            ranking: parties,
        },
    }
}

function mapCandidate(item: IScore) {
    const { provinceId, zone } = item
    const { name, codeEN, colorCode } = partyData[`${item.partyId}`]
    const province = provinceData[`${provinceId}`].name
    const tempParty = item.lastName === 'นวะกิจโลหะกูล' ? 'พลังไทยรักไทย' : name
    const constituency = constituencyData[`${province}:${zone}:${tempParty}`]
    const imgName: string = constituency
        ? `${constituency.GUID}.jpg`
        : 'placeholder.png'

    return {
        partyName: tempParty,
        partyCode: codeEN,
        partyPic: `${CDN_IMGURL}/parties/${name}.png`,
        color: `#${colorCode}`,
        candidate: `${item.title} ${item.firstName} ${item.lastName}`,
        score: item.score,
        picture: `${CDN_IMGURL}/candidates/${imgName.toLowerCase()}`,
    }
}

function mapZone(zone: any) {
    const items: IScore[] = zone
    const candidates = items.slice(0, 3).map(mapCandidate)
    return {
        zoneNo: items[0].zone,
        first3Candidates: candidates,
    }
}

export function sortScores(scores: IScore[]) {
    const zoneMap = scores.reduce(
        (map, s) => {
            const key = `${s.provinceId}:${s.zone}`

            map[key] = map[key] || []
            map[key].push(s)
            return map
        },
        {} as any
    )

    return Object.values(zoneMap).map((zone: any) =>
        zone.sort((a: any, b: any) => b.score - a.score)
    ) as Array<IScore[]>
}

export function calculateSeats(zones: Array<IScore[]>) {
    const seatMap = calculateSeatMap(zones)

    return Object.values(seatMap).sort(
        (a: any, b: any) => b.length - a.length
    ) as Array<IScore[]>
}

export function calculateSeatMap(zones: Array<IScore[]>) {
    return zones.reduce(
        (map, zone) => {
            const winner = zone[0]
            const partyId = `${winner.partyId}`
            map[partyId] = map[partyId] || []
            map[partyId].push(winner)
            return map
        },
        {} as any
    )
}
