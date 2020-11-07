import { nextTick } from "../dist/vytic.js";
let root = /*html */ `
    <div s:transform="'translateX(' + left + 'px)'" class="sidebar">
        <h1>Menu</h1>
    </div>
`;
let style = /*css */ `
    .sidebar {
        width: 300px;
        position: fixed;
        left: 0;
        height: 100vh;
        background: green;
        top: 0;
        transition: all 400ms;
    }
`;

export default {
  root,
  style,
  data: {
    left: -300,
  },
  async ready() {
    this.left = 0;
  },
};
