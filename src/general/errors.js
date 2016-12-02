class AllRoundsFinished extends Error {
    constructor() {
        super('AllRoundsFinished')
        this.code = 549
    }
    stringify() {
        return 'All rounds finished'
    }
    shorten() {
        return 'AllRoundsFinished'
    }
}

class NoRollBack extends Error {
    constructor() {
        super('NoRollBack')
        this.code = 550
    }
    stringify() {
        return 'Cannot rollback more'
    }
    shorten() {
        return 'NoRollBack'
    }
}

class DoesNotExist extends Error {
    constructor(identity) {
        super('DoesNotExist')
        this.identity = identity
        this.code = 551
    }
    stringify() {
        return 'The target with identity '+this.identity.toString()+'does not exist'
    }
    shorten() {
        return 'DoesNotExist'
    }
}

class AlreadyExists extends Error {
    constructor(identity) {
        super('AlreadyExists')
        this.identity = identity
        this.code = 552
    }
    stringify() {
        return 'The target with identity '+this.identity.toString()+'does not exist'
    }
    shorten() {
        return 'AlreadyExists'
    }
}

class ResultNotSent extends Error {
    constructor(id, role) {
        super('ResultNotSent')
        this.id = id
        this.role = role
        this.code = 553
    }
    stringify() {
        return 'The result of '+this.role.toString()+' '+this.id.toString()+' is not sent'
    }
    shorten() {
        return 'ResultNotSent'
    }
}

class WinPointsDifferent extends Error {
    constructor(id, wins) {
        super('WinPointsDifferent')
        this.id = id
        this.wins = wins
        this.code = 554
    }
    stringify() {
        return 'Win(Win-points) is not unified on team '+this.id.toString()+', win points('+this.wins.toString()+')'
    }
    shorten() {
        return 'WinPointsDifferent'
    }
}

class NeedMore extends Error {
    constructor(role, atleast) {
        super('NeedMore'+role.charAt(0).toUpperCase() + role.slice(1))
        this.role = role
        this.atleast = atleast
        this.code = 555
    }
    stringify() {
        return 'At least '+this.atleast.toString()+' more available '+this.role.toString()+' is needed'
    }
    shorten() {
        return 'NeedMore'+this.role.charAt(0).toUpperCase() + this.role.slice(1)
    }
}

class RelationNotDefined extends Error {
    constructor(id, x, y) {
        super(x.charAt(0).toUpperCase()+x.slice(1)+'To'+y.charAt(0).toUpperCase()+y.slice(1)+'NotDefined')
        this.id = id
        this.x = x
        this.y = y
        this.code = 556
    }
    stringify() {
        return this.y.charAt(0).toUpperCase() + this.y.slice(1) + 's of '+this.x.charAt(0)+this.x.slice(1)+' '+this.id+' is not defined'
    }
    shorten() {
        return this.x.charAt(0).toUpperCase()+this.x.slice(1)+'To'+this.y.charAt(0).toUpperCase()+this.y.slice(1)+'NotDefined'
    }
}

class EntityNotDefined extends Error {
    constructor(id, role) {
        super(role.charAt(0).toUpperCase()+role.slice(1)+'NotDefined')
        this.id = id
        this.role = role
        this.code = 557
    }
    stringify() {
        return this.role.charAt(0).toUpperCase()+this.role.slice(1)+' '+this.id.toString()+' is not defined'
    }
    shorten() {
        return this.role.charAt(0).toUpperCase()+this.role.slice(1)+'NotDefined'
    }
}

exports.AllRoundsFinished = AllRoundsFinished
exports.DoesNotExist = DoesNotExist
exports.AlreadyExists = AlreadyExists
exports.ResultNotSent = ResultNotSent
exports.WinPointsDifferent = WinPointsDifferent
exports.NeedMore = NeedMore
exports.RelationNotDefined = RelationNotDefined
exports.EntityNotDefined = EntityNotDefined
