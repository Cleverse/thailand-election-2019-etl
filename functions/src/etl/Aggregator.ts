import { newMapper, IMapper, IScore } from '../mapper/IMapper'

export class Aggregator {
    private mapper: IMapper
    private scores: IScore[][] | null

    constructor() {
        this.mapper = newMapper()
        this.scores = null
    }

    public async scoresByZone() {
        if (this.scores) {
            return this.scores
        }

        const scores = await this.mapper.scores()
        const zoneMap = scores.reduce(
            (map, s) => {
                const key = `${s.provinceId}:${s.zone}`

                map[key] = map[key] || []
                map[key].push(s)
                return map
            },
            {} as any
        )

        this.scores = (<Array<IScore[]>>(
            Object.values(zoneMap).map((zone: any) =>
                zone.sort((a: any, b: any) => b.score - a.score)
            )
        )).filter(e => e[0].score > 0)

        return this.scores
    }

    public async scoresByParty() {
        const zones = await this.scoresByZone()

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

    public async seatsMap() {
        const zones = await this.scoresByZone()
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
}

export default new Aggregator()
