import axios from 'axios'
export const client = axios.create({
    // baseURL: 'https://election.dttpool.com/api/',
    proxy: {
        host: '35.247.185.154',
        port: 3128,
        auth: {
            username: 'cloudfunction',
            password: 'f877u8MlyDzRSw31Rs2Ttj1u',
        },
    },
})

async function main() {
    try {
        const result = await client.get('https://google.com')
        console.log(result)
    } catch (e) {
        console.error(e)
    }
}

main()
