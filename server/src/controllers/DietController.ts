import { DietDAO } from "../dao/DietDAO";
import { Plate } from "../components/Meal";

/**
 * Represents a controller for managing diets.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class DietController {
    private dao: DietDAO;

    constructor() {
        this.dao = new DietDAO();
    }

    /**
     * Route to retrieve plates for a specific week and day.
     * It returns the plates for a given week and day, retrieved from the DAO.
     * @param req - The request object, containing the week and day in the params.
     * @param res - The response object, used to send the data back to the client.
     * @param next - The next middleware function.
     * @returns A Promise that resolves to an array of plates.
     */
    async getPlate(req: any, res: any, next: any): Promise<Plate[] | Error> {
            return this.dao.getDietOfADay(req.params.week, req.params.day,req.user.username);
    }


    /**
     * Route to insert plates.
     * It returns the plates for a given week and day, retrieved from the DAO.
     * @param req - The request object, containing the week and day in the params.
     * @param res - The response object, used to send the data back to the client.
     * @param next - The next middleware function.
     * @returns void
     */
    async insertPlate(req: any, res: any, next: any): Promise<boolean> {

        return this.dao.insertPlate(req.body);
    }

    async insertDiet(req: any, res: any, next: any): Promise<number> {
        return this.dao.insertDiet(req.body.current,req.body.plates);
    }



}

export default DietController;