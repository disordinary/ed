
if( typeof module !== 'undefined' && typeof Clock === 'undefined' ) {
    var Clock = require('./UserClock.js');
} else {
    var Clock = UserClock;
}

let serverClock =  new Clock( 0 ); //a server user

const START_STRING = String.fromCharCode(2);
const END_STRING = String.fromCharCode(3)

class CRDTString {
    get serverClock( ) {
        return serverClock;
    }

    constructor( string ) {

        this._chars = { };

        this._first; //the first character

        this._fromString( START_STRING + string + END_STRING );
    }

    _fromString( string ) {
        let chars = string.split( '' );
        let previousChar;
        for( let i= 0 ; i < chars.length; i++ ) {
            let char = new CRDTChar( chars[ i ] , serverClock );
            this._chars[ char.id ] = char;
            if( previousChar ) {
                char.previous = previousChar;
                previousChar.next = char;
            }
            if( i === 0 ) {
                this._first = char;
            }
            previousChar = char;
        }
    }

    toString( ) {
        let char = this._first;
        let return_string = [ ];
        while( char ) {
            if( char.visible > 0 ) {
                return_string.push(char.toString());
            } 
            char = char.next;
        }
        //console.log( this._chars );
        return return_string.join( '' );
    }
    //should be set but we're just testing here
    insert( clock , char  , next ) {
       // console.log( this._chars[ next ].previous.next );
        let _char = new CRDTChar( char , clock );

        _char.previous = this._chars[ next.id ].previous;
        _char.next = this._chars[ next.id ];
        this._chars[ next.id ].previous.next = _char;
        this._chars[ next.id ].previous = _char;
        this._chars[ clock ] = _char;

        return {
            verb : 'put',
            clock : _char.id,
            char,
            next : _char.next.id
        }
    }

    update( updateObj ) {
        if( updateObj.verb == "put" ) {
            this.insert( updateObj.clock , updateObj.char, this._chars[ updateObj.next ] );
        } else if( updateObj.verb == 'del' ) {
            this.del( updateObj.clock );
        }
    }

    getCharAt( offset ) {
        let char = this._first;
        for( let i = 0; i < offset && char.next; i++ ) {
            char = char.next;
        }

        return char;
    }

    del( clock ) {
        console.log( "DC" , clock );
        this._chars[ clock ].visible=-1;
        return {
            verb : 'del',
            clock : clock
        }
    }
    toJSON( ) {
        let ro = {}; //the object to return
        ro.first = this._first.id.toString();
        ro.chars = [ ];
        for( let char in this._chars ) {

              ro.chars.push(
                  {
                    previous : this._chars[char].previous ? this._chars[char].previous.id.toString() : null,
                    next : this._chars[char].next ? this._chars[char].next.id.toString() : null ,
                    value : this._chars[ char ].value,
                    id : this._chars[ char ].id.toString( ),
                    visible : this._chars[ char ].visible
                }
            );


        }
        return JSON.stringify( ro );
    }

    fromJSON( jsonString ) {
        let o = JSON.parse( jsonString );
        this._chars = { };
     //   console.log( jsonString );
        for( let char of o.chars ) {
            //console.log( char );
            let _char = new CRDTChar(char.value , char.id);
            _char.next = char.next;
            _char.previous = char.previous;
            this._chars[ char.id ] = _char;
        }

        for( let char in this._chars ) {
            if( typeof this._chars[ char ].next == 'string' ) {
                this._chars[ char ].next =this._chars[ this._chars[ char ].next ];
            }
            if( typeof this._chars[ char ].previous == 'string' ) {
                this._chars[ char ].previous =this._chars[ this._chars[ char ].previous ];
            }
        }
        this._first = this._chars[ o.first ];

    }
}

class CRDTChar {
    constructor( char , clock ) {
        this.previous; //the previous CRDTChar
        this.next; //the next CRDTChar
        this.value = char; //the js char
        this.visible = 1;
        if( typeof clock == 'string') {
            this.id = clock;
        } else {
            this.id = clock.update().toString(); //the clock of the creator
        }
    }

    toString( ) {
        return this.value;
    }
}



if( typeof module !== 'undefined' ) {
    module.exports = CRDTString;
}