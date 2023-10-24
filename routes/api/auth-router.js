import express from "express";
import { authVerify, authLoginValidate, authRegisterValidate, authUpdateValidate } from "../../middleware/validation/validation.js";
import authenticate from "../../middleware/validation/authenticate.js";
import authCtrl from "../../controllers/user-controller.js";
import { upload } from "../../middleware/validation/upload.js";

const authRouter = express.Router();

authRouter.post("/register", authRegisterValidate, authCtrl.userRegister);

authRouter.get("/verify/:verificationToken", authCtrl.getVerification);

authRouter.post("/verify", authVerify, authCtrl.repeatVerify);

authRouter.post("/login", authLoginValidate, authCtrl.userLogin);

authRouter.patch("/edit", authenticate, authUpdateValidate, upload.single("avatar"), authCtrl.updateUser);

authRouter.post("/logout", authenticate, authCtrl.userLogout);

authRouter.get("/current", authenticate, authCtrl.getCurrent);

authRouter.delete("/delete/:email", authenticate, authCtrl.deleteUser);

export default authRouter;
