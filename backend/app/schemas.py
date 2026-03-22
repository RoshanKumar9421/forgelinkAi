from typing import Literal

from pydantic import BaseModel, Field


class InnovationInput(BaseModel):
    project_name: str = Field(min_length=2, max_length=80)
    idea_summary: str = Field(min_length=20, max_length=800)
    domain: Literal[
        "education",
        "health",
        "sustainability",
        "finance",
        "media",
        "community",
        "developer_tools",
        "general",
    ]
    problem_severity: int = Field(ge=1, le=10)
    market_timing: int = Field(ge=1, le=10)
    novelty: int = Field(ge=1, le=10)
    execution_speed: int = Field(ge=1, le=10)
    validation_level: int = Field(ge=1, le=10)
    ai_dependency: int = Field(ge=1, le=10)
    team_skills: list[str] = Field(default_factory=list, max_length=8)


class Signal(BaseModel):
    title: str
    type: Literal["strength", "risk", "gap"]
    description: str


class SprintDay(BaseModel):
    day: str
    objective: str
    tasks: list[str]


class InnovationResponse(BaseModel):
    innovation_score: int
    launch_readiness: int
    collaboration_score: int
    verdict: Literal["Prototype Now", "Needs Validation", "Reframe Idea"]
    summary: str
    opportunity_statement: str
    ai_pitch: str
    strengths: list[str]
    risks: list[str]
    missing_roles: list[str]
    mvp_features: list[str]
    target_users: list[str]
    differentiators: list[str]
    suggested_personas: list[str]
    launch_experiments: list[str]
    signals: list[Signal]
    sprint_plan: list[SprintDay]
