import { Mail } from "lucide-react";

const ContactPage = () => {
  const emails = [
    "231401067@rajalakshmi.edu.in",
    "231401122@rajalakshmi.edu.in",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="w-full max-w-xl bg-card border rounded-xl shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Reach out to us at the following email addresses. We typically respond within 1-2 business days.
        </p>

        <ul className="space-y-3">
          {emails.map((email) => (
            <li key={email}>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;


