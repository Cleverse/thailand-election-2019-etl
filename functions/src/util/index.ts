import { newFakeMapper } from '../mapper/FakeMapper'

let totalVotes: number | null = null
let invalidVotes: number | null = null

export async function calculateTotalVotes() {
    if (totalVotes) {
        return totalVotes
    }

    const mapper = newFakeMapper()
    const provinces = await mapper.provinces()
    const theInvalidVotes = await calculateInvalidVotes()
    const TOTAL_VOTES = parseInt(process.env.TOTAL_VOTES as string)

    totalVotes = process.env.USE_SUM_PROVINCE
        ? provinces.reduce((sum, province) => sum + province.votesTotal, 0)
        : TOTAL_VOTES || 40 * (10 ^ 6) + theInvalidVotes

    return totalVotes
}

export async function calculateInvalidVotes() {
    if (invalidVotes) {
        return invalidVotes
    }

    const mapper = newFakeMapper()
    const provinces = await mapper.provinces()

    invalidVotes = provinces.reduce((sum, province) => {
        const { badVotes, noVotes } = province
        return badVotes + noVotes + sum
    }, 0)

    return invalidVotes
}
