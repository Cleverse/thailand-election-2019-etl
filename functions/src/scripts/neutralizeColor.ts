import { newFakeMapper } from '../mapper/FakeMapper'
import { writeFileSync } from 'fs'

export default async function main() {
    const mapper = newFakeMapper()
    const parties = await mapper.fetchParties()

    const partyMap = parties.reduce(
        (map, party) => {
            switch (party.name) {
                case 'เพื่อไทย':
                    party.colorCode = 'e01e2c'
                    console.log(party.name)
                    break
                case 'ประชาธิปัตย์':
                    party.colorCode = '34bced'
                    console.log(party.name)
                    break
                case 'พลังประชารัฐ':
                    party.colorCode = '3e61a7'
                    console.log(party.name)
                    break
                case 'อนาคตใหม่':
                    party.colorCode = 'f36e23'
                    console.log(party.name)
                    break
                case 'ภูมิใจไทย':
                    party.colorCode = '192953'
                    console.log(party.name)
                    break
                case 'เพื่อชาติ':
                    party.colorCode = 'a71f23'
                    console.log(party.name)
                    break
                case 'ประชาชาติ':
                    party.colorCode = 'a35826'
                    console.log(party.name)
                    break
                case 'รวมพลังประชาชาติไทย':
                    party.colorCode = '6d97cf'
                    console.log(party.name)
                    break
                case 'ชาติพัฒนา':
                    party.colorCode = '94877f'
                    console.log(party.name)
                    break
                case 'ชาติไทยพัฒนา':
                    party.colorCode = 'eb2490'
                    console.log(party.name)
                    break
                case 'รักษ์ผืนป่าประเทศไทย':
                    party.colorCode = '006152'
                    console.log(party.name)
                    break
                case 'เสรีรวมไทย':
                    party.colorCode = 'f7e23a'
                    console.log(party.name)
                    break
                case 'พลังท้องถิ่นไท':
                    party.colorCode = '40af49'
                    console.log(party.name)
                    break
                case 'ประชาชนปฏิรูป':
                    party.colorCode = '2e3389'
                    console.log(party.name)
                    break
                case 'เศรษฐกิจใหม่':
                    party.colorCode = '642e91'
                    console.log(party.name)
                    break
                default:
                    party.colorCode = '52545b'
            }

            map[`${party.id}`] = party
            return map
        },
        {} as any
    )

    writeFileSync('test.json', JSON.stringify(partyMap, undefined, 2))
}
