import { newFakeMapper } from './FakeMapper'
import { newEctMapper } from './EctMapper'

export interface IMapper {
    fetchScores(): Promise<IScore[]>
    scores(): Promise<IScore[]>
    fetchZones(): Promise<IZone[]>
    zones(): Promise<IZone[]>
    fetchProvinces(): Promise<IProvince[]>
    provinces(): Promise<IProvince[]>
    fetchParties(): Promise<IParty[]>
    parties(): Promise<IParty[]>
    getScoresByZone(): Promise<Array<IScore[]>>
}

export interface IScore {
    id: string
    score: number
    provinceId: number
    zone: number
    partyId: number
    no: number
    title: string
    firstName: string
    lastName: string
    age: number
    education: string
    occupation: string
    rank: any
    ts: string
}

export interface IProvince {
    id: number
    name: string
    regionId: number
    zone: number
    code: string
    units: number
    eligible: any
    votesTotal: any
    votesM: any
    votesF: any
    goodVotes: any
    badVotes: any
    noVotes: any
    progress: number
    ts: string
}

export interface IZone {
    provinceId: number
    no: number
    units: number
    eligible: number
    details: string
    tags: any
    votesTotal: number
    votesM: number
    votesF: number
    goodVotes: number
    badVotes: number
    noVotes: number
    progress: number
    ts: string
}

export interface IParty {
    id: number
    name: string
    codeTH: string
    codeEN: string
    logoUrl: string
    votesTotal: number
    colorCode: any
}

export function newMapper() {
    return process.env.TEST_ENV ? newFakeMapper() : newEctMapper()
}
