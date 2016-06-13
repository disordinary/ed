# ed

A collaborative editor for multi user concurrent editing of in place html.

## Goals
1. To seperate the document from the rendered content and saved dataformat. That way we can have markdown, HTML, JSON, whatever as the saved content.
2. To have fast and in place editing handled by a virtual DOM but independent of any frameworks like React / interoperatable with everything.
3. To be pair to pair compatable, eventually consistant in a serverless environment and platform agnostic.
4. To have an extendible object model.
5. To have an extendible undo stack so any part of an online application can have a consistant undo experience across a single page app.