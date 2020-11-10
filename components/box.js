let root = /*html */ `
    <div class="box">
        <p>Passed prop: {{counter}}</p>
        <p>Slider: {{slide}}</p>
        <div s:background="counter > 30 ? 'blue': ''" class="width" s:width="counter * 10 + 'px'"></div>
        <input a:value="counter" @input="slidechange" type="range" min="0" max="40" />
    </div>
`;

let primaryStyle = /*css */ `
    .box {
        box-shadow: 0 0 10px -8px black;
        border-radius: 6px;
        border: 1px solid #dadada;
        margin: 20px 0;
        padding: 20px;
    }
    .width {
        background: red;
        padding: 10px;
        margin: 20px 0;
    }
`;

export default {
  root,
  style: primaryStyle,
  data: {
    slide: 0,
  },
  methods: {
    slidechange(e) {
      this.counter = e.target.value;
    },
  },
  props: {
    counter: Number,
  },
};
