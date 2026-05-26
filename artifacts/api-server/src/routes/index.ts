import { Router, type IRouter } from "express";
import authRouter from "./auth";
import healthRouter from "./health";
import destinationsRouter from "./destinations";
import publicRouter from "./public";
import adminRouter from "./admin";
import userRouter from "./user";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(destinationsRouter);
router.use(publicRouter);
router.use(adminRouter);
router.use(userRouter);

export default router;
