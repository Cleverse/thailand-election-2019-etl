import { calculatePartyList, Party } from 'partylist-calculator'

import {
    sortScores,
    calculatePartyScores,
    calculatePartyScoresMap,
    calculateSeatMap,
} from './map'
import { CDN_IMGURL } from '../constants'
import { calculateInvalidVotes, calculateTotalVotes } from '../util'

import tempPartyList from '../masterData/partyToPartylistMembersMap.json'
import tempParties from '../masterData/idToPartyMap.json'
import { newMapper, IScore } from '../mapper/IMapper'

const partylistData: any = tempPartyList
const partyData: any = tempParties

export async function etlPartylistData() {
    const mapper = newMapper()
    const scoresByZone = await mapper.scores().then(sortScores)
    const partySeatsMap = calculateSeatMap(scoresByZone)
    const partyScoresMap = calculatePartyScoresMap(scoresByZone)

    const partylists = Object.values(partyScoresMap).map((s: any) => {
        const scores: IScore[] = s
        const partyIdStr = `${scores[0].partyId}`
        const { name } = partyData[partyIdStr]
        const partylist = partylistData[name]

        const seats = partySeatsMap[partyIdStr]
        const numSeats = seats ? seats.length : 0
        const votesTotal = scores.reduce((sum, score) => sum + score.score, 0)
        const numCandidates: number = partylist
            ? partylist.candidates.length
            : 0

        return new Party({
            id: partyIdStr,
            electedMemberCount: numSeats,
            voteCount: votesTotal,
            partyListCandidateCount: numCandidates,
        })
    })

    const totalVotes = await calculateTotalVotes()
    const invalidVotes = await calculateInvalidVotes()
    const goodVotes = calculatePartyScores(partyScoresMap).reduce(
        (sum, votes) => sum + votes,
        0
    )
    const remainingVotes = totalVotes - invalidVotes - goodVotes

    partylists.push(
        new Party({
            id: 'dummy',
            electedMemberCount: 0,
            voteCount: remainingVotes < 0 ? 0 : remainingVotes,
            partyListCandidateCount: 150,
        })
    )

    return calculatePartyList(partylists)
        .filter(p => p.id !== 'dummy' && p.partyListMemberCount !== 0)
        .map(partylist => {
            const { codeEN, name, colorCode } = partyData[partylist.id]
            return {
                partyCode: codeEN,
                partyName: name,
                color: `#${colorCode}`,
                picture: `${CDN_IMGURL}/parties/${name}.png`,
                seats: partylist.partyListMemberCount as number,
            }
        })
        .sort((a, b) => b.seats - a.seats)
}
