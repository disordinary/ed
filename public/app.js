var socket = io.connect();
var crdt = new CRDTString();
var user;
var clock;
var cursor_pos = 1;
var emsize;
var cursors = [ ];
socket.on('youAre' , ( userID ) => {
    addHappening("Recieved user id of: " + userID );
    user = userID;
    clock = new Clock( userID );
} ) ;
socket.on('document' , ( data ) => {
    //document.getElementById('doc');
    crdt.fromJSON( data );


    doc.innerHTML = render(crdt , cursors[ 0 ]);//crdt.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');;
    addHappening("Recieved document" );
    cursors.length = 0;
    cursors.push(createCursor( ) );
} ) ;

socket.on('update' , ( data ) => {
    if( data.clock.split('/')[0] != clock._user_id )
    {
        crdt.update(data);
        doc.innerHTML = render(crdt , cursors[ 0 ] );//crdt.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');;
        addHappening("Recieved update: " + JSON.stringify( data ) );
    }
});


window.onload = ( ) => {
    emsize = measureText( );
    let keyInput = document.getElementById('keyinput');
    keyInput.onkeypress = ( eargs ) => {

        if( eargs.charCode < 20 ) return;
        let input = eargs.target;
        let update = crdt.insert(clock , String.fromCharCode(eargs.charCode) , cursors[0].character );
        socket.emit( 'update', update );
        addHappening("Sent update: " + JSON.stringify( update ) );


        input.value = "";
        doc.innerHTML = render(crdt , cursors[ 0 ] );//crdt.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');;
        //  cursors[ 0 ].move(1);
        // socket.emit('update', JSON.stringify( { verb : 'put' , clock : "2/1" , next : "0/6" , char : '@' } ););
    }

    keyInput.onkeydown = (eargs ) => {
        console.log( eargs.keyCode );
        switch( eargs.keyCode ) {
            case 39:
                //right
                cursors[ 0 ].move( 1 );
                doc.innerHTML = render(crdt , cursors[ 0 ] );
                break;
            case 37:
                //left
                cursors[ 0 ].move( -1 );
                doc.innerHTML = render(crdt , cursors[ 0 ] );
                break;

            case 8:
                //backspace
                var update = crdt.del( cursors[0].character.previous.id );
                socket.emit( 'update', update );
                addHappening("Sent update: " + JSON.stringify( update ) );
                cursors[ 0 ].move( -1 );
                doc.innerHTML = render(crdt , cursors[ 0 ] );//crdt.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');;

                break;
            case 13:
                //enter
                var update = crdt.insert(clock , '\n' , cursors[0].character );
                socket.emit( 'update', update );
                addHappening("Sent update: " + JSON.stringify( update ) );
               // cursors[ 0 ].move( 1 );
                doc.innerHTML = render(crdt , cursors[ 0 ] );
                break;
        }
        return true;
    }

    keyInput.focus();
    keyInput.onblur = ( ) => keyInput.focus ;

    window.setInterval( ( ) => { keyInput.focus() } , 500);

    cursors.push(createCursor( ) );
    // cursors[ 0 ].move( 3 );


}

function measureText( ) {
    let measurer = document.createElement("span");
    measurer.id = 'measurer';
    measurer.innerHTML = 'MMM<br />MMM<br />MMM';
    document.body.appendChild( measurer );
    let w = measurer.offsetWidth / 3;
    let h = measurer.offsetHeight / 3;
    document.body.removeChild( measurer );
    return {
        w , h
    };
}
function getPositionOfOffset( offset ) {
    let x = 0;
    let y = 0;
    let lastSpace;
    let text = crdt.toString();
    let domdoc = document.getElementById('doc');
    let wrapWidth = domdoc.offsetWidth;
    for( let i = 0; i < offset; i++ ) {
        if( text[ i ] === ' ' ) {
            lastSpace = i;
        }
        x += emsize.w;
        if( x > wrapWidth ) {
            x = 0;
            y += emsize.h;
            i = lastSpace;
        }
    }
    y += 10; //just the offset of the div from padding and margins

    return { x , y };
}

function createCursor( ) {
    let cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    cursor.style.height = emsize.h;
    let character = crdt.getCharAt(1);
    console.log( crdt );
    return {
        cursor,
        character,
        offset : 1,
        move : function( toMove ) {

            if( toMove > 0 ) {
                this.character = this.character.next;
                //this.offset += toMove;
                //while( !crdt.getCharAt(this.offset ).visible ) {
                //    this.offset++;
                //}
            } else if( toMove < 0 ) {
                this.character = this.character.previous;
                // this.offset += toMove;
                // while( !crdt.getCharAt( this.offset ).visible ) {
                //     this.offset--;
                // }
            }
            console.log( this.character );
            //this.offset += toMove;
//                    let position = getPositionOfOffset(this.offset);

            //                  this.cursor.style.left = position.x + 'px';
            //                  this.cursor.style.top = position.y + 'px';
        }
    }
}

function addHappening( text ) {
    let li = document.createElement( 'li' );
    li.innerHTML = text;
    document.getElementById('happenings').appendChild( li );
    var holder = document.getElementById("happeningsHolder");
    holder.scrollTop = holder.scrollHeight;
}