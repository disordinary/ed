//a hacky render function to prove a point
function render( crdt , cursor_char ) {
    let char = crdt._first;
    let return_string = [ ];
    let line = [ [ ] ];
    let boldOpen = false;
    let italicOpen = false;
    let i = 0;

    let cursor_line = 0;
    let cursor_character = 0;
    while( char ) {

        i++;

       // if( i === cursor_offset ) {
       
        if( cursor_char.character.id === char.id ) {
            //line[ line.length -1 ].push( '|' );
            cursor_line = line.length - 1;
            cursor_character = line[ line.length - 1 ].length;
        }


        let _char = char.toString();
        if( char.visible > 0 ) {
            if( _char == '\n' ) {
                line.push( [ ] );


            }
            let lne = line[ line.length - 1 ];

            if( _char === "*" && char.nextVisible().toString( ) === "*" ) {
                if( boldOpen ) {
                    lne.push( _char );
                    lne.push( '</strong>');
                    boldOpen = false;
                } else {
                    lne.push( '<strong>');
                    lne.push( _char );
                    boldOpen = true;
                }
            }
            else if( _char === "*" && char.nextVisible().toString( ) !== "*" && !boldOpen ) {
                if( italicOpen ) {
                    lne.push( _char );
                    lne.push( '</em>');
                    italicOpen = false;
                } else {
                    lne.push( '<em>');
                    lne.push( _char );
                    italicOpen = true;
                }
            } else {
                lne.push( _char );
            }


           // return_string.push(char.toString());
        }
        char = char.next;
    }
   // console.log( line );
    let returnString = '';
    for( let i = 0; i < line.length; i++ ) {

        let cursor = "<span id='cursor'></span>";
        if( line[ i ].slice( 1 , 4).join('') === '###' ) {
            if( cursor_line == i) {
                line[ i ].splice( cursor_character, 0 , cursor );
            }
            returnString += "<h3>" + line[i].join('') + "</h3>";
        } else if( line[ i ].slice( 1 , 3).join('') === '##') {
            if( cursor_line == i) {
                line[ i ].splice( cursor_character, 0 , cursor );
            }
            returnString += "<h2>" + line[ i ].join('') + "</h2>";
        }
        else if( line[ i ].slice( 1 , 2).join('') === '#') {
            if( cursor_line == i) {
                line[ i ].splice( cursor_character, 0 , cursor );
            }
            returnString += "<h1>" + line[ i ].join('') + "</h1>";
        } else {
            if( cursor_line == i) {
                line[ i ].splice( cursor_character, 0 , cursor );
            }
            returnString += line[ i ].join( '' );
        }
        returnString += '<br />'
    }

    return returnString;
}