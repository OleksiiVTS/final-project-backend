import express from "express";
import reviewCtrl from "../../controllers/review-controller.js";

import authenticate from "../../middleware/validation/authenticate.js";
import { validateReview } from "../../middleware/validation/validation.js";

const reviewRouter = express.Router();

reviewRouter.get("/", reviewCtrl.listAllReviews);

reviewRouter.get("/own", authenticate, reviewCtrl.getUserReview);

reviewRouter.post("/own", authenticate, validateReview, reviewCtrl.addReview);

reviewRouter.patch(
  "/own",
  authenticate,
  validateReview,
  reviewCtrl.updateReview
);

reviewRouter.delete("/own", authenticate, reviewCtrl.deleteUserReview);

export default reviewRouter;
