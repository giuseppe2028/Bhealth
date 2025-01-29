import Authenticator from "./auth";
import express, {Router} from "express";
import ErrorHandler from "../helper";
import UserController from "../controllers/UserController";
import DietController from "../controllers/DietController";

/**
 * Represents a class that defines the routes for handling users.
 */
class DietRoutes {
    private router;
    private errorHandler: ErrorHandler;
    private authenticator: Authenticator;
    private controller: DietController;
    /**
     * Constructs a new instance of the StakeholderRouter class.
     * @param authenticator The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authenticator = authenticator;
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.controller = new DietController();
        this.initRoutes();
    }

    /**
     * Get the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router;
    }

    /**
     * Initializes the routes for the stakeholder router.
     *
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, updating, and deleting user data.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     */
    initRoutes() {
        /*
        * Route for Get all the plates of a specific day
        *
        * */
        this.router.get(
            "/:week/:day",
            this.authenticator.isLoggedIn,
            async (req: any, res: any, next: any) => {
                try {
                    // Chiama il controller per ottenere i dati
                    const result = await this.controller.getPlate(req, res, next);
                    // Rispondi con il risultato
                    res.status(200).json(result);
                } catch (error: any) {
                    // Gestisci l'errore
                    res.status(error.customCode).json({ error: error.customMessage});
                }
            }
        );

        this.router.get(
            "/:week/:day",
            this.authenticator.isLoggedIn,
            async (req: any, res: any, next: any) => {
                try {
                    // Chiama il controller per ottenere i dati
                    const result = await this.controller.getPlate(req, res, next);
                    // Rispondi con il risultato
                    res.status(200).json(result);
                } catch (error: any) {
                    // Gestisci l'errore
                    res.status(error.customCode).json({ error: error.customMessage});
                }
            }
        );
    }
}

export { DietRoutes };
