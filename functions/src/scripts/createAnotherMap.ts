// import { writeFileSync } from 'fs'
// import tempParties from '../masterData/partyToPartyMap.json'
// import tempPartylist from '../masterData/partyToPartylistMembersMap.json'

// const partyData: any = tempParties
// const partylistData: any = tempPartylist

// function main() {
//     const values = Object.values(partylistData)
//     console.log('Before', values.length)
//     const partylistMap = values.reduce(
//         (map, partylist: any) => {
//             const { name } = partylist
//             const { codeEN } = partyData[name]
//             map[codeEN] = partylist
//             return map
//         },
//         {} as any
//     )
//     console.log('After', Object.values(partylistMap).length)
//     writeFileSync('test.json', JSON.stringify(partylistMap, undefined, 2))
// }

// main()
