var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var CRDT = require('./crdtstring/crdt.js');
var UserClock = require('./crdtstring/UserClock.js');
var document = new CRDT( '"type here, and your text will appear"\n#CRDT\n##What is this?\nThis is a conflict-free replicated data type demonstration for Ghost\nIt\'s extremely basic and quickly hacked together collaborative editor. \n##Instructions\nType to type.\nBackspace to backspace.\nLeft to go left.\nRight to go right. \n*There is no up or down and the mouse does not work.*\n##(some of the) limitations.\nYou cannot see the other persons cursor as you would expect. \nMouse and up and down lines don\'t work. \nCaret position doesn\'t take into account tombstones so pressing left and right do not always move forward one visible character.\nIt pretends to support markdown, it doesn\'t.\n#Some Lorem Ipsum.\nLorem *ipsum* dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, ' );

server.listen(8080);


var userClocks = [ document.serverClock ];


app.use('/static', express.static( __dirname + '/../public'));

app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

app.get('/Clock.js' , ( req , res ) => {
    res.sendFile(__dirname + '/crdtstring/UserClock.js');
} );


app.get('/CRDT.js' , ( req , res ) => {
    res.sendFile(__dirname + '/crdtstring/crdt.js');
} );


app.get('/rtc.js' , ( req , res ) => {

    res.sendFile(path.resolve( __dirname + '/../node_modules/rtc/dist/rtc.js') );
} );

io.on('connection', function (socket) {


  //  console.log("CONNECTED" );

    var userClock = new UserClock( userClocks.length );
    //socket.set( 'user' , userClock.toString( ) );
    userClocks.push( userClock );
    socket.emit('youAre' , userClock._user_id );
    socket.emit( 'document' , document.toJSON() );


    socket.emit('news', { hello: 'world' });
    socket.on('update', function (data) {

        document.update( data );
        io.sockets.emit( 'update' , data );
       // console.log( document.toString());
    });
    socket.on('error' , function( err ) {
        console.log("ERRR" , err );
    });
});

