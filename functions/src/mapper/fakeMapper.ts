import axios from 'axios'
import { IMapper, IScore } from './IMapper'

interface IScoreResponse {
    total: number
    items: IScore[]
}

class FakeMapper implements IMapper {
    private cache: IScore[] | null

    constructor() {
        this.cache = null
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
}

let mapper: FakeMapper | null = null

export function newFakeMapper(): IMapper {
    if (!mapper) {
        mapper = new FakeMapper()
    }

    return mapper
}
