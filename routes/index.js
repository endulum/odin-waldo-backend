import express from "express";

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    res.status(200).json({ message: 'Hello World' })
  })

export { router };