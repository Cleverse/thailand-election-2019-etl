import { calculatePartyList, Party } from 'partylist-calculator'

import { calculateSeats, sortScores } from './map'
import { newFakeMapper } from '../mapper/FakeMapper'
import * as tempPartyList from '../masterData/partylistMap.json'
import * as tempParties from '../masterData/partyMap.json'

const partylistData: any = tempPartyList
const partyData: any = tempParties

// remove key `default` from importing using *
delete partylistData.default
delete partyData.default

export async function etlPartylistData() {
    const mapper = newFakeMapper()
    const scores = await mapper.fetchScores()
    const zoneMap = sortScores(scores)
    const seats = calculateSeats(zoneMap)
    const provinces = await mapper.fetchProvinces()

    const parties = await mapper.fetchParties()
    const partylists = parties
        .map(party => {
            const { id, votesTotal, name } = party
            const partyId = `${id}`

            const partylist = partylistData[name]
            const numSeats = seats[partyId]
            if (!partylist || !numSeats) {
                return null
            }

            const numCandidates: number = partylist.candidates.length

            return new Party({
                id: partyId,
                electedMemberCount: numSeats as number,
                voteCount: votesTotal,
                partyListCandidateCount: numCandidates,
            })
        })
        .filter(p => p !== null)

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

    return calculatePartyList(partylists as Party[])
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
        .sort((a, b) => (a.seats > b.seats ? -1 : 1))
}
