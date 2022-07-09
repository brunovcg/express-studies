import express from "express";
import bodyInfoRouter from "./bodyInfo";
import userRouter from "./users";
import addressRouter from "./address";
import parameterRouter from "./parameter";
import queryRouter from "./query";

const router = express.Router();

router.use("/user", userRouter);
router.use("/bodyinfo", bodyInfoRouter);
router.use("/address", addressRouter);
router.use("/parameter", parameterRouter);
router.use("/query", queryRouter);

// ! simulando um LOGIN UI

export default router;
