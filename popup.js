// ------------------------------------- METHODS

(async function () {
    async function load_voices() {
        try {
            const client = new WAVENET_CLIENT(apikey_input.value)
            const voices = await client.get_voices()
            if ('error' in voices) throw 'cannot retrieve voices'

            infos_p.innerHTML = ''
            voice_titles_tr.innerHTML = ''
            voice_selects_tr.innerHTML = ''
            translate_langs_select.innerHTML = ''

            const langs = Object.keys(Object.values(voices)[0])

            langs.forEach(lang => {
                let translate_lang_option = document.createElement('option')
                translate_lang_option.value = lang
                translate_lang_option.innerHTML = lang
                translate_langs_select.appendChild(translate_lang_option)
            })
            translate_langs_select.value = translate_to

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
        chrome.storage.sync.set({ apikey, voices_name, volume, translate_to });
    }

    function get_data() {
        return new Promise(ok => chrome.storage.sync.get(['apikey', 'voices_name', 'volume', 'translate_to'], ok))
    }

    // ------------------------------------- INIT

    let { apikey, voices_name, volume, translate_to } = await get_data()
    voices_name ||= {}
    volume ||= 1
    console.log(voices_name)

    const apikey_input = document.getElementById('apikey')
    const infos_p = document.getElementById('infos')
    const volume_slider = document.getElementById('volume')
    const force_translate_cb = document.getElementById('force_translate')
    const translate_langs_select = document.getElementById('translate_langs')

    apikey_input.value = apikey
    volume_slider.value = volume * 100
    force_translate_cb.checked = translate_to != null
    translate_langs_select.value = translate_to
    translate_langs_select.disabled = translate_to == null

    const voice_titles_tr = document.getElementById('voice_titles')
    const voice_selects_tr = document.getElementById('voice_selects')

    await load_voices()

    // ------------------------------------- EVENTS

    force_translate_cb.onchange = async () => {
        let checked = force_translate_cb.checked
        if (!checked) translate_to = null
        else {
            const client = new WAVENET_CLIENT(apikey_input.value)
            const voices = await client.get_voices()
            translate_to = Object.keys(Object.values(voices)[0])[0]
        }
        translate_langs_select.value = translate_to
        translate_langs_select.disabled = translate_to == null
        save_data()
    }

    translate_langs_select.onchange = () => {
        translate_to = translate_langs_select.value
        save_data()
    }

    apikey_input.onchange = async () => {
        apikey = apikey_input.value
        if (await load_voices()) save_data()
    }

    volume_slider.onchange = async () => {
        volume = volume_slider.value / 100
        save_data()
    }
})()