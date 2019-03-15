import { newFakeMapper } from '../mapper/FakeMapper'
import { IScore } from '../mapper/IMapper'

import * as tempParties from '../masterData/partyMap.json'
import * as tempProvinces from '../masterData/provinceMap.json'

const partyData: any = tempParties
const provinceData: any = tempProvinces

// remove key `default` from importing using *
delete partyData.default
delete provinceData.default

export async function etlMapData() {
    const mapper = newFakeMapper()
    const scores = await mapper.fetchScores()

    const zoneMap = sortScores(scores)
    const provinceMap = Object.keys(zoneMap).reduce(
        (map, zone) => {
            const [provinceId, zoneNo] = zone.split(':')

            map[provinceId] = map[provinceId] || {}
            map[provinceId][zoneNo] = map[provinceId][zoneNo] || zoneMap[zone]
            return map
        },
        {} as any
    )

    const provinces = Object.keys(provinceMap).map(provinceId => {
        const { code, name } = provinceData[provinceId]
        return {
            provinceCode: code,
            provinceName: name,
            zones: Object.keys(provinceMap[provinceId]).map(zoneNo => {
                const items: IScore[] = provinceMap[provinceId][zoneNo]
                const candidates = items.slice(0, 3).map(mapCandidate)
                return {
                    zoneNo,
                    first3Candidates: candidates,
                }
            }),
        }
    })

    const fetchedProvinces = await mapper.fetchProvinces()
    const overview = fetchedProvinces.reduce(
        (ov, p) => {
            ov.counted += p.badVotes + p.goodVotes + p.noVotes
            ov.totalVotes += p.votesTotal
            return ov
        },
        { counted: 0, totalVotes: 0 } as any
    )

    const seats = calculateSeats(zoneMap)
    const parties = Object.keys(seats).map(partyId => {
        const { name, codeEN, logoUrl } = partyData[partyId]

        return {
            partyName: name,
            partyCode: codeEN,
            partyPic: logoUrl,
            seats: seats[partyId].length,
        }
    })

    parties.sort((a, b) => (a.seats.length > b.seats.length ? -1 : 1))
    overview.ranking = parties
    return { provinces, overview }
}

function mapCandidate(item: IScore) {
    // ID is null!?
    const { name, codeEN, logoUrl } = item.partyId
        ? partyData[item.partyId]
        : {
              name: '???',
              codeEN: '???',
              logoUrl: '???',
          }

    return {
        partyName: name,
        partyCode: codeEN,
        partyPic: logoUrl,
        candidate: `${item.title} ${item.firstName} ${item.lastName}`,
        score: item.score,
        picture: '',
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

    Object.keys(zoneMap).map(key => {
        zoneMap[key].sort((a: any, b: any) => (a.score > b.score ? -1 : 1))
    })

    return zoneMap
}

export function calculateSeats(zoneMap: any) {
    return Object.keys(zoneMap).reduce(
        (map, zone) => {
            const winner = zoneMap[zone][0]

            // ID is null !?
            if (!winner.partyId) {
                return map
            }

            winner.zone = zone

            const partyId = `${winner.partyId}`
            map[partyId] = map[partyId] || []
            map[partyId].push(winner)
            return map
        },
        {} as any
    )
}
