import * as fs from 'fs'
import { Parser } from 'csv-parse'

const content = fs.createReadStream('partylist.csv')
const parser = new Parser({})

const set = [
    'deafd1fe-3f79-40bc-814e-c70e9e37b16d',
    'a91b13d1-0f12-47e4-9cd4-ff180a0e59e6',
    '25209874-965c-48ad-8c4e-831c508451b9',
    'e9eda19d-fb56-4c6f-965b-54a6842dea28',
    'dc809468-57f9-4817-bed8-8ca2ccb3bd68',
    'c4e8a178-4d3d-41cf-976a-f1be91cc9da7',
    '876a0daf-eb73-480a-9e84-25616f6539bb',
    '54a80859-437e-41c3-b1f4-cafbfa1c9cc4',
    '5b0bfa73-0d7b-4540-96ba-d2d0e138a8c2',
    'b59f28f8-e4a7-4d75-8469-79c036662d5a',
    '2049d075-e302-41fa-90f2-8a5e7a8d42a9',
    '8c9c5948-e491-406f-bc85-dffe0b27c6e4',
    '3395ddfe-acd9-4cba-982a-ea289cb8626b',
    '95c77e4e-3ed4-413e-b248-647ef2c5b0f4',
    'b54b4f1d-221f-43b2-99bf-cdc570274beb',
    '704389b3-b525-487d-91fa-7ace08254062',
    '2bb94ec1-7a81-45e5-a948-57a97d4871f1',
    'ec9a6ac5-bebd-429b-8d0a-4696c934706e',
    '11e6aa77-8cc8-45a1-adaf-7e12c3832391',
    '139d91a7-b9a6-493d-9755-74bbed19c567',
    'beb4c16e-1e27-4758-8fb5-9c4ddc77e70c',
    'c70929f3-4341-469f-ab7f-272737167ede',
    'b6bbdeb6-c8bb-40e2-95fb-371ae1a554dc',
    '015af0ab-7718-445e-b163-dca9f3e4d603',
    '013b64ce-fa0c-4003-ad97-e8ab45fc7f2e',
    '06c42666-5398-4aa1-b0a0-16cf32fe7675',
    '00511abc-e73e-40e2-bbbd-2ab1e40989e2',
    '95318246-0dc6-4d7e-81d8-eb12c024d4b5',
    '54b5df3d-29da-45d1-aa26-1d02fe146f2c',
    'f8aa34e2-1d2c-443a-a2d2-9ccab96695cf',
    '686f8c96-da48-48a5-a1c7-016a30904eb2',
    '9f7e7090-851f-4e06-a696-8e87bc97ac10',
    'b13771d3-32fe-469a-9030-542d181f9b51',
    'db5a1309-eb12-4d56-9c92-9fe4d8d7891d',
    'd404891b-4620-48ec-b41b-c2bd94877d3d',
    '7dbc692c-cb18-4270-9f35-1e57df14ca8e',
    '36b1ee3a-30de-49b8-a518-59ba4b64e804',
    'cd0380df-40f3-4f0f-a09a-e242ef42016b',
    '60649d82-4fb6-40fb-9b77-1dc4e392dabf',
    '4dc90488-2070-4915-af96-c0a4a39ba910',
    'a426e94a-2153-446e-9825-8c3385696ced',
    'cbc7ed35-daf3-470b-8504-b92ea6826a19',
    'bc058175-dbd0-4653-b8f3-f0dff236b509',
    '1a094cd6-40dd-45d8-b8a5-82ee3d6bac00',
    'd211272b-e692-4d6e-a65e-c537ca525a64',
    '00985db0-6619-450c-9f6a-ae5be05bd87b',
    'b331799d-e81c-48d8-9941-4da2f68b5df2',
    '8f3e9985-0972-41f6-afcf-507a38696d2f',
    'e3262ce8-6833-406d-a226-e57da8970242',
    '41673257-2e95-4d4e-aabc-64eff8c65861',
    '9aadcee2-1080-4353-b454-435eea718912',
    'f21bfce3-4964-4a7c-a148-8468865d49d9',
    '70eb04d3-82d7-4812-abf3-5c3e4b301407',
    '7664ed5a-d0f1-4b88-a5c4-f1586a4ea2f5',
    '6159bb3d-1764-415f-baf7-d6879536a1b2',
    '4c81ab06-62bf-40f9-8f7d-2d81d83fda8c',
    '395bc6f4-6bdc-4e73-9909-4023753a62f6',
    '60173e2e-dea1-4806-9db7-4e3a1b0dbc34',
    'bdb4d003-07f5-48ac-9bdf-e80f35474fc2',
    '4dccc057-fba0-45f9-aa89-2a6d53c3cdd6',
    '13f79d79-e800-4e7e-ba45-068660464ba3',
    '86e083e1-1955-44e9-ab46-c3437ac7a3b6',
    'ee52c3f3-a75f-48f7-ae03-812ebb69f0ad',
    'f93ed9b1-c71d-4610-8b21-66b601a3c17b',
    'a135522f-82c0-4c25-85c8-773df1d4b4a3',
    'c37a7d12-1b39-4316-9efa-3256f103ebfc',
    'd8834eac-5759-4ac2-8fbe-a73d35ef4054',
    'd7fdcdae-ba52-42ae-ac8b-337c163b65a8',
    '1f147eb4-4320-45b7-9cd7-526b03bd0708',
    '4de2758a-9758-4a67-a7d0-305726ce59fd',
    '3ba4dc77-9dd5-4777-85de-2ac5662c412c',
    '482c24b5-05f1-4df1-af3f-3c1b11f07fda',
    '990bb174-002f-40a8-850f-d08c1637c223',
    '1c0cc35a-2951-4b23-8212-ed74b35c8c71',
    '175c2c75-e3e4-4926-8628-b0008656b3b2',
    'c40711f0-b9ff-4fc9-a8e5-1fa2a92f8c2a',
    'c91f71f1-2b09-4f5c-9b48-3b7fe1a9b91b',
    '322926ce-6691-45cb-a09e-10605b4ece73',
    'cd54a39c-6bba-43ee-a08e-04c42bfdfbae',
    'ecaa493e-868d-4fa3-b36c-166b6d417c4c',
    '3ccc4eaa-a176-4833-afbf-3d49e36a1dc6',
    '31ca02b8-3a54-4c42-8137-462985e0b1f4',
    'c32dacd9-66bb-4b8d-b408-a464ae4d6fe2',
    '66981207-c8e7-44bc-9c6f-e8d36d29cb5f',
    '3049c90b-24d1-4f0c-83ff-86ac83894d49',
    '1ba5c2a1-30e6-4fde-90d8-b61b4ff8a9cc',
    '67e4ac57-efec-4fc5-a535-e002529e48b6',
    '721aba9c-9f04-4b6a-aa8b-56cffe99553f',
    '36d038cd-55ad-4acf-ab0d-b46e3bdbea06',
    '843e8be0-f3b7-42c5-a6e5-a9ee09afff41',
    '1859206a-2187-4ba1-8de9-203a98835aa7',
    '01d7777f-cca8-425c-a951-3c7e1c727782',
    '87748f55-a58c-40ba-8799-5e864b2d6afb',
    '1415f4d1-a881-414f-ba2a-9c1922454685',
    'da21ae48-f936-4a3c-85c0-8f8a55eb362d',
    '73fcee1d-aed5-4122-a66c-695a8c5e2e6f',
    'dd0d3cd2-99db-4c49-8043-5a591e5b8b7b',
    'b8466aeb-c621-421f-8830-290f5b38d975',
    '228144ba-6877-4501-b755-9bd6c4ac2da3',
    'b570abb4-c4af-4231-889b-610b7974e7a9',
]

const output: Array<string[]> = []

parser.on('readable', () => {
    let record
    do {
        record = parser.read()
        output.push(record)
    } while (record)
})

parser.on('error', err => {
    console.log('ERROR', err)
})

parser.on('end', () => {
    const records = output.slice(1).filter(record => Boolean(record))
    console.log('length', records.length)
    const constituencyMap = records.reduce(
        (map, record) => {
            const [
                guid,
                partyName,
                title,
                firstName,
                lastName,
                no,
                age,
                education,
                occupation,
                voteable,
            ] = record

            const value = {
                guid,
                partyName,
                title,
                firstName,
                lastName,
                no,
                age,
                education,
                occupation,
                voteable,
            }

            if (set.includes(guid.toLowerCase())) {
                console.log(value)
                return map
            }

            const key = `${partyName}:${no}`
            map[key] = value

            return map
        },
        {} as any
    )

    fs.writeFileSync('test.json', JSON.stringify(constituencyMap, undefined, 2))
})

content.pipe(parser)
