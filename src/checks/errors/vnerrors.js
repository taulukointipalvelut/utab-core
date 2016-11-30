class ErrorUnavailable {
    constructor(id) {
        this.id = id
    }
    stringify() {
        return 'Unavailable venue '+this.id.toString()+ ' appears'
    }
    shorten() {
        return 'Unavailable'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
