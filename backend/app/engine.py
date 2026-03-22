from __future__ import annotations

from app.schemas import InnovationInput, InnovationResponse, Signal, SprintDay


def clamp(value: float, minimum: int = 0, maximum: int = 100) -> int:
    return int(max(minimum, min(maximum, round(value))))


def normalize_skills(skills: list[str]) -> set[str]:
    return {skill.strip().lower() for skill in skills if skill.strip()}


def build_assessment(data: InnovationInput) -> InnovationResponse:
    skills = normalize_skills(data.team_skills)
    score = 25.0

    score += data.problem_severity * 3.2
    score += data.market_timing * 2.6
    score += data.novelty * 2.2
    score += data.execution_speed * 2.8
    score += data.validation_level * 2.7
    score += min(len(skills), 5) * 4.5
    score += 5 if data.ai_dependency >= 5 else 2

    if {"frontend", "backend", "fullstack"} & skills:
        score += 4
    if {"design", "ui", "ux"} & skills:
        score += 4
    if {"marketing", "growth", "sales"} & skills:
        score += 4
    if {"ml", "ai", "data"} & skills:
        score += 4

    innovation_score = clamp(score)
    launch_readiness = clamp(
        18
        + data.execution_speed * 5
        + data.validation_level * 4.5
        + min(len(skills), 6) * 4
        - max(0, 6 - data.problem_severity) * 2
    )
    collaboration_score = clamp(
        25
        + min(len(skills), 6) * 7
        + (8 if {"design", "ui", "ux"} & skills else 0)
        + (8 if {"backend", "frontend"} & skills else 0)
        + (8 if {"marketing", "growth"} & skills else 0)
    )

    if innovation_score >= 78 and launch_readiness >= 70:
        verdict = "Prototype Now"
    elif innovation_score >= 55:
        verdict = "Needs Validation"
    else:
        verdict = "Reframe Idea"

    strengths = []
    risks = []

    if data.problem_severity >= 7:
        strengths.append("The problem feels painful enough to justify a strong user need.")
    if data.market_timing >= 7:
        strengths.append("The timing suggests the market is ready for a fresh solution.")
    if data.validation_level >= 6:
        strengths.append("You already have useful validation momentum for a fast MVP.")
    if len(skills) >= 4:
        strengths.append("The team skill mix is broad enough to move from concept to prototype quickly.")
    elif not skills:
        strengths.append("The concept is being evaluated primarily on market, urgency, novelty, and execution signals.")

    if data.validation_level <= 4:
        risks.append("The idea needs more user validation before major build effort.")
    if data.execution_speed <= 4:
        risks.append("Execution risk is high because the current team may ship too slowly.")
    if 0 < len(skills) <= 2:
        risks.append("A narrow skill mix could create delivery bottlenecks.")
    if data.problem_severity <= 4:
        risks.append("The problem may not be painful enough to earn strong adoption.")

    missing_roles = recommend_missing_roles(skills)
    mvp_features = recommend_features(data.domain, data.ai_dependency)
    target_users = recommend_users(data.domain)
    differentiators = recommend_differentiators(data.domain, data.ai_dependency, skills)
    suggested_personas = recommend_personas(data.domain)
    launch_experiments = recommend_experiments(
        data.domain, data.validation_level, data.ai_dependency
    )
    signals = build_signals(data, skills, missing_roles)
    sprint_plan = build_sprint()

    listed_skills = ", ".join(sorted(skills)[:3]) if skills else "generalist"
    opportunity_statement = (
        f"{data.project_name} can turn a {data.domain.replace('_', ' ')} challenge into "
        f"an execution-ready product by combining {listed_skills} capabilities "
        "with fast validation and AI-assisted product planning."
    )

    summary = (
        "This concept is strong enough to prototype immediately and pitch as a cross-domain innovation platform."
        if verdict == "Prototype Now"
        else "This concept has promise, but better validation and sharper positioning will improve its odds."
        if verdict == "Needs Validation"
        else "This concept needs a clearer pain point, stronger evidence, or a better team mix before building."
    )

    ai_pitch = (
        f"{data.project_name} is a {data.domain.replace('_', ' ')} product concept that combines "
        f"problem urgency, market timing, and AI-assisted execution into a startup workflow with an innovation score of {innovation_score}/100. "
        "It helps teams move from idea to validated MVP faster through structured analysis and implementation guidance."
    )

    return InnovationResponse(
        innovation_score=innovation_score,
        launch_readiness=launch_readiness,
        collaboration_score=collaboration_score,
        verdict=verdict,
        summary=summary,
        opportunity_statement=opportunity_statement,
        ai_pitch=ai_pitch,
        strengths=strengths[:4],
        risks=risks[:4],
        missing_roles=missing_roles,
        mvp_features=mvp_features,
        target_users=target_users,
        differentiators=differentiators,
        suggested_personas=suggested_personas,
        launch_experiments=launch_experiments,
        signals=signals,
        sprint_plan=sprint_plan,
    )


def recommend_missing_roles(skills: set[str]) -> list[str]:
    needed = []
    if not ({"frontend", "ui", "ux", "design"} & skills):
        needed.append("Product designer")
    if not ({"backend", "fullstack"} & skills):
        needed.append("Backend engineer")
    if not ({"marketing", "growth", "sales"} & skills):
        needed.append("Growth strategist")
    if not ({"ml", "ai", "data"} & skills):
        needed.append("AI or data specialist")
    return needed[:4]


