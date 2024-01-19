import Map from "../models/map";

import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';

const sendErrorsIfAny = asyncHandler(async (req, res, next) => {
  const errorsArray = validationResult(req).array();
  if (errorsArray.length > 0)
    return res.status(200).json({
      errors: errorsArray.map(error => {
        return {
          path: error.path,
          msg: error.msg
        }
      })
    });
  else return next();
});

const mapController = {};

mapController.checkGuess = [
  asyncHandler(async (req, res, next) => {
    const map = await Map.findOne({ mapId: req.params.id });
    if (map === null) return res.status(404).send('Map not found.');
    req.mapObject = map;
    return next();
  }),

  body('x')
    .trim()
    .isNumeric().withMessage('X-coordinate must be a number.')
    .escape(),

  body('y')
    .trim()
    .isNumeric().withMessage('Y-coordinate must be a number.')
    .escape(),

  body('character')
    .trim()
    .isLength({ min: 1 }).withMessage('No character was specified.').bail()
    .custom(async (value, { req }) => {
      const character = req.mapObject.characters.find(char => char.name === value);
      if (character) {
        req.characterObject = character;
        return true;
      } return Promise.reject();
    }).withMessage('This character does not exist in this map.')
    .escape(),

  sendErrorsIfAny,

  asyncHandler(async (req, res, next) => {
    const x = req.body.x;
    const y = req.body.y;
    return res.status(200).json({ isCorrect: (
      x > req.characterObject.xLeftBound &&
      x < req.characterObject.xRightBound &&
      y < req.characterObject.yLowerBound &&
      y > req.characterObject.yUpperBound
    ) });
  })
];

export default mapController;