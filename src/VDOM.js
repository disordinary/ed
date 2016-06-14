/**
    A virtual DOM, DOM as in Document Object Model - i.e. a tree of nodes. Not DOM as in the HTML DOM.
    It's a simplified system which has block and inline elements, the actual rendering of which occurs by the renderer.
 */

// will be dynamic eventually, but right now it's hard coded.
//all elements contain an CRDT slice, a CRDT string for the document is actually one cohesive string,

const DisplayType = { // display type enum
    block : Symbol( 'block type' ),
    inline : Symbon( 'inline' )
};

class Element {
    constructor( ) {
        this.children = []; //a child is either a text run (which is simply a CRDT slice) or another element
        this.next_element_type; //the next element when you press enter (heading goes to P, li goes to another li, table cell creates another row, etc.)
        this.display; //block, inline are teh only two currently. The rendering is actually handled by the renderer. It's actually an enum of DisplayType
        this.name; //name of the block
        this.length = 0;
    }
}



//a crdt slice
class TextRun extends Element {
    constructor( crdt_start_char , crdt_end_char ) {
        super();
        this.crdt_start_char = crdt_start_char;
        this.crdt_end_char = crdt_end_char;
    }
}



//hard coded for now, will be dynamic

var blocks = { };


blocks.Heading = class Heading extends Element {
    constructor( ) {
        super();

        this.display = DisplayType.block;
        this.name = 'heading';
        this.next = 'p';
    }
};

blocks[ 'P' ] = class P extends Element {
    constructor( ) {
        super();
        
        this.display = DisplayType.block;
        this.name = 'P';
        this.next ='P';
    }
}