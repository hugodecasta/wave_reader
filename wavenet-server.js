class WAVENET_CLIENT {
    constructor(apikey, host = 'https://wns.hugocastaneda.fr') {
        this.apikey = apikey
        this.host = host
    }

    async __make_call(endpoint, data) {
        let options = { method: 'GET', headers: { 'wns-apikey': this.apikey } }
        if (data) {
            options.method = 'POST'
            options.headers['content-type'] = 'application/json'
            options.body = JSON.stringify(data)
        }
        const url = `${this.host}/api/${endpoint}`
        return await (await fetch(url, options)).json()
    }

    get_voices() {
        return this.__make_call('voices')
    }

    async tts(text, voice_name) {
        const file_name = await this.__make_call('tts', { text, voice_name })
        return `${this.host}/sounds/${file_name}`
    }
}