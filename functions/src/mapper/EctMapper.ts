import { IMapper, IProvince, IScore, IParty, IZone } from './IMapper'
import { client } from '../util/client'

interface Response {
    total: number
    page?: number
    totalPages?: number
}
interface IScoreResponse extends Response {
    items: IScore[]
}

interface IZoneResponse extends Response {
    items: IZone[]
}

interface IProvinceResponse extends Response {
    items: IProvince[]
}

interface IPartyResponse extends Response {
    items: IParty[]
}

export class EctMapper implements IMapper {
    private cachedZones: IZone[] | null
    private cachedScores: IScore[] | null
    private cachedParties: IParty[] | null
    private cachedProvinces: IProvince[] | null
    private cachedZonesTimestamp: number
    private cachedScoresTimestamp: number
    private cachedPartiesTimestamp: number
    private cachedProvincesTimestamp: number

    constructor() {
        this.cachedZones = null
        this.cachedScores = null
        this.cachedParties = null
        this.cachedProvinces = null
        this.cachedZonesTimestamp = 0
        this.cachedScoresTimestamp = 0
        this.cachedPartiesTimestamp = 0
        this.cachedProvincesTimestamp = 0
    }

    public async fetchScores(): Promise<IScore[]> {
        const response = await client.get('/score?format=json&fields=all&p=all')
        const data = response.data as IScoreResponse
        this.cachedScores = data.items
        return this.cachedScores
    }

    public async scores(): Promise<IScore[]> {
        if (
            !this.cachedScores ||
            Date.now() - this.cachedScoresTimestamp > 20000
        ) {
            this.cachedScores = await this.fetchScores()
            this.cachedScoresTimestamp = Date.now()
            console.log('cache score')
        }
        return this.cachedScores
    }

    public async fetchParties(): Promise<IParty[]> {
        const response = await client.get('/party?format=json&fields=all&p=all')
        const data = response.data as IPartyResponse
        this.cachedParties = data.items
        return this.cachedParties
    }

    public async parties(): Promise<IParty[]> {
        if (
            !this.cachedParties ||
            Date.now() - this.cachedPartiesTimestamp > 20000
        ) {
            this.cachedParties = await this.fetchParties()
            this.cachedPartiesTimestamp = Date.now()
            console.log('cache party')
        }
        return this.cachedParties
    }

    public async fetchZones(): Promise<IZone[]> {
        const response = await client.get('/zone?format=json&fields=all&p=all')
        const data = response.data as IZoneResponse
        return data.items
    }

    public async zones(): Promise<IZone[]> {
        if (
            !this.cachedZones ||
            Date.now() - this.cachedZonesTimestamp > 20000
        ) {
            this.cachedZones = await this.fetchZones()
            this.cachedZonesTimestamp = Date.now()
            console.log('cache province')
        }
        return this.cachedZones
    }

    public async fetchProvinces(): Promise<IProvince[]> {
        const response = await client.get(
            '/province?format=json&fields=all&p=all'
        )
        const data = response.data as IProvinceResponse
        return data.items
    }

    public async provinces(): Promise<IProvince[]> {
        if (
            !this.cachedProvinces ||
            Date.now() - this.cachedProvincesTimestamp > 20000
        ) {
            this.cachedProvinces = await this.fetchProvinces()
            this.cachedProvincesTimestamp = Date.now()
            console.log('cache province')
        }
        return this.cachedProvinces
    }
}
