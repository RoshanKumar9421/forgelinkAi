import { useMemo, useState } from "react";

const initialForm = {
  project_name: "ForgeLink AI",
  idea_summary:
    "A platform that helps founders and hackathon teams turn raw ideas into validated MVP plans by matching problem urgency, market timing, and AI-assisted product strategy.",
  domain: "general",
  team_skills: "frontend, backend, ai, design",
  problem_severity: 8,
  market_timing: 7,
  novelty: 7,
  execution_speed: 6,
  validation_level: 5,
  ai_dependency: 8,
};

const apiBase = import.meta.env.VITE_API_BASE_URL || "";

const domainLabels = {
  general: "General innovation",
  education: "Education",
  health: "Health",
  sustainability: "Sustainability",
  finance: "Finance",
  media: "Media",
  community: "Community",
  developer_tools: "Developer tools",
};

const scoreGuides = [
  {
    name: "problem_severity",
    label: "Problem severity",
    hint: "How painful and urgent is the problem for users?",
  },
  {
    name: "market_timing",
    label: "Market timing",
    hint: "Is this the right moment for adoption or demand?",
  },
  {
    name: "novelty",
    label: "Novelty",
    hint: "How differentiated is the idea from common solutions?",
  },
  {
    name: "execution_speed",
    label: "Execution speed",
    hint: "How quickly can this team ship a useful prototype?",
  },
  {
    name: "validation_level",
    label: "Validation level",
    hint: "How much real-world feedback or proof do you already have?",
  },
  {
    name: "ai_dependency",
    label: "AI leverage",
    hint: "How much meaningful value does AI add to this product?",
  },
];

const architectureBlocks = [
  {
    title: "React frontend",
    detail: "A focused dashboard for founders to frame the idea, tune execution signals, and review analysis clearly.",
  },
  {
    title: "FastAPI service",
    detail: "A lightweight API receives product inputs and returns structured opportunity intelligence.",
  },
  {
    title: "Python scoring engine",
    detail: "An interpretable AI-style engine estimates readiness, risk, validation strength, and opportunity quality.",
  },
  {
    title: "Roadmap layer",
    detail: "The interface converts analysis into architecture guidance, implementation phases, and demo-ready outputs.",
  },
];

const techStack = [
  "React",
  "Vite",
  "FastAPI",
  "Python",
  "Pydantic",
  "REST API",
  "AI scoring logic",
  "Responsive CSS",
];

