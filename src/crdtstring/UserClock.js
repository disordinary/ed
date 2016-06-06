class UserClock {
    constructor( user_id ) {
        this._user_id = user_id;
        this.clock = 0;
    }

    update( ) {
        ++this.clock;
        return this;
    }

    toString( ) {
        return [ this._user_id , this.clock ].join( "/" );
    }

}
if( typeof module !== 'undefined' ) {
    module.exports = UserClock;
}
