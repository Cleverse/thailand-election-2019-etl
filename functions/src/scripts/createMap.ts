import { writeFileSync } from 'fs'
import { newEctMapper } from '../mapper/EctMapper'

export async function main() {
    const mapper = newEctMapper()
    const provinces = await mapper.fetchProvinces()

    const scoreMap = provinces.reduce(
        (map, province) => {
            map[`${province.id}`] = province
            return map
        },
        {} as any
    )

    writeFileSync('test.json', JSON.stringify(scoreMap, undefined, 2))
}
