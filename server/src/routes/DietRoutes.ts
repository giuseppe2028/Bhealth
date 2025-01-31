import Authenticator from "./auth";
import express, {Router} from "express";
import ErrorHandler from "../helper";
import UserController from "../controllers/UserController";
import DietController from "../controllers/DietController";
import Validator from "../validator/validator";

/**
 * Represents a class that defines the routes for handling users.
 */
class DietRoutes {
    private router;
    private errorHandler: ErrorHandler;
    private authenticator: Authenticator;
    private controller: DietController;
    private validator: Validator;
    /**
     * Constructs a new instance of the StakeholderRouter class.
     * @param authenticator The authenticator object used for authentication.
     * @param validator
     */
    constructor(authenticator: Authenticator,validator:Validator) {
        this.authenticator = authenticator;
        this.validator = validator;
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
        /**
         * @swagger
         * /bhealth/api/diet/plate:
         *   post:
         *     summary: "Aggiungi un nuovo piatto"
         *     description: "Aggiungi un nuovo piatto al database."
         *     tags: [Diet]
         *     requestBody:
         *       description: "Oggetto del piatto"
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               type:
         *                 type: string
         *               preparation:
         *                 type: string
         *     responses:
         *       201:
         *         description: "Piatto creato con successo"
         *       400:
         *         description: "Errore nella validazione dei dati"
         */
        this.router.post(
            "/plate",
            this.validator.validatePlate,
            this.authenticator.isLoggedIn,
            async (req: any, res: any, next: any): Promise<void> => {
                try {
                    await this.controller.insertPlate(req, res, next);
                    res.status(201).json({ message: "Piatto inserito con successo" });
                } catch (error: any) {
                    // Gestione errori
                    res.status(error.customCode || 500).json({ error: error.customMessage || "Errore interno" });
                }
            }
        );

        this.router.post(
            "/",
            this.validator.validateDiet,
            this.authenticator.isLoggedIn,
            async (req: any, res: any, next: any): Promise<void> => {
                try {
                    await this.controller.insertDiet(req, res, next);
                    res.status(201).json({ message: "dieta added successfully" });
                } catch (error: any) {
                    res.status(error.customCode || 500).json({ error: error.customMessage || "Errore interno" });
                }
            }
        );
    }
}

export { DietRoutes };
