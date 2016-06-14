# ed

A collaborative editor for multi user concurrent editing of in place html using peer to peer technology, built on top of a CRDT engine.

## This project has only just begun and is very much a work in progress. It's going to be slow going and experimental.

It's designed to be a drop in replacement for real time colalboration on contenteditable on systems that are not capable of running socket servers. 
It will have the ability to communicate to the server through sockets.
It will also extend beyond collaboratively editing content to enable undo / redo state control throughout an entire web application.

## Goals
1. To separate the document from the rendered content and saved dataformat. That way we can have markdown, HTML, JSON, whatever as the saved content.
2. To have fast and in place editing handled by a virtual DOM but independent of any frameworks like React / interoperable with everything.
3. To be pair to pair compatible, eventually consistent in a serverless environment and platform agnostic.
4. To have an extensible object model.
5. To have an extensible undo stack so any part of an online application can have a consistent undo experience across a single page app.
6. Content to be rendered through a state machine with the ability to integrate into a PEG system for code styling, etc. 