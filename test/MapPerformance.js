//compares js associative array with maps and tree for large (one million) engries. Maps wins. 

var ar = { };
var start, end;


var randomLookups = [ ];

randomLookups.length = 0;
start= Date.now();
for( var i = 0; i < 1000000; i++ ) {
    var rnd =Math.random().toString();
    if( i % 17 === 1 ) {

        randomLookups.push( rnd );
    }
    ar[ rnd ] = ['a','b','c'];
}
end = Date.now();
console.log(end - start );


start= Date.now();
for( randomLookup of randomLookups ) {
    var x = ar[ randomLookup ];
}
end = Date.now();
console.log(end - start );

var ar = { };

randomLookups.length = 0;
var m = new Map();
start = Date.now();
for( var i = 0; i < 1000000; i++ ) {
    var rand =Math.random().toString();
    if( i % 7 === 1 ) {
        randomLookups.push( rand );
    }
    m.set( rand, ['a','b','c'] );
}
var end = Date.now();
console.log(end - start );


start= Date.now()
for( randomLookup of randomLookups ) {
    var x = m.get( randomLookup );
}
end = Date.now();
console.log(end - start );



var createTree = require("functional-red-black-tree")

//Create a tree
var tree = createTree();
randomLookups.length = 0;
var m = new Map();
start = Date.now();
for( var i = 0; i < 1000000; i++ ) {
    var rand =Math.random().toString();
    if( i % 7 === 1 ) {
        randomLookups.push( rand );
    }
    tree = tree.insert( rand , ['a' , 'b' , 'c']);
}
var end = Date.now();
console.log(end - start );


start= Date.now()
for( randomLookup of randomLookups ) {
    var x = tree.get( randomLookup );
}
end = Date.now();
console.log(end - start );
