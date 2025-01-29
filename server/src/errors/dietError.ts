const PLATENOTFOUND = 'Plate not found';

export class PlateNotFoundError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = PLATENOTFOUND;
        this.customCode = 404;
    }
}
