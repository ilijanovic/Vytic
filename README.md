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

