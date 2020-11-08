import { nextTick } from "../dist/vytic.js";
let root = /*html */ `
    <button>
    <slot></slot>
    </button>
`;
let style = /*css */ `
    button {
        background: red;
        padding: 10px;
        color: white;
        border-radius: 6px;
        border: none;
        cursor: pointer;
    }
`;

export default {
  root,
  style,
};
