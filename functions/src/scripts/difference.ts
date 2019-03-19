// import * as _ from 'lodash'
// import * as fs from 'fs'
// import { IScore } from '../mapper/IMapper'

// import * as tempConstituency from '../masterData/uniqueKeyToConstituencyMemberMap.json'
// import * as tempCandidates from '../masterData/candidates.json'
// import * as tempProvinces from '../masterData/idToProvinceMap.json'
// import * as tempParties from '../masterData/idToPartyMap.json'

// const constituencyData: any = tempConstituency as any
// const provinceData: any = tempProvinces as any
// const partyData: any = tempParties as any
// const { items: candidatesData } = (tempCandidates as unknown) as {
//     items: IScore[]
// }

// delete constituencyData.default
// delete provinceData.default

// const isEqual = (a: string, b: string) => {
//     return a.replace(/\s+/g, ' ').trim() === b.replace(/\s+/g, ' ').trim()
// }

// const array = Object.values(constituencyData)

// async function nameDiff() {
//     const result1 = _.differenceWith(
//         array,
//         candidatesData,
//         (a: any, b) =>
//             isEqual(a.firstName, b.firstName) && isEqual(a.lastName, b.lastName)
//     )
//     const result2 = _.differenceWith(
//         candidatesData,
//         array,
//         (a, b: any) =>
//             isEqual(a.firstName, b.firstName) && isEqual(a.lastName, b.lastName)
//     )
//     console.log(result1.length)
//     fs.writeFileSync('test1.json', JSON.stringify(result1, undefined, 2))
//     console.log(result2.length)
//     fs.writeFileSync('test2.json', JSON.stringify(result2, undefined, 2))
// }

// async function provinceDiff() {
//     const uniqueProvince1 = _.uniq(
//         candidatesData.map(c => provinceData[`${c.provinceId}`].name)
//     )
//     const uniqueProvince2 = _.uniq(array.map((i: any) => i.province))
//     const result1 = _.difference(uniqueProvince1, uniqueProvince2)
//     const result2 = _.difference(uniqueProvince2, uniqueProvince1)

//     console.log(result1.length)
//     fs.writeFileSync('test1.json', JSON.stringify(result1, undefined, 2))
//     console.log(result2.length)
//     fs.writeFileSync('test2.json', JSON.stringify(result2, undefined, 2))
// }

// async function provinceZoneDiff() {
//     const uniqueProvince1 = _.uniq(
//         candidatesData.map(c => provinceData[`${c.provinceId}`].name + c.zone)
//     )
//     const uniqueProvince2 = _.uniq(array.map((i: any) => i.province + i.zone))
//     const result1 = _.difference(uniqueProvince1, uniqueProvince2)
//     const result2 = _.difference(uniqueProvince2, uniqueProvince1)

//     console.log(result1.length)
//     fs.writeFileSync('test1.json', JSON.stringify(result1, undefined, 2))
//     console.log(result2.length)
//     fs.writeFileSync('test2.json', JSON.stringify(result2, undefined, 2))
// }

// const trim = (a: string) => {
//     return a.replace(/\s+/g, ' ').trim()
// }

// async function partyDiff() {
//     const uniqueParty1 = _.uniq(
//         candidatesData.map(
//             c =>
//                 `${partyData[`${c.partyId}`].name}:${trim(c.firstName)}:${trim(
//                     c.lastName
//                 )}:${c.zone}:${provinceData[`${c.provinceId}`].name}`
//         )
//     )
//     const uniqueParty2 = _.uniq(
//         array.map(
//             (i: any) =>
//                 `${i.partyName}:${trim(i.firstName)}:${trim(i.lastName)}:${
//                     i.zone
//                 }:${i.province}`
//         )
//     )
//     const result1 = _.difference(uniqueParty1, uniqueParty2)
//     const result2 = _.difference(uniqueParty2, uniqueParty1)

//     console.log(result1.length)
//     fs.writeFileSync('test1.json', JSON.stringify(result1, undefined, 2))
//     console.log(result2.length)
//     fs.writeFileSync('test2.json', JSON.stringify(result2, undefined, 2))
// }

// partyDiff()
