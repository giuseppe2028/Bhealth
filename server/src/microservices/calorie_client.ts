const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./server/src/proto/calorie.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const calorieProto = grpc.loadPackageDefinition(packageDefinition).CalorieService;
const client = new calorieProto("localhost:50051", grpc.credentials.createInsecure());

export function getCalories(food:any) {
    client.CalculateCalories(food, (error:any, response:any) => {
        if (error) {
            console.log("entro1")
            console.error("Errore:", error);
            return;
        }
        console.log("Risultato:", response);
    });
}

