// ------------------------------------- METHODS

async function load_voices() {
    try {
        const client = new WAVENET_CLIENT(apikey_input.value)
        const voices = await client.get_voices()
        if ('error' in voices) throw 'cannot retrieve voices'
        voices_select.innerHTML = ''
        infos_p.innerHTML = ''
        Object.keys(voices).forEach(voice_name => {
            let voice_option = document.createElement('option')
            voice_option.innerHTML = voice_name
            voice_option.value = voice_name
            voices_select.appendChild(voice_option)
        })
        voices_select.value = voice_name
        return true
    }
    catch (e) {
        console.error(e)
        infos_p.innerHTML = 'wrong api key'
    }
    return false
}

function save_data(apikey, voice_name) {
    console.log('saving', { apikey, voice_name })
    chrome.storage.sync.set({ apikey, voice_name });
}

function get_data() {
    return new Promise(ok => chrome.storage.sync.get(['apikey', 'voice_name'], ok))
}

// ------------------------------------- INIT

let { apikey, voice_name } = await get_data()

const apikey_input = document.getElementById('apikey')
const voices_select = document.getElementById('voices')
const infos_p = document.getElementById('infos')
apikey_input.value = apikey
voices_select.value = voice_name

await load_voices()

// ------------------------------------- EVENTS

voices_select.onchange = () => {
    voice_name = voices_select.value
    save_data(apikey, voice_name)
}

apikey_input.onchange = async () => {
    apikey = apikey_input.value
    if (await load_voices())
        save_data(apikey, voice_name)
}