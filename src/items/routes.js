const { Router }= require('express');

const router = Router();

const controller = require('./controller');

router.get("/", controller.getItems)

router.get("/:id", controller.getItemById)

router.post("/",controller.addItem);

router.delete("/:id",controller.deleteItemById);

router.put("/:id",controller.updateItemById);

module.exports = router;