import axios from 'axios-https-proxy-fix'

export const client = axios.create({
    baseURL: 'https://election.dttpool.com/api/',
    proxy: {
        host: '35.247.185.154',
        port: 15724,
    },
})
