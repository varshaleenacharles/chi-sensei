const MissionVisionPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="w-full max-w-3xl bg-card border rounded-xl shadow-md p-8 space-y-6">
        <section>
          <h1 className="text-3xl font-bold">Mission</h1>
          <p className="mt-3 text-muted-foreground">
            To empower Kochi Metro Rail Limited with an intelligent, connected, and bilingual digital ecosystem that transforms how critical information flows across departments—ensuring every document becomes actionable insight, every directive reaches the right person instantly, and every operation upholds safety, compliance, and efficiency.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Vision</h2>
          <p className="mt-3 text-muted-foreground">
            To build a future-ready metro system where automation, AI, and human collaboration work seamlessly—enabling transparent governance, faster decision-making, and sustainable urban mobility that reflects the innovation and inclusivity of a smart city.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MissionVisionPage;


