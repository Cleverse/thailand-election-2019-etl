import { newMapper } from '../mapper/IMapper'

export async function calculateTotalVotes() {
    const theInvalidVotes = await calculateInvalidVotes()
    const TOTAL_VOTES = parseInt(process.env.TOTAL_VOTES as string)

    return process.env.USE_SUM_ZONE
        ? await calculateTotalVotesFromEct()
        : TOTAL_VOTES || 40 * Math.pow(10, 6) + theInvalidVotes
}

export async function calculateTotalVotesFromEct() {
    const mapper = newMapper()
    const zones = await mapper.zones()

    return zones.reduce((sum, zone) => sum + zone.votesTotal, 0)
}

export async function calculateInvalidVotes() {
    const mapper = newMapper()
    const zones = await mapper.zones()

    return zones.reduce((sum, zone) => {
        const { badVotes, noVotes } = zone
        return badVotes + noVotes + sum
    }, 0)
}

export function listToMap(list: any[], key: string) {
    return list.reduce(
        (map, elem) => {
            map[elem[key]] = elem
            return map
        },
        {} as any
    )
}
