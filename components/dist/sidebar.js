import { nextTick } from "../../dist/vytic";
let root = /*html */ `
    <div class="sidebar">
        <h1  s:width="'500px'">Menu</h1>

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
    }
`;

export default {
  root,
  style,
  data: {
    left: 300,
  },
  async ready() {},
};
