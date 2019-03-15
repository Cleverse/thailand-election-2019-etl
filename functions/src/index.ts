import { https } from 'firebase-functions'

import { newFakeMapper } from './mapper/FakeMapper'
import { IScore } from './mapper/IMapper'

import * as tempParties from './masterData/parties.json'
import * as tempProvinces from './masterData/provinces.json'

const partyData: any = tempParties
const provinceData: any = tempProvinces

export const main = https.onRequest(async (__, res) => {
    const mapper = newFakeMapper()
    const score = await mapper.score()

    const provinceMap = score.reduce(
        (map, s) => {
            const provinceId = `${s.provinceId}`
            const zoneNo = `${s.zone}`

            map[provinceId] = map[provinceId] || []
            map[provinceId][zoneNo] = map[provinceId][zoneNo] || []
            map[provinceId][zoneNo].push(s)
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

                const candidates = items.slice(0, 3).map(mapCandidate)
                return {
                    zoneNo,
                    first3Candidates: candidates,
                }
            }),
        }
    })

    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(provinces))
    res.end()
})

function mapCandidate(item: IScore) {
    const party = item.partyId
        ? partyData[item.partyId]
        : {
              name: '???',
              codeEN: '???',
              logoUrl: '???',
          }

    return {
        partyName: party.name,
        partyCode: party.codeEN,
        partyPic: party.logoUrl,
        candidate: `${item.title} ${item.firstName} ${item.lastName}`,
        score: item.score,
        picture: '',
    }
}
