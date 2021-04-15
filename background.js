function get_data() {
    return new Promise(ok => chrome.storage.sync.get(['apikey', 'voice_name'], ok))
}

// '0305c419-dec1-4ff8-a310-54bad9087fa0'

chrome.contextMenus.create({
    id: 'wavenet-reader',
    contexts: ['selection'],
    title: 'Read with wavenet',
    onclick: async (info) => {
        const { apikey, voice_name } = await get_data()
        const client = new WAVENET_CLIENT(apikey);
        const { selectionText } = info
        const src = await client.tts(selectionText, voice_name)
        const audio = new Audio(src)
        audio.play()
    }
});