let root = /*html */ `
    <div>
        <p>name: {{counter}}</p>
    </div>
`;
export default {
  root,
  props: {
    counter: {
      type: Number,
    },
  },
};
