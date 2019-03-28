import { calculatePartyList, Party } from 'partylist-calculator'

import { Aggregator } from './Aggregator'
import { CDN_IMGURL } from '../constants'
import { calculateInvalidVotes, calculateTotalVotes } from '../util'

import tempPartyList from '../masterData/partyToPartylistMembersMap.json'
import tempParties from '../masterData/idToPartyMap.json'

const partylistData: any = tempPartyList
const partyData: any = tempParties

export async function etlPartylistData() {
    const aggregator = new Aggregator()
    const partySeatsMap = await aggregator.seatsMap()
    const partyScores = await aggregator.scoresByParty()

    const partylists = partyScores.map(scores => {
        const partyIdStr = `${scores[0].partyId}`
        const { name } = partyData[partyIdStr]
        const partylist = partylistData[name]
        const seats = partySeatsMap[partyIdStr]
        const numCandidates: number = partylist
            ? partylist.candidates.length
            : 0

        return new Party({
            id: partyIdStr,
            electedMemberCount: seats ? seats.length : 0,
            voteCount: scores.reduce((sum, score) => sum + score.score, 0),
            partyListCandidateCount: numCandidates,
        })
    })

    const totalVotes = await calculateTotalVotes()
    const invalidVotes = await calculateInvalidVotes()
    const goodVotes = partyScores.reduce(
        (psum, p) => psum + p.reduce((sum, s) => sum + s.score, 0),
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
