import { IMapper, IScore, IParty, IProvince, IZone } from './IMapper'

export abstract class BaseMapper implements IMapper {
    abstract fetchScores(): Promise<IScore[]>
    abstract scores(): Promise<IScore[]>
    abstract fetchParties(): Promise<IParty[]>
    abstract parties(): Promise<IParty[]>
    abstract fetchProvinces(): Promise<IProvince[]>
    abstract provinces(): Promise<IProvince[]>
    abstract fetchZones(): Promise<IZone[]>
    abstract zones(): Promise<IZone[]>

    public async getScoresByZone() {
        const scores = await this.scores()
        const zoneMap = scores.reduce(
            (map, s) => {
                const key = `${s.provinceId}:${s.zone}`

                map[key] = map[key] || []
                map[key].push(s)
                return map
            },
            {} as any
        )

        return (<Array<IScore[]>>(
            Object.values(zoneMap).map((zone: any) =>
                zone.sort((a: any, b: any) => b.score - a.score)
            )
        )).filter(e => e[0].score > 0)
    }
}
