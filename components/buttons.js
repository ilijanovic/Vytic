let root = /*html */ `
    <button><slot></slot></button>
`;

let primaryStyle = /*css */ `
    button {
        background: red;
        color: white;
        padding: 20px;
        cursor: pointer;
        border: none;
        margin-right: 10px;
    }
`;

let secondaryStyle = /*css */ `
    button {
        background: green;
        color: white;
        padding: 20px;
        cursor: pointer;
        border: none;
        margin-right: 10px;
    }
`;

export const primary = {
  root,
  style: primaryStyle,
};

export const secondary = {
  root,
  style: secondaryStyle,
};
