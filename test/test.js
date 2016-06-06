let CRDT = require('../src/crdtstring/crdt.js');
let Clock = require('../src/crdtstring/Clock.js');

let userClock  = new Clock( 1 );
let user2Clock  = new Clock( 2 );

let crdt = new CRDT("TEST STRING");



console.log( crdt.toString() );

crdt.insert( userClock , "1" , "0/4" );

console.log( crdt.toString() );

crdt.insert( userClock , "H" , "0/4" );

console.log( crdt.toString() );

console.log( crdt.getCharAt( 1 ) .toString( ) );
console.log( crdt.getCharAt( 2 ) .toString( ) );
console.log( crdt.getCharAt( 5 ) .toString( ) );
console.log( crdt.getCharAt( 6 ) .toString( ) );

//crdt.del( )

console.log( crdt.serverClock );

crdt.fromJson( crdt.toJSON() );

//console.log( crdt );