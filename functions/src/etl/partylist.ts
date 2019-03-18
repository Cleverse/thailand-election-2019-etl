import { calculatePartyList, Party } from 'partylist-calculator'

import { sortScores, calculateSeatMap } from './map'
import { newFakeMapper } from '../mapper/FakeMapper'

import * as tempPartyList from '../masterData/partyToPartylistMembersMap.json'
import * as tempParties from '../masterData/idToPartyMap.json'

const partylistData: any = tempPartyList
const partyData: any = tempParties

// remove key `default` from importing using *
delete partylistData.default
delete partyData.default

export async function etlPartylistData() {
    const mapper = newFakeMapper()
    const scores = await mapper.fetchScores()
    const seats = calculateSeatMap(sortScores(scores))
    const provinces = await mapper.fetchProvinces()

    const parties = await mapper.fetchParties()
    const partylists = parties.map(party => {
        const { id, votesTotal, name } = party
        const partyId = `${id}`

        const partylist = partylistData[name]
        const numSeats = seats[partyId] ? seats[partyId].length : 0
        const numCandidates: number = partylist
            ? partylist.candidates.length
            : 0

        return new Party({
            id: partyId,
            electedMemberCount: numSeats as number,
            voteCount: votesTotal,
            partyListCandidateCount: numCandidates,
        })
    })

    const remainingVotes = provinces.reduce((remaining, province) => {
        const { goodVotes, badVotes, noVotes, votesTotal } = province
        return remaining + votesTotal - (goodVotes + badVotes + noVotes)
    }, 0)

    partylists.push(
        new Party({
            id: 'dummy',
            electedMemberCount: 0,
            voteCount: remainingVotes,
            partyListCandidateCount: 150,
        })
    )

    return calculatePartyList(partylists)
        .filter(p => p.id !== 'dummy')
        .map(partylist => {
            const { codeEN, name, logoUrl } = partyData[partylist.id]
            return {
                partyCode: codeEN,
                partyName: name,
                picture: logoUrl,
                seats: partylist.partyListMemberCount as number,
            }
        })
        .sort((a, b) => b.seats - a.seats)
}
