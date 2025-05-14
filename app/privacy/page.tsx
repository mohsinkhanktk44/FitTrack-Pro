import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Privacy & Terms</h1>
            <p className="text-gray-500 dark:text-gray-400">Last updated: May 10, 2023</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
            <p>
              At NotionCoach, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our service.
            </p>

            <h3 className="text-xl font-bold mt-6">Information We Collect</h3>
            <p>We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Create an account</li>
              <li>Connect your Strava account</li>
              <li>Connect your Notion account</li>
              <li>Use our services</li>
              <li>Contact customer support</li>
            </ul>

            <h3 className="text-xl font-bold mt-6">How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
            </ul>

            <h3 className="text-xl font-bold mt-6">Data Sharing and Disclosure</h3>
            <p>We do not sell your personal information. We may share your information in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who help us operate our business</li>
            </ul>
          </div>

          <div className="space-y-4 mt-12">
            <h2 className="text-2xl font-bold">Terms of Service</h2>
            <p>By using NotionCoach, you agree to these Terms of Service. Please read them carefully.</p>

            <h3 className="text-xl font-bold mt-6">Account Registration</h3>
            <p>
              To use certain features of our service, you must register for an account. You agree to provide accurate
              information and keep it updated. You are responsible for maintaining the confidentiality of your account
              credentials.
            </p>

            <h3 className="text-xl font-bold mt-6">Subscription and Billing</h3>
            <p>
              Some features of our service require a paid subscription. You agree to pay all fees charged to your
              account based on the pricing and billing terms presented to you at the time of purchase.
            </p>

            <h3 className="text-xl font-bold mt-6">Cancellation and Refunds</h3>
            <p>
              You can cancel your subscription at any time through your account settings. Refunds are provided in
              accordance with our refund policy.
            </p>

            <h3 className="text-xl font-bold mt-6">Limitations of Liability</h3>
            <p>
              NotionCoach is provided "as is" without warranties of any kind. In no event will we be liable for any
              indirect, special, incidental, or consequential damages.
            </p>

            <h3 className="text-xl font-bold mt-6">Changes to Terms</h3>
            <p>
              We may modify these terms from time to time. We will notify you of any material changes by posting the new
              terms on our website or via email.
            </p>

            <h3 className="text-xl font-bold mt-6">Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms or for any other
              reason at our discretion.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you have any questions about our Privacy Policy or Terms of Service, please contact us at
              support@notioncoach.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
