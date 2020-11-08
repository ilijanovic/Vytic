let root = /*html */ `
    <div class="navigation">
        <primary @click="inc">
           <p>Toggle</p>
        </primary>
        <p if="visible">Counter: {{counter}}</p>
        <p >Second counter: {{counter}}</p>
    </div>
`;
let style = /*css */ `
    .navigation{
        padding: 20px;
        background: lightgrey
    }
`;
import primary from "./primary.js";
export default {
  root,
  style,
  data: {
    counter: 0,
    visible: true,
  },
  methods: {
    inc() {
      this.counter++;
      this.visible = !this.visible;
    },
  },
  components: {
    primary,
  },
};
