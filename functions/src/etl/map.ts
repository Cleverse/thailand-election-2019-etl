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
    const score = await mapper.fetchScore()

    const provinceMap = score.reduce(
        (map, s) => {
            const provinceId = `${s.provinceId}`
            const zoneNo = `${s.zone}`

            map[provinceId] = map[provinceId] || {}
            map[provinceId][zoneNo] = map[provinceId][zoneNo] || []
            map[provinceId][zoneNo].push(s)
            return map
        },
        {} as any
    )

    const partyMap = Object.keys(partyData).reduce(
        (map, id) => {
            const { name, codeEN, logoUrl } = partyData[id]
            map[id] = {
                partyName: name,
                partyCode: codeEN,
                partyPic: logoUrl,
                seats: 0,
            }
            return map
        },
        {} as any
    )

    const provinces = Object.keys(provinceMap).map(id => {
        const province = provinceData[id]
        return {
            provinceCode: province.code,
            provinceName: province.name,
            zones: Object.keys(provinceMap[id]).map(zoneNo => {
                const items: IScore[] = provinceMap[id][zoneNo]
                items.sort((a, b) => (a.score > b.score ? -1 : 1))

                const winningPartyId = items[0].partyId
                // ID is null!?
                if (winningPartyId) {
                    partyMap[winningPartyId].seats += 1
                }

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

    const parties = Object.keys(partyMap).map(id => partyMap[id])
    parties.sort((a, b) => (a.seats > b.seats ? -1 : 1))

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
