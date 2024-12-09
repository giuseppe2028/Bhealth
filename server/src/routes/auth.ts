import express from 'express';
import passport from 'passport';
import UserDAO from "../dao/UserDAO";
import {User} from "../components/user";
import {Utility} from "../utilities";


const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

/**
 * Represents a class that defines the routes for handling authentication.
 */
class Authenticator {
    private app: express.Application;
    private dao: UserDAO;

    /**
     * Constructs a new instance of the AuthRouter class.
     * @param {express.Application} app - The Express application.
     */
    constructor(app: express.Application) {
        this.app = app;
        this.dao = new UserDAO();
        this.initAuth();
    }

    /**
     * Initializes the authentication middleware and sets up passport strategies.
     * This method should be called before using any protected routes.
     */
    initAuth() {
        this.app.use(
            session({
                secret: 'kirunaexplorer24',
                resave: false,
                saveUninitialized: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }),
        );

        this.app.use(passport.initialize()); // Initialize passport
        this.app.use(passport.session()); // Initialize passport session

        const copyThis = this;

        /**
         * Sets up the local strategy for passport.
         * The local strategy uses the UserDAO to check if the user is authenticated by retrieving the user from the database and comparing the two passwords.
         * If the user is authenticated, the user is returned, otherwise an error message is returned.
         */
        passport.use(
            new LocalStrategy((username: string, password: string, done: any) => {
                copyThis.dao
                    .getIsUserAuthenticated(username, password)
                    .then((authenticated: Boolean) => {
                        if (authenticated) {
                            copyThis.dao.getUserByUsername(username).then((user: User) => {
                                return done(null, user);
                            });
                        } else {
                            return done(null, false, {
                                message: 'Incorrect username and/or password',
                            });
                        }
                    });
            }),
        );

        /**
         * Serializes the user to the session.
         * This method is called when a user is authenticated and the user is serialized to the session.
         */
        // @ts-ignore
        passport.serializeUser((user: User, done: any) => {
            done(null, user);
        });

        /**
         * Deserializes the user from the session.
         * This method is called when a user is deserialized from the session.
         * It retrieves the user from the database and returns it.
         * If the user is not found, an error is returned.
         */
        passport.deserializeUser((user: User, done: any) => {
            this.dao
                .getUserByUsername(user.username)
                .then((user: User) => {
                    done(null, user);
                })
                .catch((err: Error) => {
                    done(null, err);
                });
        });
    }

    /**
     * Logs in a user.
     * @param {any} req - The request object.
     * @param {any} res - The response object.
     * @param {any} next - The next function.
     * @returns A Promise that resolves to the logged in user or rejects with an error message.
     * @remarks This method uses the passport.authenticate method to log in a user.
     * It returns a Promise that resolves to the logged in user or rejects with an error message.
     * If the user is logged in, the user is serialized to the session.
     * If the user is not logged in, an error message is returned.
     */
    login(req: any, res: any, next: any) {
        return new Promise<User>((resolve, reject) => {
            passport.authenticate('local', (err: any, user: any, info: any) => {
                if (err) return reject(err);
                if (!user) return reject(info);
                req.login(user, (err: any) => {
                    if (err) return reject(err);
                    return resolve(req.user);
                });
            })(req, res, next);
        });
    }

    /**
     * Logs out the user.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * @returns A Promise that resolves to null.
     */
    logout(req: any, res: any, next: any) {
        return new Promise((resolve, reject) => {
            req.logout(() => resolve(null));
        });
    }

    /**
     * Middleware function to check if the user is logged in.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * If the user is authenticated, it calls the next middleware function. Otherwise, it returns a 401 error response.
     */
    isLoggedIn(req: any, res: any, next: any) {
        if (req.isAuthenticated()) return next();
        return res.status(401).json({ error: 'Unauthenticated user', status: 401 });
    }

    /**
     * Middleware function to check if the user is an admin.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * If the user is an admin, it calls the next middleware function. Otherwise, it returns a 401 error response.
     */
    isAdmin(req: any, res: any, next: any) {
        if (req.isAuthenticated() && Utility.isAdmin(req.user)) return next();
        return res.status(401).json({ error: 'User is not an admin', status: 401 });
    }

    /**
     * Middleware function to check if the user is an isCommonUser.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * If the user is an urban planner, it calls the next middleware function. Otherwise, it returns a 401 error response.
     */
    isCommonUser(req: any, res: any, next: any) {
        if (req.isAuthenticated() && Utility.isCommonUser(req.user))
            return next();
        return res
            .status(401)
            .json({ error: 'User is not an urban planner', status: 401 });
    }

    /**
     * Middleware function to check if the user is an urban planner or an admin.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * If the user is an urban planner, it calls the next middleware function. Otherwise, it returns a 401 error response.
     */
    isAdminOrCommonUser(req: any, res: any, next: any) {
        if (
            req.isAuthenticated() &&
            (Utility.isCommonUser(req.user) || Utility.isAdmin(req.user))
        ) {
            return next();
        }
        return res
            .status(401)
            .json({ error: 'User is not an urban planner or an admin', status: 401 });
    }
}

export default Authenticator;