var loggers = require('./loggers.js')

class AllRoundsFinished extends Error {
    constructor() {
        super('AllRoundsFinished')
        loggers.silly_logger(AllRoundsFinished, arguments, 'general', __filename)
        this.code = 549
        this.text = 'All rounds finished'
        this.msg = 'AllRoundsFinished'
    }
}

class NoRollBack extends Error {
    constructor() {
        super('NoRollBack')
        loggers.silly_logger(NoRollBack, arguments, 'general', __filename)
        this.code = 550
        this.text = 'Cannot rollback more'
        this.msg = 'NoRollBack'
    }
}

class DoesNotExist extends Error {
    constructor(identity) {
        super('DoesNotExist')
        loggers.silly_logger(DoesNotExist, arguments, 'general', __filename)
        this.identity = identity
        this.code = 551
        this.text = 'The target with identity '+JSON.stringify(this.identity)+' does not exist'
        this.msg = 'DoesNotExist'
    }
}

class AlreadyExists extends Error {
    constructor(identity) {
        super('AlreadyExists')
        loggers.silly_logger(AlreadyExists, arguments, 'general', __filename)
        this.identity = identity
        this.code = 552
        this.text = 'The target with identity '+JSON.stringify(this.identity)+' already exists'
        this.msg = 'AlreadyExists'
    }
}

class ResultNotSent extends Error {
    constructor(id, role) {
        super('ResultNotSent')
        loggers.silly_logger(ResultNotSent, arguments, 'general', __filename)
        this.id = id
        this.role = role
        this.code = 553
        this.text = 'The result of '+this.role.toString()+' '+this.id.toString()+' is not sent'
        this.msg = 'ResultNotSent'
    }
}

class WinPointsDifferent extends Error {
    constructor(id, wins) {
        super('WinPointsDifferent')
        loggers.silly_logger(WinPointsDifferent, arguments, 'general', __filename)
        this.id = id
        this.wins = wins
        this.code = 554
        this.text = 'Win(Win-points) is not unified on team '+this.id.toString()+', win points('+this.wins.toString()+')'
        this.msg = 'WinPointsDifferent'
    }
}

class NeedMore extends Error {
    constructor(role, atleast) {
        super('NeedMore'+role.charAt(0).toUpperCase() + role.slice(1))
        loggers.silly_logger(NeedMore, arguments, 'general', __filename)
        this.role = role
        this.atleast = atleast
        this.code = 555
        this.text = 'At least '+this.atleast.toString()+' more available '+this.role.toString()+' is needed'
        this.msg = 'NeedMore'+this.role.charAt(0).toUpperCase() + this.role.slice(1)
    }
}

class DebaterNotRegistered extends Error {
    constructor(id, r) {
        super('DebaterNotDefined')
        loggers.silly_logger(DebaterNotRegistered, arguments, 'general', __filename)
        this.id = id
        this.r = r
        this.code = 556
        this.text = 'debaters of team '+this.id.toString()+' in the round '+this.r+' is not defined'
        this.msg = 'DebaterNotDefined'
    }
}

class EntityNotDefined extends Error {
    constructor(id, role) {
        super(role.charAt(0).toUpperCase()+role.slice(1)+'NotDefined')
        loggers.silly_logger(EntityNotDefined, arguments, 'general', __filename)
        this.id = id
        this.role = role
        this.code = 557
        this.text = this.role.charAt(0).toUpperCase()+this.role.slice(1)+' '+this.id.toString()+' is not defined'
        this.msg = this.role.charAt(0).toUpperCase()+this.role.slice(1)+'NotDefined'
    }
}

exports.AllRoundsFinished = AllRoundsFinished
exports.DoesNotExist = DoesNotExist
exports.AlreadyExists = AlreadyExists
exports.ResultNotSent = ResultNotSent
exports.WinPointsDifferent = WinPointsDifferent
exports.NeedMore = NeedMore
exports.DebaterNotRegistered = DebaterNotRegistered
exports.EntityNotDefined = EntityNotDefined
