import { https } from 'firebase-functions'

import { newFakeMapper } from './mapper/FakeMapper'
import { IScore } from './mapper/IMapper'

export const main = https.onRequest(async (_, res) => {
    const mapper = newFakeMapper()
    const score = await mapper.score()
    const parties = await mapper.parties()

    const zoneMap = score.reduce(
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

    const partyMap = parties.reduce(
        (map, p) => {
            const partyId = `${p.id}`
            map[partyId] = map[partyId] || []
            map[partyId] = p
            return map
        },
        {} as any
    )

    const result = Object.keys(zoneMap).reduce(
        (provinces, id) => {
            provinces.push({
                provinceCode: id,
                provinceName: '',
                zones: Object.keys(zoneMap[id]).reduce(
                    (zones, no) => {
                        const items: IScore[] = zoneMap[id][no]
                        items.sort((a, b) => (a.score > b.score ? -1 : 1))

                        const candidates = items.slice(0, 3).map(item => {
                            const party = item.partyId
                                ? partyMap[item.partyId]
                                : {
                                      name: '???',
                                      codeEN: '???',
                                      logoUrl: '???',
                                  }

                            return {
                                partyName: party.name,
                                partyCode: party.codeEN,
                                partyPic: party.logoUrl,
                                candidate: `${item.title} ${item.firstName} ${
                                    item.lastName
                                }`,
                                score: item.score,
                                picture: '',
                            }
                        })
                        zones.push({
                            zoneNo: no,
                            first3Candidates: candidates,
                        })
                        return zones
                    },
                    [] as any
                ),
            })
            return provinces
        },
        [] as any
    )

    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(result))
    res.end()
})
