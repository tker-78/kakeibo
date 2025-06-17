import psycopg2
from dotenv import load_dotenv
import os

from supabase import create_client, Client
from typing import Optional, List
from pydantic import BaseModel

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(URL, KEY)

class User(BaseModel):
    id: Optional[int] = None
    firstname: str
    lastname: str
    email: str

class UserCreate(BaseModel):
    firstname: str
    lastname: str
    email: str

class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[str] = None

def get_supabase_client() -> Client:
    return supabase






