module.exports = function (session) {
  const Store = session.Store

  // All callbacks should have a noop if none provided for compatibility
  // with the most Redis clients.
  const noop = () => {
  }

  class JwtStore extends Store {
    constructor(options = {}) {
      super(options)
      if (!options.client) {
        throw new Error('A client must be directly provided to the RedisStore')
      }

      this.prefix = options.prefix == null ? 'sess:' : options.prefix
      this.scanCount = Number(options.scanCount) || 100
      this.serializer = options.serializer || JSON
      this.client = options.client
      this.ttl = options.ttl || 86400 // One day in seconds.
      this.disableTouch = options.disableTouch || false
    }

    get(sid, cb = noop) {
      let key = this.prefix + sid

      this.client.get(key, (err, data) => {
        if (err) return cb(err)
        if (!data) return cb()

        let result
        try {
          result = this.serializer.parse(data)
        } catch (err) {
          return cb(err)
        }
        return cb(null, result)
      })
    }

    set(sid, sess, cb = noop) {
      let args = [this.prefix + sid]

      let value
      try {
        value = this.serializer.stringify(sess)
      } catch (er) {
        return cb(er)
      }
      args.push(value)
      args.push('EX', this._getTTL(sess))

      this.client.set(args, cb)
    }

    touch(sid, sess, cb = noop) {
      if (this.disableTouch) return cb()

      // let key = this.prefix + sid
      cb(null, 'OK')
    }

    destroy(sid, cb = noop) {
      cb();
    }

    clear(cb = noop) {
      cb();
    }

    length(cb = noop) {
      cb(null, 0)
    }

    ids(cb = noop) {
      return cb(null, [])
    }

    all(cb = noop) {
      return cb(null, [])
    }

    _getTTL(sess) {
      let ttl
      if (sess && sess.cookie && sess.cookie.expires) {
        let ms = Number(new Date(sess.cookie.expires)) - Date.now()
        ttl = Math.ceil(ms / 1000)
      } else {
        ttl = this.ttl
      }
      return ttl
    }

    _getAllKeys(cb = noop) {
      let pattern = this.prefix + '*'
      this._scanKeys({}, 0, pattern, this.scanCount, cb)
    }

    _scanKeys(keys = {}, cursor, pattern, count, cb = noop) {
      cb(null, [])
    }
  }

  return JwtStore
}
