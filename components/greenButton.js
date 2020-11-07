export default {
  root: `
      <div>
          <button @click="inc">Counter: {{counter}}</button>
      </div>
      `,
  data: {
    counter: 0,
  },
  methods: {
    inc() {
      this.counter++;
    },
  },
  style: `
      button {
          background: green;
          color: white;
          padding: 10px;
          cursor: pointer;
          border: none
      }
    `,
};
