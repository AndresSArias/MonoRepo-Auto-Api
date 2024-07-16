from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class Constraint(BaseModel):
    column: List[str]
    references: Dict[str, Any]


class TableModel(BaseModel):
    data_type: str
    constraints: Optional[List[str]] = Field(default_factory=list)
    description: Optional[str] = None


class Table(BaseModel):
    primary_key: List[str]
    foreign_keys: Optional[List[Constraint]] = Field(default_factory=list)
    columns: Dict[str, TableModel]


class DatabaseSchema(BaseModel):
    personas: Table
    objetos: Table
    nombre_tabla_n: Optional[Table] = None
