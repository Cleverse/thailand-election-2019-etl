import { writeFileSync } from 'fs'
import tempParties from '../masterData/idToPartyMap.json'

const partyData: any = tempParties

function main() {
    const partyMap = Object.values(partyData).reduce(
        (map, party: any) => {
            map[party.name] = party
            return map
        },
        {} as any
    )

    writeFileSync('test.json', JSON.stringify(partyMap, undefined, 2))
}

main()
