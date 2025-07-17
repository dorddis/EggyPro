import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - EggyPro',
  description: 'Privacy Policy for EggyPro premium egg protein products. Learn how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, personal information, eggypro, e-commerce',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                At EggyPro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and ensuring the security 
                of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you visit our website, use our mobile applications, or make purchases through our platform.
              </p>
              <p className="text-gray-700">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                We may collect the following personal information when you use our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Account credentials and preferences</li>
                <li>Communication history with our customer service team</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-700 mb-4">
                When you visit our website, we automatically collect certain information about your device and usage:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on each page</li>
                <li>Referring website or source</li>
                <li>Device identifiers and cookies</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-blue-800">
                  <strong>Note:</strong> We do not collect sensitive personal information such as health data, 
                  unless you voluntarily provide it for customer support purposes.
                </p>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your account and orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.1 Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                We may share your information with trusted third-party service providers who assist us in operating our website, 
                processing payments, shipping orders, and providing customer support. These providers are contractually obligated 
                to protect your information and use it only for specified purposes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.2 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law, court order, or government request, or to protect 
                our rights, property, or safety, or that of our users or the public.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.3 Business Transfers
              </h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part 
                of the business transaction, subject to the same privacy protections.
              </p>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="text-green-800">
                  <strong>Your Privacy:</strong> We will never sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing through PCI-compliant partners</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze website usage:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                6.1 Types of Cookies We Use
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                6.2 Managing Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies through your browser settings. However, disabling certain cookies 
                may affect the functionality of our website.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Your Privacy Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Response Time:</strong> We will respond to your request within 30 days, 
                  unless additional time is required due to the complexity of the request.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, 
                unless a longer retention period is required or permitted by law. Our retention periods include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Account Information:</strong> Retained while your account is active and for 7 years after deactivation</li>
                <li><strong>Order Information:</strong> Retained for 7 years for tax and legal compliance</li>
                <li><strong>Marketing Communications:</strong> Retained until you unsubscribe or for 3 years</li>
                <li><strong>Website Analytics:</strong> Retained for 2 years</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
                please contact us immediately.
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-800">
                  <strong>Age Requirement:</strong> You must be at least 18 years old to create an account and make purchases. 
                  If you are under 18, you may use our services only with the involvement of a parent or guardian.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your personal information may be transferred to and processed in countries other than your own. 
                We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards 
                to protect your information.
              </p>
              <p className="text-gray-700">
                If you are located in the European Economic Area (EEA), we may transfer your data to countries outside the EEA 
                that have been deemed to provide an adequate level of protection by the European Commission, or we use specific 
                contracts approved by the European Commission.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Third-Party Links
              </h2>
              <p className="text-gray-700 mb-4">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices 
                or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites 
                you visit.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by posting the new policy on our website and updating the &quot;Last updated&quot; date.
              </p>
              <p className="text-gray-700">
                We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@eggypro.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 123 Fitness Street, Health City, HC 12345
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Data Protection Officer:</strong> dpo@eggypro.com
                </p>
                <p className="text-gray-700">
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </section>

            {/* Effective Date */}
            <section className="border-t pt-8">
              <p className="text-sm text-gray-500 text-center">
                This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} and will remain in effect except with respect to any changes in its provisions in the future.
              </p>
            </section>

          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 