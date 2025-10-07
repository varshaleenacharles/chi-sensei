const AboutPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="w-full max-w-3xl bg-card border rounded-xl shadow-md p-8 space-y-4">
        <h1 className="text-3xl font-bold">🏢 About Us</h1>
        <p className="text-muted-foreground">
          We are a multidisciplinary innovation team within Kochi Metro Rail Limited (KMRL) dedicated to solving the challenge of document overload and operational latency in large public transport networks.
        </p>
        <div className="space-y-3">
          <p className="text-foreground">Our integrated solution combines:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              AI-driven document summarization and compliance analysis using a custom RAG (Retrieval-Augmented Generation) model built on all-MiniLM-L6-v2 embeddings,
            </li>
            <li>
              Omnichannel communication through WhatsApp, Email, and Native Portals,
            </li>
            <li>
              A bilingual mobile app for station staff to receive tasks, submit reports, and operate seamlessly in English and Malayalam,
            </li>
            <li>
              And a central executive dashboard ensuring complete oversight, audit trails, and safety assurance.
            </li>
          </ul>
          <p className="text-muted-foreground">
            By merging automation with accessibility, we’re making KMRL a benchmark for digital transformation in India’s metro systems—simplifying information, accelerating decisions, and strengthening institutional reliability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


