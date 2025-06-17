from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base
from typing import List, Optional
from supabase import create_client, Client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/users", response_model=List[base.User])
async def get_users(db: Client = Depends(base.get_supabase_client)):
    """全ユーザーを取得"""
    try:
        response = db.table("users").select("*").execute()
        if not response.data:
            print("No data found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
