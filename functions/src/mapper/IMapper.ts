export interface IMapper {
    fetchScore(): Promise<IScore[]>
    score(): Promise<IScore[]>
    fetchProvince(): Promise<IProvince[]>
    province(): Promise<IProvince[]>
    fetchParties(): Promise<IParty[]>
    parties(): Promise<IParty[]>
}

export interface IScore {
    id: number
    score: number
    provinceId: number
    zone: number
    partyId: number
    no: number
    title: string
    firstName: string
    lastName: string
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
