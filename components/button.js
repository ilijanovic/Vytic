import { createWebComponent } from "../dist/vytic.js";

createWebComponent({
  name: "super-button",
  data: {
    counter: 0,
  },
  template: `
  <div>
    <button @click="inc">Increase counter: {{counter}}</button>
  </div>
  `,
  methods: {
    inc() {
      this.counter++;
    },
  },
});
