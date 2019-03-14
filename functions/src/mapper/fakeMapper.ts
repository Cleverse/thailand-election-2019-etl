import axios from 'axios'
import { IMapper, IProvince, IScore } from './IMapper'

interface IScoreResponse {
    total: number
    items: IScore[]
}

interface IProvinceResponse {
    total: number
    items: IProvince[]
}

class FakeMapper implements IMapper {
    private cache: IScore[] | null
    private provinceData: IProvince[] | null

    constructor() {
        this.cache = null
        this.provinceData = null
    }

    public async fetchScore(): Promise<IScore[]> {
        const response = await axios.get(
            'https://election.dttpool.com/api/score?format=json&fields=all&p=all'
        )
        const data = response.data as IScoreResponse
        this.cache = data.items
        return this.cache
    }

    public async score(): Promise<IScore[]> {
        if (!this.cache) {
            this.cache = await this.fetchScore()
        }
        return this.cache
    }

    public async fetchProvince(): Promise<IProvince[]> {
        const response = await axios.get(
            'https://election.dttpool.com/api/province?format=json&fields=all&p=all'
        )
        const data = response.data as IProvinceResponse
        return data.items
    }

    public async province(): Promise<IProvince[]> {
        if (!this.provinceData) {
            this.provinceData = await this.fetchProvince()
        }
        return this.provinceData
    }
}

let mapper: FakeMapper | null = null

export function newFakeMapper(): IMapper {
    if (!mapper) {
        mapper = new FakeMapper()
    }

    return mapper
}
