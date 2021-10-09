# NOTES

Some notes for the Machinist web client.


## TODO

1. Scroll the page by default
2. Make the line start/end zip around the circle
3. Fix the dragging functionality


## Creating the 2 Layer "Canvas"

The first step that we need to do is to create the data store that we will use
for tracking all these nodes and transitions.

The data store will keep the graph datastructure along with some extra
information:

ALL MEASURES ARE IN TERMS OF THE SVG VIEWBOX COORDINATES

1. The store will have a global field that records the current size of the
   canvas. All measurements can then be taken with reference to this size. If
   the canvas is resized, a new measure must be recorded in the store and the
   rest of the measure must be adjusted according to this new value.
2. Each node will store its location on the canvas. This location is center
   point of the node on the canvas.
    - Add field `location` to the `State` type.
3. Each transition will store the offset for each of the starting and ending
   states. This offset value is the transform that needs to be applied to the
   path starting position from the center of the node.
    - Change field `start` of `Transition` type from `State` to
      ```json
      {
        state: State,
        offset: <New Offset Type>
      }
      ```
    - Change field `end` of `Transition` similarly



## DRAWING

I've been doing some research on how we can draw shapes and arrows on our
canvas. There are two applications that I've been looking at for accomplishing
this task:

### Draw.io

In essence, drawio (aka diagrams.net) is a vector manipulation tool. There is
not actually a `<canvas>` element in the app. There is just one massive `<svg>`
element, with each piece of your diagram (arrows, circles, etc.) being drawn as
vector graphics in this svg.

SVG is very flexible and presents a DOM same as normal HTML. This means that you
can script it with javascript and style it with CSS.

You can also sense keyboard and mouse events like with normal HTML elements.

For example, here is a formatted version of the svg element that represents
the "canvas" in draw.io:

```svg
<svg style="left: 0px; top: 0px; width: 100%; height: 100%; display: block; min-width: 1774px; min-height: 2686px; position: absolute; background-image: none;">
    <defs>
        <filter id="dropShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.7" result="blur"></feGaussianBlur>
            <feOffset in="blur" dx="3" dy="3" result="offsetBlur"></feOffset>
            <feFlood flood-color="#3D4574" flood-opacity="0.4" result="offsetColor"></feFlood>
            <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"></feComposite>
            <feBlend in="SourceGraphic" in2="offsetBlur"></feBlend>
        </filter>
    </defs>
    <g>
        <g></g>
        <g>
            <g style="visibility: visible; cursor: col-resize;" transform="translate(0.5,0.5)">
                <path d="M 612 1083 L 642 1083 L 642 963 L 665.63 963" fill="none" stroke="white" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden" stroke-width="9"></path>
                <path d="M 612 1083 L 642 1083 L 642 963 L 665.63 963" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"></path>
                <path d="M 670.88 963 L 663.88 966.5 L 665.63 963 L 663.88 959.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path>
            </g>
            <g style="visibility: visible; cursor: move;" transform="translate(0.5,0.5)">
                <ellipse cx="562" cy="1083" rx="50" ry="50" fill="#ffffff" stroke="#000000" pointer-events="all"></ellipse>
            </g>
            <g style="visibility: visible; cursor: move;" transform="translate(0.5,0.5)">
                <ellipse cx="722" cy="963" rx="50" ry="50" fill="#ffffff" stroke="#000000" pointer-events="all"></ellipse>
            </g>
        </g>
        <g></g>
        <g></g>
    </g>
</svg>
```

These SVGs are embeddeed within the html as regular DOM nodes and can be
manipulated with JavaScript as usual.

### Miro

Miro does have a `<canvas>` element in it. Everything that you see drawn on the
canvas is genuinely drawn on a canvas element.

Even the little "selection" UI (the square that gets drawn around an object when
you are resizing or manipulating it) is drawn on the canvas.

If you are not familiar, the HTML `<canvas>` element has a JavaScript API that
allows you draw things on the canvas like lines and circles.

The API looks something like this:

```javascript
const canvas = document.querySelector("#my-canvas");
const ctx = canvas.getContext("2d");

ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
```

So you are literally drawing manually shapes with basic drawing primitives. If
you wanted to "select" a shape drawn, it is up to you to implement that logic
for clicking on the shape (user clicked on canvas, so which shape did he
select?), as well as for drawing the "selected" UI elements around the shape.

### Conclusion

Given the two apps above, I think there are two ways forward for our Machine
builder:

1. Manipulate SVGs
2. Manipulate canvas

The first option, the one taken by Draw.io seems to be the best - SVG exposes
an actual DOM that we can manipulate, rather than manually drawing with canvas
drawing primitives.

LINKS:

- <https://www.geeksforgeeks.org/difference-between-svg-and-html-5-canvas/>
- How to draw with SVG: <https://developer.mozilla.org/en-US/docs/Web/SVG>
  - Draw a circle: <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle>
- Tutorial on dragging SVG: <https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/>

## Canvas Architecture

About the architecture for the Canvas - I think what we'll go with is a mixture
of SVG and plain old HTML elements.

Here is an idea for the architecture:

### Canvas

The "Canvas", spanning the entire screen, will be made from two layers:

1. The bottom-most layer will be the TRANSITIONS PLANE. This is the layer where
   we will draw connection lines between nodes. It will have a big `<svg>`
   element across the entire surface, and many `<path>` elements for drawing
   each transition. Path elements will have
2. Ontop of this layer, we will have the NODE PLANE. In this layer, we draw the
   nodes. Nodes will be plain React components (i.e. normal HTML elements on the
   page). The details of these nodes are described below - the nodes themselves
   will have a few layers.

### Node

The nodes will render the following:

1. A circular border of medium thickness in light-grey.
2. The circle will be filled with no color.
3. A small snippet of text in the center of the circle indicating the ID of the
   state/nodes (e.g. `q0`)
4. When the node is hovered, a secondary border of dashed lines will radiate out
   from the middle, stopping when the secondary border is a short distance
   larger than the primary border of the circle. This border indicates that the
   node is being hovered.
5. When the node is hovered, the entire node enlarges by 5-10%.
6. When the node is hovered, the primary border changes color slightly.
7. When the secondary border is hovered, a small, filled circle appears
   underneath the mouse and tracks that mouses movement along the secondary
   border. This placeholder circle indicates that a new transition can be
   started should the user click somewhere along the secondary border.
8. If this little circle is clicked, a transition arrow is create originating at
   the point clicked along the secondary border. While the mouse is held down,
   the end of theis arrow can be dragged anywhere on screen. When the mouse is
   lifted, if the end of the arrow rests along the border of another node, the
   end of the arrow is locked into place and the two nodes become connected.
9. If the node is clicked in its body and the mouse held down, the node becomes
   draggable and the user can drag the node anywhere on the canvas.
