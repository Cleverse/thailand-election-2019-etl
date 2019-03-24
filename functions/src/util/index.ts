import { newMapper } from '../mapper/IMapper'

export async function calculateTotalVotes() {
    const mapper = newMapper()
    const provinces = await mapper.provinces()
    const theInvalidVotes = await calculateInvalidVotes()
    const TOTAL_VOTES = parseInt(process.env.TOTAL_VOTES as string)

    return process.env.USE_SUM_PROVINCE
        ? provinces.reduce((sum, province) => sum + province.votesTotal, 0)
        : TOTAL_VOTES || 40 * (10 ^ 6) + theInvalidVotes
}

export async function calculateInvalidVotes() {
    const mapper = newMapper()
    const provinces = await mapper.provinces()

    return provinces.reduce((sum, province) => {
        const { badVotes, noVotes } = province
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
