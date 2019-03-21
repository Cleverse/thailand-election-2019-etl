import { newFakeMapper } from '../mapper/FakeMapper'
import { IScore } from '../mapper/IMapper'
import { CDN_IMGURL } from '../constants'

import tempZones from '../masterData/idToZoneMap.json'
import tempParties from '../masterData/idToPartyMap.json'
import tempProvinces from '../masterData/idToProvinceMap.json'
import tempConstituency from '../masterData/uniqueKeyToConstituencyMemberMap.json'

const zoneData: any = tempZones
const partyData: any = tempParties
const provinceData: any = tempProvinces
const constituencyData: any = tempConstituency

interface IZoneInfo {
    province: string
    zone: number
    areas: Array<{
        area: string
        interior: string[]
        exterior: string[]
        subinterior: string[]
    }>
    prefixes: {
        area: string
        sub_area: string
    }
}
interface IRanking {
    partyName: string
    partyCode: string
    partyPic: string
    color: string
    seats: number
    votes: number
    percentage: number
    rank: number
}

export async function etlMapData() {
    const mapper = newFakeMapper()
    const scoresByZone = await mapper.scores().then(sortScores)
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

    const partySeats = calculateSeats(scoresByZone)
    const partyScores = calculatePartyScores(partySeats)
    const sumVotes = partyScores.reduce((sum, votes) => sum + votes, 0)

    const parties = partySeats.reduce(
        (arr, seats, index) => {
            const { name, codeEN, colorCode } = partyData[`${seats[0].partyId}`]
            const votes = partyScores[index]
            const percentage = Math.round((votes / sumVotes) * 100 * 10) / 10

            const { seats: prevSeats, rank: prevRank } = arr[
                arr.length - 1
            ] || {
                seats: 0,
                rank: 1,
            }

            arr.push({
                partyName: name,
                partyCode: codeEN,
                partyPic: `${CDN_IMGURL}/parties/${name}.png`,
                color: `#${colorCode}`,
                seats: seats.length,
                votes,
                percentage,
                rank: seats.length === prevSeats ? prevRank : arr.length + 1,
            })
            return arr
        },
        [] as IRanking[]
    )

    const fetchedProvinces = await mapper.provinces()
    const invalidVotes = fetchedProvinces.reduce((sum, province) => {
        const { badVotes, noVotes } = province
        return badVotes + noVotes + sum
    }, 0)

    const counted = sumVotes + invalidVotes

    const TOTAL_VOTES = parseInt(process.env.TOTAL_VOTES as string)
    const totalVotes = TOTAL_VOTES
        ? TOTAL_VOTES + invalidVotes
        : fetchedProvinces.reduce(
              (sum, province) => sum + province.votesTotal,
              0
          )

    return {
        provinces,
        overview: {
            counted,
            totalVotes,
            percentage: Math.round((counted / totalVotes) * 100 * 100) / 100,
            ranking: parties,
        },
    }
}

function mapCandidate(sumVotes: number) {
    return (item: IScore) => {
        const {
            provinceId,
            zone,
            score,
            title,
            firstName,
            lastName,
            partyId,
        } = item

        const { name, codeEN, colorCode } = partyData[`${partyId}`]
        const province = provinceData[`${provinceId}`].name
        const tempParty = lastName === 'นวะกิจโลหะกูล' ? 'พลังไทยรักไทย' : name
        const constituency =
            constituencyData[`${province}:${zone}:${tempParty}`]
        const imgName: string = constituency
            ? `${constituency.GUID}.jpg`
            : 'placeholder.png'

        return {
            partyName: tempParty,
            partyCode: codeEN,
            partyPic: `${CDN_IMGURL}/parties/${name}.png`,
            color: `#${colorCode}`,
            candidate: `${title} ${firstName} ${lastName}`,
            score,
            percentage: Math.round((score / sumVotes) * 100 * 100) / 100,
            picture: `${CDN_IMGURL}/candidates/${imgName.toLowerCase()}`,
        }
    }
}

function mapZone(zone: any) {
    const scores: IScore[] = zone
    const sumVotes = scores.reduce((sum, score) => sum + score.score, 0)
    const candidates = scores.slice(0, 5).map(mapCandidate(sumVotes))
    const { zone: zoneNo, provinceId } = scores[0]
    const province = provinceData[`${provinceId}`].name
    const zoneInfo: IZoneInfo = zoneData[`${province}:${zoneNo}`]
    return {
        zoneNo,
        zoneDesc: stringifyZone(zoneInfo),
        topCandidates: candidates,
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

export function calculatePartyScores(partySeats: Array<IScore[]>) {
    return partySeats.map(scores =>
        scores.reduce((sum, score) => sum + score.score, 0)
    )
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

function stringifyZone(zone: IZoneInfo) {
    const { area: areaUnit, sub_area: subUnit } = zone.prefixes
    return zone.areas.map(area => {
        const interior = concatXerior(area.interior)
        const exterior = concatXerior(area.exterior)
        return `${areaUnit} ${area.area}${
            interior ? ` เฉพาะ ${subUnit} ${interior}` : ''
        }${exterior ? ` ยกเว้น ${subUnit} ${exterior}` : ''}`
    })
}

function concatXerior(arr: string[]) {
    return arr.reduce((str, subArea) => `${str} ${subArea},`, '').slice(1, -1)
}
