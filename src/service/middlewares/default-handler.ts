import path from "path";

const defaultHandler = (req, res) => {
  res.sendFile(path.join(`${__dirname}/../../../../web/build/index.html`));
};

export { defaultHandler };