function getRoadmap(summary, domain, result) {
  const domainLabel = domainLabels[domain] || "General innovation";
  const focusLine = summary?.toLowerCase().includes("ai")
    ? "Build the first version around one visible AI-assisted workflow instead of spreading AI everywhere."
    : "Keep the MVP centered on one high-value workflow users can understand immediately.";

  return [
    {
      phase: "Phase 1",
      title: "Problem Definition",
      tasks: [
        `Refine the ${domainLabel.toLowerCase()} problem into one sharp user pain point.`,
        "Turn the project summary into a one-sentence value proposition and success metric.",
        "List the top three user problems that must be solved in the first release.",
      ],
    },
    {
      phase: "Phase 2",
      title: "Validation",
      tasks: [
        "Interview at least 5 target users and test whether the summary matches a real need.",
        "Collect repeated pain points, objections, and desired outcomes.",
        focusLine,
      ],
    },
    {
      phase: "Phase 3",
      title: "MVP Scope",
      tasks: [
        "Choose the smallest workflow that delivers clear value in under two minutes.",
        "Use the recommended MVP features as the first release scope.",
        "Drop secondary features until the demo path is clean and fast.",
      ],
    },
    {
      phase: "Phase 4",
      title: "System Build",
      tasks: [
        "Build the React frontend for idea input and results visualization.",
        "Create FastAPI endpoints for analysis and structured recommendation output.",
        "Implement the Python scoring engine and connect it to the frontend API flow.",
      ],
    },
    {
      phase: "Phase 5",
      title: "Demo Readiness",
      tasks: [
        "Test the product with realistic example inputs from the target domain.",
        `Emphasize the strongest result signals: ${result?.verdict || "opportunity fit"}, strengths, and architecture clarity.`,
        "Prepare a short pitch showing problem, solution, AI logic, architecture, and expansion path.",
      ],
    },
  ];
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const skills = form.team_skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const averageScore = Math.round(
    (form.problem_severity +
      form.market_timing +
      form.novelty +
      form.execution_speed +
      form.validation_level +
      form.ai_dependency) /
      6
  );

  const dashboardSignals = [
    { label: "Selected domain", value: domainLabels[form.domain] },
    { label: "Readiness pulse", value: `${averageScore}/10` },
    { label: "Team skills", value: `${skills.length} listed` },
  ];

  const roadmap = useMemo(
    () => getRoadmap(form.idea_summary, form.domain, result),
    [form.idea_summary, form.domain, result]
  );

  const ideaPrompts = [
    "Who has the problem?",
    "Why is it painful right now?",
    "What is the smallest useful solution?",
  ];

  function updateField(event) {
    const { name, value } = event.target;
    const numeric = new Set([
      "problem_severity",
      "market_timing",
      "novelty",
      "execution_speed",
      "validation_level",
      "ai_dependency",
    ]);

    setForm((current) => ({
      ...current,
      [name]: numeric.has(name) ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          team_skills: skills,
        }),
      });

      if (!response.ok) {
        throw new Error("The backend could not analyze this innovation concept.");
      }

      const data = await response.json();
      setResult(data);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />

      <main className="layout">
        <section className="hero">
          <div className="hero-copy">
            <span className="tag">Track 6 | Open Innovation</span>
            <h1>ForgeLink AI</h1>
            <p>
              An AI innovation copilot that transforms raw ideas into startup
              opportunities, implementation plans, and execution-ready product roadmaps.
            </p>

            <div className="hero-cards">
              <article>
                <span>Discover</span>
                <h3>Score startup potential</h3>
                <p>Measure urgency, timing, novelty, and validation with a cleaner decision dashboard.</p>
              </article>
              <article>
                <span>Design</span>
                <h3>Explain the system</h3>
                <p>Show judges the frontend, backend, scoring engine, and architecture in one place.</p>
              </article>
              <article>
                <span>Build</span>
                <h3>Get an implementation roadmap</h3>
                <p>Turn the project summary into practical build phases for a real MVP.</p>
              </article>
            </div>
          </div>

          <aside className="hero-side">
            <div className="stat">
              <strong>Cleaner input flow</strong>
              <p>The dashboard now focuses on the idea itself instead of asking for manual team data.</p>
            </div>
            <div className="stat">
              <strong>Dark-mode UI</strong>
              <p>Sharper contrast, stronger hierarchy, and a more polished demo presentation.</p>
            </div>
            <div className="stat">
              <strong>Roadmap first</strong>
              <p>Every analysis can now feed directly into a staged implementation plan.</p>
            </div>
          </aside>
        </section>

        <section className="grid">
          <form className="panel form-panel" onSubmit={handleSubmit}>
            <div className="heading">
              <span>Innovation Input</span>
              <h2>Describe the product you want to build</h2>
            </div>

            <div className="input-dashboard">
              <section className="dashboard-block accent-block">
                <div className="block-head">
                  <div>
                    <span>Founder Brief</span>
                    <h3>Start with the project summary</h3>
                  </div>
                  <div className="signal-pills">
                    {dashboardSignals.map((signal) => (
                      <div className="signal-pill" key={signal.label}>
                        <span>{signal.label}</span>
                        <strong>{signal.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <label>
                  Project name
                  <input name="project_name" value={form.project_name} onChange={updateField} />
                </label>

                <label>
                  Project summary
                  <textarea
                    name="idea_summary"
                    rows="6"
                    value={form.idea_summary}
                    onChange={updateField}
                  />
                </label>

                <div className="summary-helper">
                  <span>Write it like this:</span>
                  <p>
                    Who has the problem, what pain they feel, and how your product solves it better.
                  </p>
                </div>

                <div className="prompt-chip-row">
                  {ideaPrompts.map((prompt) => (
                    <span className="prompt-chip" key={prompt}>
                      {prompt}
                    </span>
                  ))}
                </div>
              </section>

              <section className="dashboard-block">
                <div className="block-head">
                  <div>
                    <span>Context</span>
                    <h3>Pick the market and define the builder context</h3>
                  </div>
                </div>

                <div className="two-col">
                  <label>
                    Domain
                    <select name="domain" value={form.domain} onChange={updateField}>
                      <option value="general">General</option>
                      <option value="education">Education</option>
                      <option value="health">Health</option>
                      <option value="sustainability">Sustainability</option>
                      <option value="finance">Finance</option>
                      <option value="media">Media</option>
                      <option value="community">Community</option>
                      <option value="developer_tools">Developer Tools</option>
                    </select>
                  </label>

                  <label>
                    Team skills
                    <input
                      name="team_skills"
                      value={form.team_skills}
                      onChange={updateField}
                    />
                  </label>
                </div>

                <div className="context-card">
                  <span>Current focus</span>
                  <strong>{domainLabels[form.domain]}</strong>
                  <p>Use the domain and team strengths to shape users, scope, and build priorities.</p>
                </div>

                <div className="skill-chip-row">
                  {skills.map((skill) => (
                    <span className="skill-chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="dashboard-block">
                <div className="block-head">
                  <div>
                    <span>Readiness Signals</span>
                    <h3>Score the idea like an operator</h3>
                  </div>
                  <div className="mini-score">
                    <span>Average signal</span>
                    <strong>{averageScore}/10</strong>
                  </div>
                </div>

                <div className="slider-grid">
                  {scoreGuides.map((guide) => (
                    <label className="slider-card" key={guide.name}>
                      <div className="slider-title">
                        <div>
                          <strong>{guide.label}</strong>
                          <p>{guide.hint}</p>
                        </div>
                        <span>{form[guide.name]}/10</span>
                      </div>
                      <input
                        name={guide.name}
                        type="range"
                        min="1"
                        max="10"
                        value={form[guide.name]}
                        onChange={updateField}
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <button className={`primary ${loading ? "is-loading" : ""}`} type="submit" disabled={loading}>
              <span className="button-label">
                {loading ? "Generating Report..." : "Generate Opportunity Report"}
              </span>
            </button>

            {error ? <p className="error">{error}</p> : null}
          </form>

          <section className="panel output-panel">
            <div className="heading">
              <span>AI Output</span>
              <h2>Product opportunity and build plan</h2>
            </div>

            {!result ? (
              <div className="empty">
                <p>
                  Submit a project summary to generate scores, architecture guidance, and a practical roadmap for implementation.
                </p>
              </div>
            ) : (
              <div className="results">
                <div className="score-row">
                  <article className="score primary-score">
                    <span>Innovation score</span>
                    <strong>{result.innovation_score}</strong>
                    <p>{result.verdict}</p>
                  </article>
                  <article className="score">
                    <span>Launch readiness</span>
                    <strong>{result.launch_readiness}</strong>
                    <p>Execution confidence</p>
                  </article>
                  <article className="score">
                    <span>Collaboration score</span>
                    <strong>{result.collaboration_score}</strong>
                    <p>Team potential</p>
                  </article>
                </div>

                <div className="story">
                  <h3>Summary</h3>
                  <p>{result.summary}</p>
                  <p className="statement">{result.opportunity_statement}</p>
                </div>

                <div className="ai-brief">
                  <div className="section-bar">
                    <span>AI Copilot</span>
                    <h3>Generated pitch and strategy</h3>
                  </div>
                  <p>{result.ai_pitch}</p>
                </div>

                <div className="columns">
                  <div className="card-list">
                    <h3>Strengths</h3>
                    <ul>
                      {result.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-list">
                    <h3>Risks</h3>
                    <ul>
                      {result.risks.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="columns">
                  <div className="card-list">
                    <h3>MVP features</h3>
                    <ul>
                      {result.mvp_features.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-list">
                    <h3>Target users</h3>
                    <ul>
                      {result.target_users.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="columns">
                  <div className="card-list">
                    <h3>Differentiators</h3>
                    <ul>
                      {result.differentiators.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-list">
                    <h3>Suggested personas</h3>
                    <ul>
                      {result.suggested_personas.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="signal-grid">
                  {result.signals.map((signal) => (
                    <article key={signal.title} className={`signal ${signal.type}`}>
                      <span>{signal.type}</span>
                      <h4>{signal.title}</h4>
                      <p>{signal.description}</p>
                    </article>
                  ))}
                </div>

                <div className="card-list experiments-card">
                  <h3>Launch experiments</h3>
                  <ul>
                    {result.launch_experiments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="architecture-card">
                  <div className="section-bar">
                    <span>Project Architecture</span>
                    <h3>How the system is built</h3>
                  </div>
                  <div className="architecture-grid">
                    {architectureBlocks.map((block) => (
                      <article className="architecture-node" key={block.title}>
                        <strong>{block.title}</strong>
                        <p>{block.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="stack-card">
                  <div className="section-bar">
                    <span>Technology Used</span>
                    <h3>Core stack in this project</h3>
                  </div>
                  <div className="stack-grid">
                    {techStack.map((item) => (
                      <span className="stack-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="roadmap-card">
                  <div className="section-bar">
                    <span>Implementation Roadmap</span>
                    <h3>Proper roadmap for this project summary</h3>
                  </div>
                  <div className="roadmap-grid">
                    {roadmap.map((phase) => (
                      <article className="roadmap-phase" key={phase.phase}>
                        <span>{phase.phase}</span>
                        <h4>{phase.title}</h4>
                        <ul>
                          {phase.tasks.map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
