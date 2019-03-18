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
    const overview = fetchedProvinces.reduce(
        (ov, p) => {
            ov.counted += p.badVotes + p.goodVotes + p.noVotes
            ov.totalVotes += p.votesTotal
            return ov
        },
        { counted: 0, totalVotes: 0 } as any
    )

    const partySeats = calculateSeats(scoresByZone)
    const parties = partySeats.map(seats => {
        const { name, codeEN, logoUrl } = partyData[`${seats[0].partyId}`]

        return {
            partyName: name,
            partyCode: codeEN,
            partyPic: logoUrl,
            seats: seats.length,
        }
    })

    overview.ranking = parties
    return { provinces, overview }
}

function mapCandidate(item: IScore) {
    // ID is null!?
    const { name, codeEN, logoUrl } = item.partyId
        ? partyData[`${item.partyId}`]
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
        zone.sort((a: any, b: any) => (a.score > b.score ? -1 : 1))
    ) as Array<IScore[]>
}

export function calculateSeats(zones: Array<IScore[]>) {
    const seatMap = calculateSeatMap(zones)

    return Object.values(seatMap).sort((a: any, b: any) =>
        a.length > b.length ? -1 : 1
    ) as Array<IScore[]>
}

export function calculateSeatMap(zones: Array<IScore[]>) {
    return zones.reduce(
        (map, zone) => {
            const winner = zone[0]

            // ID is null !?
            if (!winner.partyId) {
                return map
            }

            const partyId = `${winner.partyId}`
            map[partyId] = map[partyId] || []
            map[partyId].push(winner)
            return map
        },
        {} as any
    )
}
