import sys
import os
import uvicorn

# Ensure the backend directory is in the python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("==================================================")
    print(" Starting EcoCommunity Climate Backend (Python + MySQL)")
    print(" Database: MySQL 8.0 on localhost:3306 (climate_platform_db)")
    print(" URL: http://localhost:8000")
    print(" API Base: http://localhost:8000/api")
    print(" Docs: http://localhost:8000/docs")
    print("==================================================")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
