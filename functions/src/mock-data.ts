import * as fs from 'fs'
import * as _ from 'lodash'

const provinces = _.range(77).map(i => ({
    provinceCode: '' + i,
    provinceName: '',
    zones: _.range(5).map(j => ({
        zoneNo: '' + j,
        first3Candidates: _.range(3).map(k => ({
            partyName: '' + k,
            partyCode: '',
            partyPic: '',
            candidate: '',
            score: 0,
            picture:
                'https://cdn.vote.phantompage.com/images/partylist/000b0a48-f1fc-46df-8a59-71c4764df406.jpg',
        })),
    })),
}))

const ranking = _.range(12).map(i => ({
    partyName: '' + i,
    partyCode: '',
    partyPic: '',
    seats: 0,
}))

const map = {
    provinces,
    overview: {
        counted: 0,
        totalVotes: 0,
        ranking,
    },
}

fs.writeFileSync('map.json', JSON.stringify(map))

// const partyList = _.range(12).map(i => ({
//     party: '' + i,
//     electedMemberCount: 0,
// }))

// fs.writeFileSync('partyList.json', JSON.stringify(partyList, undefined, 2))
