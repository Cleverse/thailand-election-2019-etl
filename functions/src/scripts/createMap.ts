// import { writeFileSync } from 'fs'
import zoneData from '../masterData/election-zones.json'

function main() {
    // const zoneMap = zoneData.reduce(
    //     (map, zone) => {
    //         map[`${zone.province}:${zone.zone}`] = zone
    //         return map
    //     },
    //     {} as any
    // )
    zoneData.map(zone => {
        ;(<any[]>zone.areas).map(area => {
            if (area.subinterior.length > 0) {
                console.log(area.subinterior)
            }
        })
    })

    // writeFileSync('test.json', JSON.stringify(zoneMap, undefined, 2))
}

main()
