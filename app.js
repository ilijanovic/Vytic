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
let root = /*html */ `
    <div class="app">
        <div>
        <button @click="add">Add</button>
        <input @keyup="add" @input="writename" a:value="nameinput" />
            <div loop="names-name">
                <p>Name: {{name}}</p>
            </div>
            <p class="counter">Counter: {{counter}}</p>
        </div>
       
        <primary @click="this.counter--">
            <p>-</p>
        </primary>
        <secondary if="visible" @click="this.counter++">
            <p>+</p>
        </secondary>
        <box p:counter="counter" if="counter > 5"></box>
  
    </div>
`;
import { primary, secondary } from "./components/buttons.js";
import box from "./components/box.js";
export default {
  root,
  style,
  data: {
    counter: 0,
    visible: true,
    names: ["ilija"],
    nameinput: "",
  },
  methods: {
    add() {
      this.names.push(this.nameinput);
      this.nameinput = "";
    },
    writename(e) {
      this.nameinput = e.target.value;
    },
  },
  components: {
    primary,
    secondary,
    box,
  },
};
