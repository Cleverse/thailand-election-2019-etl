import FormData from 'form-data'
import { IncomingMessage } from 'http'

export async function invalidateCache() {
    const formData = new FormData()
    formData.append(
        'url',
        'https://cdn.vote.workpointnews.com/data/latest.json'
    )

    const response = await submitAsync(
        formData,
        'https://fleet.byteark.com/purge/889/zeQMsjv0L4LG7Qdi'
    )

    if (response.statusCode !== 200) {
        throw new Error('non-ok response')
    }
}

function submitAsync(form: FormData, url: string) {
    return new Promise<IncomingMessage>((resolve, reject) => {
        form.submit(url, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}
