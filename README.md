# Vytic

Super small reactive framework build with typescript.

## How to run it 

Install dependencies:

`npm i`

Compile to javascript:

`npm run build`

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

    <div c:boxclass="added">I am red</div>


    data: {
       added: true
    }
    
    <style>
    .boxclass {  background: red }
    </style>
    
### Attributes binding

You can bind attributes with "a:"

"a" stands for attribute.

Example


    <img a:src="path" />


    data: {
        path: "https://cdn.pixabay.com/photo/2020/04/04/20/00/sea-bird-5003667_1280.jpg"
    }
