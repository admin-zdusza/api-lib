import express from "express";
import path from "path";

const staticHandler = express.static(
  path.join(__dirname, "../../../../web/build")
);

export { staticHandler };
