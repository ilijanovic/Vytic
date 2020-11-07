# Vytic

Super small reactive framework build with typescript. It compiles the HTML markup down to an virtual DOM and tracks it for changes.

## How to run it

Install dependencies:

`npm i`

Compile to javascript:

`npm run build`

## Setup

The setup is following. Similar to vue:

    <body>
        <div id="root">
            <button @click="inc">Counter: {{count}}</button>
        </div>
    </body>
    <script type="module">
        import { Vytic } from "./dist/vytic.js";
        new Vytic({
            root: document.getElementById("root"),
            data: {
                count: 0,
            },
            methods: {
                inc() {
                    this.count++
                },
            }
        })
    </script>

## Bindings

### Style binding

You can bind style properties with "s:".

"s" stands for style.

Example:

    <div s:background="color">I am red</div>


    data: {
       color: "red"
    }

### Class binding

You can toggle classes with "c:"

"c" stands for class.

Example:

    <div id="root">
        <div c:boxclass="added">I am red</div>
    </div>

    <script type="module">
    new Vytic({
        root: document.getElementById("root"),
        data: {
            added: true,
        }
    })
    </script>

    <style>
    .boxclass {  background: red }
    </style>

### Attributes binding

You can bind attributes with "a:"

"a" stands for attribute.

Example

    <div id="root">
        <img a:src="path" />
    </div>

    <script type="module">
    new Vytic({
        root: document.getElementById("root"),
        data: {
            path: "https://cdn.pixabay.com/photo/2020/04/04/20/00/sea-bird-5003667_1280.jpg"
        }
    })
    </script>

## Toggle visibility

You can use the "if" directive for toggeling elements.

    <div id="root">
        <button @click="toggle">Toggle</button>
        <div if="visible">Toggle me</div>
    </div>

    <script type="module">
    new Vytic({
        root: document.getElementById("root"),
        data: {
            visible: true
        },
        methods: {
            toggle(){
                this.visible = !this.visible
            }
        }
    })
    </script>

## Event handlers

You can attach event handlers with `@` and then the event name.

Example: `@click`

## Create Vytic components

You can create components with Vytic. An component is just a simple Object with information in it.

    // redbutton.js

    export default {
        root: `
            <button @click="inc">Counter: {{counter}}</div>
        `,
        data: {
            counter: 0
        },
        methods: {
            inc(){
                this.counter++
            }
        },
        style: `
            button {
                background: red;
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer
            }
        `
    }

You need to register your component in your Vytic instance:

    import redbutton from "./redbutton.js"

    <div id="root">
        <redbutton></redbutton>
    </div>

    <script type="module">
    new Vytic({
        root: document.getElementById("root"),
        components: {
            redbutton
        }
    })
    </script>

The styling in your component is by default scoped.

## Create native web components

Vytic provides `createWebComponent` function that creates an reactive native web component.
The difference between the example above and here is that you need `name` and you can add CSS styling to it witch is automatically scoped.

Because they are native components you dont need to wrap them inside an root element.

    <body>
        <custom-button></custom-button>
    </body>
    <script type="module">
        import { createWebComponent } from "./dist/vytic.js";
        createWebComponent({
            name: "custom-button",
            template: `
                <button @click="inc">Counter: {{count}}</button>
            `,
            style: `
                button {
                    background: green;
                    color: white;
                }
            `,
            methods: {
                inc(){
                    this.count++
                }
            },
            data: {
                count:0
            }
        })
    </script>
