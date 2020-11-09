let root = /*html */ `
    <div class="app">
        <div>
            <p>Increase counter over 5</p>
            <p class="counter">Counter: {{counter}}</p>
        </div>
        <primary @click="this.counter--">
            <p>-</p>
        </primary>
        <secondary @click="this.counter++">
            <p>+</p>
        </secondary>
        <box p:counter="counter" if="counter > 5"></box>
    </div>
`;

let style = /*css */ `
    .app {
        max-width: 500px;
        margin: 30px auto;
    }
    .counter {
        padding: 15px;
        border: 1px solid #dadada;
        border-radius: 6px;
        box-shadow: 0 0 10px -8px black;
        margin: 20px 0;
    }
`;

import { primary, secondary } from "./components/buttons.js";
import box from "./components/box.js";
export default {
  root,
  style,
  data: {
    counter: 0,
  },
  components: {
    primary,
    secondary,
    box,
  },
};
