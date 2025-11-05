import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Skill Quiz Lab, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily use Skill Quiz Lab for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities
                or actions under your password. You must notify us immediately upon becoming aware of any breach of security
                or unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Quiz Participation</h2>
              <p>
                All participants must register for quizzes through their verified accounts. Colleges and organizers are
                responsible for the accuracy of quiz information and maintaining fair competition standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Content</h2>
              <p>
                Users retain ownership of content they submit, but grant Skill Quiz Lab a license to use, modify, and
                display such content as necessary to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Prohibited Uses</h2>
              <p>
                You may not use Skill Quiz Lab to engage in any unlawful, harmful, or fraudulent activity, including but
                not limited to cheating in quizzes, impersonating others, or disrupting the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p>
                Skill Quiz Lab shall not be liable for any indirect, incidental, special, consequential or punitive damages
                resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
              <p>
                For any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:worktracker75@gmail.com" className="text-primary hover:underline">
                  worktracker75@gmail.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
