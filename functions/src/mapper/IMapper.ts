export interface IMapper {
    fetchScore(): Promise<IScore[]>
    score(): Promise<IScore[]>
    fetchProvince(): Promise<IProvince[]>
    province(): Promise<IProvince[]>
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
