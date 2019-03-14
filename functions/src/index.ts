import { https } from 'firebase-functions'

import { newFakeMapper } from './mapper/fakeMapper'

export const main = https.onRequest(async (_, res) => {
    const mapper = newFakeMapper()
    const score = await mapper.score()
    res.status(200)
    res.type('application/json')
    res.write(JSON.stringify(score))
    res.end()
})
