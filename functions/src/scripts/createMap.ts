import { writeFileSync } from 'fs'
import { EctMapper } from '../mapper/EctMapper'

export async function main() {
    const mapper = new EctMapper()
    const zones = await mapper.fetchZones()

    const zoneMap = zones.reduce(
        (map, zone) => {
            const { provinceId, no } = zone
            map[`${provinceId}:${no}`] = zone
            return map
        },
        {} as any
    )

    writeFileSync('test.json', JSON.stringify(zoneMap, undefined, 2))
}
