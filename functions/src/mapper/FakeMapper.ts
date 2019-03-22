import { IMapper, IProvince, IScore, IParty } from './IMapper'
import tempParties from '../masterData/idToPartyMap.json'
import tempProvinces from '../masterData/idToProvinceMap.json'
import tempCandidates from '../masterData/idToCandidateMap.json'

const partyData: any = tempParties
const provinceData: any = tempProvinces
const candidateData: any = tempCandidates

class FakeMapper implements IMapper {
    public async fetchScores(): Promise<IScore[]> {
        return Object.values(candidateData)
    }

    public async scores(): Promise<IScore[]> {
        return this.fetchScores()
    }

    public async fetchParties(): Promise<IParty[]> {
        return Object.values(partyData)
    }

    public async parties(): Promise<IParty[]> {
        return this.fetchParties()
    }

    public async fetchProvinces(): Promise<IProvince[]> {
        return Object.values(provinceData)
    }

    public async provinces(): Promise<IProvince[]> {
        return this.fetchProvinces()
    }
}

let mapper: FakeMapper | null = null

export function newFakeMapper(): IMapper {
    if (!mapper) {
        mapper = new FakeMapper()
    }

    return mapper
}
