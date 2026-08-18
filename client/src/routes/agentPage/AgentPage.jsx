
import "./AgentPage.scss";

const agents = [
  {
    name: "Amit Sahoo",
    role: "Senior Property Consultant",
    experience: "2+ Years Experience",
    image: "/noavatar.png",
  },
  {
    name: "Priya Das",
    role: "Real Estate Consultant",
    experience: "1+ Years Experience",
    image: "/noavatar.png",
  },
  {
    name: "Rahul Mehta",
    role: "Property Advisor",
    experience: "1+ Years Experience",
    image: "/noavatar.png",
  },
];

function AgentsPage() {
  return (
    <div className="agentsPage">
      <div className="wrapper">
        <section className="hero">
          <span>OUR AGENTS</span>
          <h1>Meet Our Real Estate Professionals</h1>
          <p>
            Our experienced property consultants are here to help you discover
            the right property and make your real-estate journey easier.
          </p>
        </section>

        <section className="agentsGrid">
          {agents.map((agent) => (
            <div className="agentCard" key={agent.name}>
              <img src={agent.image} alt={agent.name} />

              <div className="agentInfo">
                <h2>{agent.name}</h2>
                <p className="role">{agent.role}</p>
                <p>{agent.experience}</p>

                <button>View Profile</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default AgentsPage;

