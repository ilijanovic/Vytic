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
        <div lazy style="margin-top: 1500px"></div>
        <box p:counter="counter" if="counter > 1"></box>
        <img  lazy a:src="path" />
        <img  lazy a:src="path" />
        <img  lazy a:src="path" />
        <img  lazy a:src="path" />
       
  
    </div>
`;
import { primary, secondary } from "./components/buttons.js";
import box from "./components/box.js";
import { lazy } from "./modules/lazy.js";
export default {
  root,
  style,
  data: {
    counter: 0,
    path:
      "https://cdn.pixabay.com/photo/2020/11/04/19/22/windmill-5713337_960_720.jpg",
    visible: true,
    names: ["tome", "frank"],
    nameinput: "",
  },
  module: [lazy],
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
