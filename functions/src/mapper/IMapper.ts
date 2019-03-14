export interface IMapper {
    fetchScore(): Promise<IScore[]>
    score(): Promise<IScore[]>
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
