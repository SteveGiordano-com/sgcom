import ControllerTemplate from "./_template.js";
import userService from "../services/user.service.js";
import passport from "passport";

class UserController extends ControllerTemplate {
    service = userService;
    constructor(service) {
        super(service);
    }

    getById = async (req, res) => {
        try {
            const id = req.params.id;
			const results = await this.service.getById(id);

            if (results) {
                return res.json({
                    "ok": true,
                    "data": results
                });
            }

            return res.status(204).json();
        } catch (err) {
            return res.json({
                "ok": false,
                "error": err.message
            })
            .status(500);
        } finally {
			console.log("getById finished.");
		}
    };

    logout = (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }            
        });

        res.redirect("/");
    };

    checkLogin = (req, res, next) => {
        return res.json({
            "ok": true,
            "loggedIn": !!req.user,
            "data": {
                "email": req.user ? req.user.email : null,
                "id":  req.user ? req.user.id : null
            }
        }).status(200);
    };

    authenticate = 
        passport.authenticate("google", {
            "scope": ["email", "profile"],
            "prompt": "select_account"
        });

    redirect = passport.authenticate("google", {
            "successRedirect": "/account",
            "failureRedirect": "/"
        });
};

export default new UserController(userService);
