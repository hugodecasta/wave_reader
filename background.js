function get_data() {
    return new Promise(ok => chrome.storage.sync.get(['apikey', 'voices_name', 'volume'], ok))
}

function detect_language(text) {
    return new Promise(ok => chrome.i18n.detectLanguage(text, ({ languages: [{ language }] }) => ok(language)))
}

const lang_map = {
    'fr': 'fr-FR',
    'en': 'en-US'
}

chrome.contextMenus.create({
    id: 'wavenet-reader',
    contexts: ['selection'],
    title: 'Read with wavenet',
    onclick: async (info) => {
        const { apikey, voices_name, volume } = await get_data()
        const client = new WAVENET_CLIENT(apikey);
        const { selectionText } = info
        const detected_language = await detect_language(selectionText)
        const lang = lang_map[detected_language] ?? 'en-US'
        const voice_name = voices_name[lang]
        const src = await client.tts(selectionText, voice_name, lang)
        const audio = new Audio(src)
        console.log(volume)
        audio.volume = volume
        audio.play()
    }
});