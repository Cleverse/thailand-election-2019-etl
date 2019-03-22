import { calculatePartyList, Party } from 'partylist-calculator'

import { sortScores, calculateSeats, calculatePartyScores } from './map'
import { CDN_IMGURL } from '../constants'
import { calculateInvalidVotes, calculateTotalVotes } from '../util'

import tempPartyList from '../masterData/partyToPartylistMembersMap.json'
import tempParties from '../masterData/idToPartyMap.json'
import { newMapper } from '../mapper/IMapper'

const partylistData: any = tempPartyList
const partyData: any = tempParties

export async function etlPartylistData() {
    const mapper = newMapper()
    const scores = await mapper.scores()
    const partySeats = calculateSeats(sortScores(scores))
    const partyScores = calculatePartyScores(partySeats)

    const partylists = partySeats.map((seats, index) => {
        const { partyId } = seats[0]
        const partyIdStr = `${partyId}`
        const { name } = partyData[partyIdStr]
        const partylist = partylistData[name]

        const numSeats = seats.length
        const votesTotal = partyScores[index]
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
    const goodVotes = partyScores.reduce((sum, votes) => sum + votes, 0)
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
        .filter(p => p.id !== 'dummy')
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
