import { IScore, newMapper } from '../mapper/IMapper'
import { CDN_IMGURL } from '../constants'
import { calculateTotalVotes } from '../util'

import tempZones from '../masterData/idToElectZoneMap.json'
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
    const mapper = newMapper()
    const scoresByZone = await mapper.getScoresByZone()
    const zoneMap = await mapper.zones().then(zones =>
        zones.reduce(
            (map, zone) => {
                const { provinceId, no } = zone
                map[`${provinceId}:${no}`] = zone
                return map
            },
            {} as any
        )
    )

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
        const { provinceId, zone } = zones[0][0]
        const { code, name } = provinceData[`${provinceId}`]
        const { badVotes, noVotes, ts } = zoneMap[`${provinceId}:${zone}`]
        const invalidVotes = badVotes + noVotes

        return {
            provinceCode: code,
            provinceName: name,
            zones: Object.values(province).map(
                mapZone(invalidVotes, Date.parse(ts))
            ),
        }
    })

    const partySeatsMap = calculateSeatsMap(scoresByZone)
    const partyScores = calculatePartyScores(scoresByZone)
    const sumVotes = partyScores.reduce(
        (psum, p) => psum + p.reduce((sum, s) => sum + s.score, 0),
        0
    )

    const parties = partyScores
        .map(scores => {
            const partyId = `${scores[0].partyId}`
            const { name, codeEN, colorCode } = partyData[partyId]
            const votes = scores.reduce((sum, score) => sum + score.score, 0)
            const percentage = Math.round((votes / sumVotes) * 100 * 10) / 10
            const partySeats: IScore[] = partySeatsMap[partyId]

            return {
                partyName: name,
                partyCode: codeEN,
                partyPic: `${CDN_IMGURL}/parties/${name}.png`,
                color: `#${colorCode}`,
                seats: partySeats ? partySeats.length : 0,
                votes,
                percentage,
                rank: 0,
            }
        })
        .sort((a, b) => b.seats - a.seats)
        .reduce(
            (arr, p, index) => {
                const prev = arr[index - 1]
                p.rank = prev
                    ? prev.seats === p.seats
                        ? prev.rank
                        : index + 1
                    : 1
                arr.push(p)
                return arr
            },
            [] as IRanking[]
        )

    const counted = provinces.reduce(
        (psum, p) => psum + p.zones.reduce((zsum, z) => zsum + z.totalVotes, 0),
        0
    )
    const totalVotes = await calculateTotalVotes()

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
            ? `${constituency.guid}.jpg`
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

function mapZone(invalidVotes: number, timestamp: number) {
    return (zone: any) => {
        const scores: IScore[] = zone
        const sumScores = scores.reduce((sum, score) => sum + score.score, 0)
        const topCandidates = sumScores
            ? scores.slice(0, 5).map(mapCandidate(sumScores))
            : []
        const { zone: zoneNo, provinceId } = scores[0]
        const province = provinceData[`${provinceId}`].name
        const zoneInfo: IZoneInfo = zoneData[`${province}:${zoneNo}`]
        const z = ['74:3', '77:2', '10:5', '10:28']
        return {
            zoneNo,
            totalScore: sumScores,
            totalVotes: sumScores + invalidVotes,
            zoneDesc: stringifyZone(zoneInfo),
            keywords: extractKeywords(zoneInfo),
            timestamp,
            topCandidates,
            overidden: z.includes(`${provinceId}:${zoneNo}`),
        }
    }
}

export function calculatePartyScores(zones: IScore[][]) {
    const partyScoresMap = zones.reduce(
        (map, zone) => {
            zone.map(score => {
                const partyId = `${score.partyId}`
                map[partyId] = map[partyId] || []
                map[partyId].push(score)
            })
            return map
        },
        {} as any
    )

    return Object.values(partyScoresMap)
        .map((s: any) => {
            const scores: IScore[] = s
            return scores.sort((a, b) => b.score - a.score)
        })
        .filter(scores => scores[0].score > 0)
        .sort((a, b) => {
            const scoreA = a.reduce((sum, s) => sum + s.score, 0)
            const scoreB = b.reduce((sum, s) => sum + s.score, 0)
            return scoreB - scoreA
        })
}

export function calculateSeatsMap(zones: Array<IScore[]>) {
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

function extractKeywords(zone: IZoneInfo) {
    return zone.areas.reduce(
        (keywords, area) =>
            keywords
                .concat(area.interior)
                .concat(area.exterior)
                .concat(area.subinterior)
                .concat([area.area]),
        [] as string[]
    )
}
