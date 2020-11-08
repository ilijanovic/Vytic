# Vytic

Super small reactive framework build with typescript. It compiles the HTML markup down to an virtual DOM and tracks it for changes.

This project is inspired by Vue.js. Therefor you will see similar syntax.

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

    <div id="root">
        <div s:background="color">I am red</div>
    </div>

    <script type="module">
    new Vytic({
        root: document.getElementById("root"),
        data: {
            color: "red"
        }
    })
    </script>

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

## Slots

You can use slots inside components.

    <custombutton>
        <p>Toggle</p>
    </custombutton>

Inside of your `custombutton` component you can use `<slot>`. The passed elements will be replaced with the `<slot>`

    <button>
       <slot></slot>
    </button>

Note here: Slots works currently only for elements. That means `<custombutton>Text</custombutton>` wont work. You will need to wrap it in an element like `<custombutton><p>Text</p></custombutton>`

You can use multiple elements like:

    <custombutton>
        <p>Text 1</p>
        <p>Text 2</p>
    </custombutton>

Things like `if` or interpolation `{{ }}` still works.

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

## View Virtual DOM

You can take a look how the Vytic virtual DOM looks like:

    <div id="root">
        <button @click="inc">Counter: {{counter}}</button>
    </div>

    <script type="module">
    import { Vytic } from "./dist/vytic.js";

    let vytic = new Vytic({
        root: document.getElementById("root"),
        data: {
            counter: 0
        },
        methods: {
            inc(){
                this.counter++
            }
        }
    })

    let vDom = vytic.getVirtualDOM();

    console.log(vDom)

    </script>

## Update the DOM outside of the framework

The object `data` gets converted into an proxy object. Whenever you change some property inside the proxy object the virtual DOM of the current Vytic instance gets scanned and updates the real DOM if there are some changes.

You can get the reactive data object with `getReactiveData()`

    <div id="root">
        <p>Counter: {{counter}}</p>
    </div>

    <script type="module">
    import { Vytic } from "./dist/vytic.js";
    let vytic = new Vytic({
        root: document.getElementById("root"),
        data: {
            counter: 0
        },
    })

    let proxy = vytic.getReactiveData();

    proxy.counter = 5;

    </script>

Instead of `0` you will see `5`

You can use vanilla javascript to update the DOM by just changing the property `counter`
