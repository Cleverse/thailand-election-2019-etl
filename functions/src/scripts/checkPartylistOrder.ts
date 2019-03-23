import tempPartylist from '../masterData/partyToPartylistMembersMap.json'

const partylistData: any = tempPartylist

function main() {
    Object.values(partylistData).map((partylist: any) => {
        const { candidates } = partylist
        candidates.reduce((prev: any, curr: any) => {
            if (prev.no > curr.no) {
                console.log('OMG', prev, curr)
            }

            return curr
        })
    })
}

main()
