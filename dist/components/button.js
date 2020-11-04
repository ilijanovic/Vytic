import { createComponent } from "../dist/vytic.js";
export const button = createComponent({
  template: /* html */ `

        <button @click="inc">Count: {{counter}}</button>

    `,
  data: {
    counter: 0,
  },
  methods: {
    inc() {
      this.counter++;
    },
  },
});