def recommend_features(domain: str, ai_dependency: int) -> list[str]:
    base = [
        "Idea intake form with structured problem framing",
        "AI-based opportunity scoring dashboard",
        "Team-skill gap detection and collaborator suggestions",
        "One-week MVP sprint generator",
    ]

    if ai_dependency >= 7:
        base.append("AI-generated pitch summary and product direction suggestions")
    if domain in {"education", "health", "community"}:
        base.append("User persona and stakeholder needs mapping")
    else:
        base.append("Market and differentiator checklist for launch planning")

    return base[:5]


def recommend_users(domain: str) -> list[str]:
    mapping = {
        "education": ["Student founders", "Campus incubators", "Hackathon teams"],
        "health": ["Health startups", "Student innovation labs", "Wellness founders"],
        "sustainability": ["Climate builders", "Green startup teams", "Civic innovators"],
        "finance": ["Fintech teams", "Student entrepreneurs", "Startup accelerators"],
        "media": ["Creator-tech founders", "Media startups", "Hackathon builders"],
        "community": ["NGOs", "Student communities", "Social innovation teams"],
        "developer_tools": ["Devtool founders", "Engineering teams", "Product hackers"],
        "general": ["Hackathon teams", "Student founders", "Early-stage startups"],
    }
    return mapping[domain]


def recommend_personas(domain: str) -> list[str]:
    mapping = {
        "education": ["Student founder", "Campus incubator lead", "Hackathon organizer"],
        "health": ["Wellness founder", "Student innovator", "Clinic operations lead"],
        "sustainability": ["Climate founder", "Civic innovator", "Sustainability researcher"],
        "finance": ["Fintech founder", "Startup operator", "Student builder"],
        "media": ["Creator-tech founder", "Indie product team", "Content strategist"],
        "community": ["NGO organizer", "Campus community lead", "Social impact founder"],
        "developer_tools": ["Solo technical founder", "Developer productivity lead", "Hackathon engineer"],
        "general": ["Student founder", "Hackathon team lead", "Early-stage startup operator"],
    }
    return mapping[domain]


def recommend_differentiators(
    domain: str, ai_dependency: int, skills: set[str]
) -> list[str]:
    differentiators = [
        "A fast idea-to-execution workflow instead of scattered brainstorming tools.",
        "Explainable AI scoring that makes the product easier to trust and pitch.",
        "Built-in roadmap generation that converts strategy into concrete next steps.",
    ]

    if ai_dependency >= 7:
        differentiators.append(
            "AI is used as a visible product feature rather than a hidden implementation detail."
        )
    if {"design", "ui", "ux"} & skills:
        differentiators.append("A stronger design angle can improve clarity, adoption, and demo quality.")
    if domain in {"education", "health", "community"}:
        differentiators.append("The concept can show both practical value and broader social impact.")

    return differentiators[:4]


def recommend_experiments(
    domain: str, validation_level: int, ai_dependency: int
) -> list[str]:
    experiments = [
        "Run five target-user interviews and capture repeated pain points in the same language users use.",
        "Test a clickable prototype to see if users understand the value in under two minutes.",
        "Prepare one judge-focused pitch and one user-focused landing page message.",
    ]

    if validation_level <= 4:
        experiments.append("Validate problem demand before expanding the feature set.")
    if ai_dependency >= 7:
        experiments.append("Compare one AI-assisted workflow against a simpler non-AI version.")
    if domain in {"developer_tools", "finance"}:
        experiments.append("Measure whether speed, automation, or clarity is the strongest adoption driver.")

    return experiments[:4]


def build_signals(
    data: InnovationInput, skills: set[str], missing_roles: list[str]
) -> list[Signal]:
    signals: list[Signal] = []

    if data.market_timing >= 7:
        signals.append(
            Signal(
                title="Market timing",
                type="strength",
                description="The current timing looks favorable for testing this concept quickly.",
            )
        )
    if data.validation_level <= 4:
        signals.append(
            Signal(
                title="Evidence gap",
                type="risk",
                description="You should validate demand with user interviews before expanding scope.",
            )
        )
    if 0 < len(skills) <= 2:
        signals.append(
            Signal(
                title="Team bottleneck",
                type="gap",
                description="The idea may stall without a broader mix of execution skills.",
            )
        )
    if missing_roles:
        signals.append(
            Signal(
                title="Missing roles",
                type="gap",
                description=f"Top missing support: {', '.join(missing_roles[:2])}.",
            )
        )
    if {"ml", "ai", "data"} & skills:
        signals.append(
            Signal(
                title="AI leverage",
                type="strength",
                description="The team can use AI as a differentiator instead of a buzzword add-on.",
            )
        )

    return signals[:5]


def build_sprint() -> list[SprintDay]:
    return [
        SprintDay(day="Day 1", objective="Refine problem", tasks=["Reduce the idea to one painful user problem.", "Write a one-sentence value proposition."]),
        SprintDay(day="Day 2", objective="Validate demand", tasks=["Talk to at least five target users.", "Record repeated pain points and objections."]),
        SprintDay(day="Day 3", objective="Scope MVP", tasks=["Choose the smallest useful workflow.", "Cut non-essential features from the first release."]),
        SprintDay(day="Day 4", objective="Design the core flow", tasks=["Sketch input, output, and dashboard screens.", "Define how users see value in under two minutes."]),
        SprintDay(day="Day 5", objective="Build prototype", tasks=["Implement the main demo path.", "Connect the recommendation engine to the UI."]),
        SprintDay(day="Day 6", objective="Test and improve", tasks=["Run feedback sessions with peers.", "Fix clarity and usability issues."]),
        SprintDay(day="Day 7", objective="Pitch and launch", tasks=["Prepare a concise demo story.", "Explain traction, impact, and expansion potential."]),
    ]
