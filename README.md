# Vytic

Super small reactive framework build with typescript. It compiles the HTML markup down to an virtual DOM and tracks it for changes.
Under the hood Vytic uses Javascript proxies. Thats the heart of the application that makes data reactive and magically updates the DOM.

As soon as you change your `data` the proxy intercepts this operation and traverse with a recursive update function through the Virtual DOM to check if something changed and updates the real DOM if there is an change.

Depending where you changed your data Vytic will only scan this particular DOM. For example if you have an sidebar component and some data changed in the sidebar component only the Virtual DOM of the sidebar will be scanned witch makes the updates pretty fast. There is currently one exception: If you pass props to another component then both components will be scanned since every component has an own proxy object.

Current size is: < 25kb

Its quite big because compilers / parsers / scoped CSS generators are included here. Usually the project is compiled / parsed AOT so that Vytic just needs to render the generated VDOM structure. Upgrades will come in the future...

This project is inspired by Vue.js. Therefor you will see similar syntax.

## My personal roadmap

My goals are:

1. Render loops, Image lazy loading with "lazy" attribute. Implementation on virtual DOM level, emitting data to parent component
2. Vytic basic router
3. Vytic basic store

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

There are currently 3 ways to update the data with an event handler:

1. Directly: `@click="this.counter = 5"`
   Note here: You need to use `this` to be able to mutate the data

2. Pass in an method: `@click="myMethod"`
   When you pass methods you dont need `this`

3. Pass in an method with an argument: `@click="myMethod(this.counter)"`
   The method does not need `this` only the data

I am working on it to be able to mutate the data without the need of `this`

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

## Props

You are able to pass props down to the component with the prop bindin `p:`

    <somecomponent p:propname="propvalue"></somecomponent>

    <script type="module">
    new Vytic({
        root: document.getElementById("root"),
        data: {
            propvalue: 0
        }
        components: {
            somecomponent
        }
    })
    </script>

In your component you need to register the props with the object `prop`

    export default {
    root: "<p>Value: {{propname}}",
    props: {
        propname: {
            type: Number,
        },
    },
    };

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
