import exp from "node:constants";

class Plate {
    idPlate: number;
    namePlate: string;
    mealType: number;

    /**
     * Create a new plate
     * @param idPlate -id of the plate
     * @param namePlate -name of the plate
     * @param mealType -mealtype of the plate
     * */

    constructor(
        idPlate: number,
        namePlate: string,
        mealType: number,
    ) {
        this.idPlate = idPlate;
        this.namePlate = namePlate;
        this.mealType = mealType;

    }


}

export { Plate };

