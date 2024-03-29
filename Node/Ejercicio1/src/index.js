import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import indexRoutes from './rutas/index.js'

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(join(__dirname, "views"));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(indexRoutes)


app.listen(3000);
console.log("server listenig ", 3000);
