import grpc
from concurrent import futures
import calorie_pb2
import calorie_pb2_grpc
import os
from dotenv import load_dotenv
import logging
import psycopg2
# Configura il logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
load_dotenv()

class CalorieService(calorie_pb2_grpc.CalorieServiceServicer):
    def _get_plate_ingredient(self,name):
        conn = connect_database()  # Connessione al database
        cursor = conn.cursor()

        # Query parametrizzata per evitare SQL Injection
        query = """
        SELECT * FROM plate_ingredient
        LEFT JOIN ingredient ON ref_ingredient = id_ingredient
        WHERE ref_plate = %s
        """
        cursor.execute(query, (name,))  # Passaggio sicuro del parametro

        results = cursor.fetchall()
        conn.close()  # Chiudere la connessione dopo l'uso
        return results
    def CalculateCalories(self, request, context):
        #take all the ingredients from the database
        logging.debug(f"📌 Funzione CalculateCalories chiamata con: {request}")
        results = self._get_plate_ingredient(request.name)
        result_to_send = {
            "calories":0,
            "carbs": 0,
            "proteins": 0,
            "fats": 0,
        }
        for result in results:
            result_to_send['calories'] += ((result[2]*result[3])/100)*result[6]
            result_to_send['carbs'] += ((result[2]*result[3])/100)*result[8]
            result_to_send['proteins'] += ((result[2]*result[3])/100)*result[9]
            result_to_send['fats'] += ((result[2]*result[3])/100)*result[10]
        return calorie_pb2.CalorieResponse(food=request.name, calories=result_to_send['calories'],carbs=result_to_send['carbs'],proteins=result_to_send['proteins'],fats=result_to_send['fats'])

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calorie_pb2_grpc.add_CalorieServiceServicer_to_server(CalorieService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC server running on port 50051...")
    server.wait_for_termination()

def connect_database():
    try:
        conn = psycopg2.connect(database=os.getenv('database'),
                            host=os.getenv('host'),
                            user=os.getenv('user'),
                            password=os.getenv('password'),
                            port=os.getenv('port'))
        return conn
    except Exception as e:
        print(f"db error: {e}")
        return None


if __name__ == "__main__":
    serve()