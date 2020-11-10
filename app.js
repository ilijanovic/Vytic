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
        <input @keyup.enter="this.counter++"  @input="writename" a:value="nameinput" />

        <p class="counter">Counter: {{counter}}</p>
        </div>
       
        <primary @click="this.counter--">
            <p>-</p>
        </primary>
        <secondary if="visible" @click="this.counter++">
            <p>+</p>
        </secondary>
        <box p:counter="counter" if="counter > 1"></box>
     
       
  
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
    names: ["tome", "frank"],
    nameinput: "",
  },
  methods: {
    async add() {
      this.counter++;
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
