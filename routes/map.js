import express from "express";

import mapController from "../controllers/mapController";

const router = express.Router();

router.route('/maps/:id')
  .post(mapController.checkGuess);

export { router };