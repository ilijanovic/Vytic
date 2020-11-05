import { component } from "../dist/vytic.js";

export default component({
  root: `<button @click="inc">Counter: {{counter}}</button>`,
  methods: {
    inc() {
      this.counter++;
      console.log(this);
    },
  },
  data: {
    counter: 0,
  },
});
