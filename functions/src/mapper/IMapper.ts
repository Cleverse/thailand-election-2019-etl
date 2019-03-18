export interface IMapper {
    fetchScores(): Promise<IScore[]>
    scores(): Promise<IScore[]>
    fetchProvinces(): Promise<IProvince[]>
    provinces(): Promise<IProvince[]>
    fetchParties(): Promise<IParty[]>
    parties(): Promise<IParty[]>
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
}

export interface IProvince {
    id: number
    name: string
    regionId: number
    zone: number
    code: string
    eligible: any
    votesTotal: any
    votesM: any
    votesF: any
    goodVotes: any
    badVotes: any
    noVotes: any
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
