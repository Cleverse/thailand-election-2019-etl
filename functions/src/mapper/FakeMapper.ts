import { IMapper, IProvince, IScore, IParty, IZone } from './IMapper'
import tempZones from '../masterData/idToZoneMap.json'
import tempParties from '../masterData/idToPartyMap.json'
import tempProvinces from '../masterData/idToProvinceMap.json'
import tempCandidates from '../masterData/idToCandidateMap.json'

const zoneData: any = tempZones
const partyData: any = tempParties
const provinceData: any = tempProvinces
const candidateData: any = tempCandidates

export class FakeMapper implements IMapper {
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

    public async fetchZones(): Promise<IZone[]> {
        return Object.values(zoneData)
    }

    public async zones(): Promise<IZone[]> {
        return this.fetchZones()
    }

    public async fetchProvinces(): Promise<IProvince[]> {
        return Object.values(provinceData)
    }

    public async provinces(): Promise<IProvince[]> {
        return this.fetchProvinces()
    }
}
