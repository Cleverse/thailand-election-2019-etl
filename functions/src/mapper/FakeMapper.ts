import axios from 'axios'
import { IMapper, IProvince, IScore, IParty } from './IMapper'

interface Response {
    total: number
    page?: number
    totalPages?: number
}
interface IScoreResponse extends Response {
    items: IScore[]
}

interface IProvinceResponse extends Response {
    items: IProvince[]
}

interface IPartyResponse extends Response {
    items: IParty[]
}

class FakeMapper implements IMapper {
    private cachedScore: IScore[] | null
    private cachedParties: IParty[] | null
    private cachedProvinces: IProvince[] | null

    constructor() {
        this.cachedScore = null
        this.cachedParties = null
        this.cachedProvinces = null
    }

    public async fetchScore(): Promise<IScore[]> {
        const response = await axios.get(
            'https://election.dttpool.com/api/score?format=json&fields=all&p=all'
        )
        const data = response.data as IScoreResponse
        this.cachedScore = data.items
        return this.cachedScore
    }

    public async score(): Promise<IScore[]> {
        if (!this.cachedScore) {
            this.cachedScore = await this.fetchScore()
        }
        return this.cachedScore
    }

    public async fetchParties(): Promise<IParty[]> {
        const response = await axios.get(
            'https://election.dttpool.com/api/party?format=json&fields=all&p=all'
        )
        const data = response.data as IPartyResponse
        this.cachedParties = data.items
        return this.cachedParties
    }

    public async parties(): Promise<IParty[]> {
        if (!this.cachedParties) {
            this.cachedParties = await this.fetchParties()
        }
        return this.cachedParties
    }

    public async fetchProvinces(): Promise<IProvince[]> {
        const response = await axios.get(
            'https://election.dttpool.com/api/province?format=json&fields=all&p=all'
        )
        const data = response.data as IProvinceResponse
        return data.items
    }

    public async provinces(): Promise<IProvince[]> {
        if (!this.cachedProvinces) {
            this.cachedProvinces = await this.fetchProvinces()
        }
        return this.cachedProvinces
    }
}

let mapper: FakeMapper | null = null

export function newFakeMapper(): IMapper {
    if (!mapper) {
        mapper = new FakeMapper()
    }

    return mapper
}
