import e, { Router } from "express";

const router = Router();

router.get("/", (req, res) => res.render("index", {title: 'pagina de inicio', x: '30'}));

router.get("/about", (req, res) => res.render("about", {title: 'Pagina About'}));

router.get("/contact", (req, res) => res.render("contact", {title:'Pagina Contact'}));

export default router