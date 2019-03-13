import * as fs from 'fs'
import * as _ from 'lodash'

const provinces: any[] = []
_.range(76).map(i => {
    provinces.push({
        name: '' + i,
        khets: []
    })
    _.range(12).map(j => {
        provinces[i].khets.push({
            khetNo: '' + j,
            first3Candidates: []
        })
        _.range(3).map(k => {
            provinces[i].khets[j].first3Candidates.push({
                party: '' + k,
                name: '',
                score: 0
            })
        })
    })
})

const ranking: any[] = []
_.range(12).map(i => {
    ranking.push({
        party: '' + i,
        score: 0
    })
})

const template: any = {
    provinces,
    overview: {
        counted: 0,
        totalVotes: 0,
        ranking
    }
}

fs.writeFileSync('map.json', JSON.stringify(template, undefined, 2))
