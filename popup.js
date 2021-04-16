// ------------------------------------- METHODS

async function load_voices() {
    try {
        const client = new WAVENET_CLIENT(apikey_input.value)
        const voices = await client.get_voices()
        if ('error' in voices) throw 'cannot retrieve voices'

        infos_p.innerHTML = ''
        voice_titles_tr.innerHTML = ''
        voice_selects_tr.innerHTML = ''

        const langs = Object.keys(Object.values(voices)[0])
        const lang_select = {}
        langs.forEach(lang => {
            let title = document.createElement('th')
            title.innerHTML = lang + ' voices'
            voice_titles_tr.appendChild(title)
            let td = document.createElement('td')
            let select = document.createElement('select')
            td.appendChild(select)
            voice_selects_tr.appendChild(td)
            lang_select[lang] = select
        })

        Object.keys(voices).forEach(voice_name => {
            langs.forEach(lang => {
                let voice_option = document.createElement('option')
                voice_option.innerHTML = 'voice - ' + voice_name
                voice_option.value = voice_name
                lang_select[lang].appendChild(voice_option)
            })
        })
        langs.forEach(lang => lang_select[lang].value = voices_name[lang])
        langs.forEach(lang =>
            lang_select[lang].onchange = () => {
                voices_name[lang] = lang_select[lang].value
                save_data()
            })
        return true
    }
    catch (e) {
        console.error(e)
        infos_p.innerHTML = 'wrong api key'
    }
    return false
}

function save_data() {
    chrome.storage.sync.set({ apikey, voices_name, volume });
}

function get_data() {
    return new Promise(ok => chrome.storage.sync.get(['apikey', 'voices_name', 'volume'], ok))
}

// ------------------------------------- INIT

let { apikey, voices_name, volume } = await get_data()
voices_name ||= {}
volume ||= 1
console.log(voices_name)

const apikey_input = document.getElementById('apikey')
const infos_p = document.getElementById('infos')
const volume_slider = document.getElementById('volume')
apikey_input.value = apikey
volume_slider.value = volume * 100

const voice_titles_tr = document.getElementById('voice_titles')
const voice_selects_tr = document.getElementById('voice_selects')

await load_voices()

// ------------------------------------- EVENTS

apikey_input.onchange = async () => {
    apikey = apikey_input.value
    if (await load_voices()) save_data()
}

volume_slider.onchange = async () => {
    volume = volume_slider.value / 100
    save_data()
}