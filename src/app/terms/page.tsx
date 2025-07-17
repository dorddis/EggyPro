import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - EggyPro',
  description: 'Terms of Service for EggyPro premium egg protein products. Read our terms and conditions for using our e-commerce platform.',
  keywords: 'terms of service, eggypro, legal, conditions, e-commerce',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
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
                Welcome to EggyPro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our website, 
                mobile applications, and services (collectively, the &quot;Service&quot;) operated by EggyPro.
              </p>
              <p className="text-gray-700">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                then you may not access the Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By using our Service, you confirm that you have read, understood, and agree to be bound by these Terms. 
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
              <p className="text-gray-700">
                If you are using our Service on behalf of a company or other legal entity, you represent that you have the authority 
                to bind such entity to these Terms.
              </p>
            </section>

            {/* Products and Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Products and Services
              </h2>
              <p className="text-gray-700 mb-4">
                EggyPro offers premium egg protein products through our e-commerce platform. All products are subject to availability 
                and may be discontinued or modified at any time without notice.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-blue-800">
                  <strong>Important:</strong> Our products are dietary supplements and should not replace a balanced diet. 
                  Consult with a healthcare professional before use, especially if you have medical conditions or allergies.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. 
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use false or misleading information when creating an account</li>
                <li>Share your account credentials with others</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            {/* Orders and Payment */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Orders and Payment
              </h2>
              <p className="text-gray-700 mb-4">
                By placing an order, you offer to purchase the products at the prices listed. We reserve the right to accept 
                or decline your order for any reason, including but not limited to product availability, errors in pricing, 
                or suspected fraud.
              </p>
              <p className="text-gray-700 mb-4">
                Payment must be made at the time of ordering. We accept various payment methods as indicated during checkout. 
                All prices are in USD unless otherwise stated.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Prices are subject to change without notice. Sales tax and shipping fees will be 
                  calculated and added to your order total.
                </p>
              </div>
            </section>

            {/* Shipping and Delivery */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Shipping and Delivery
              </h2>
              <p className="text-gray-700 mb-4">
                We strive to process and ship orders promptly. Delivery times are estimates and may vary based on location, 
                shipping method, and product availability.
              </p>
              <p className="text-gray-700 mb-4">
                Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. 
                We are not responsible for delays or damages caused by the shipping carrier.
              </p>
            </section>

            {/* Returns and Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Returns and Refunds
              </h2>
              <p className="text-gray-700 mb-4">
                We accept returns within 30 days of delivery for unused, unopened products in original packaging. 
                Return shipping costs are the responsibility of the customer unless the product is defective.
              </p>
              <p className="text-gray-700 mb-4">
                Refunds will be processed within 5-7 business days after we receive the returned item. 
                Refunds will be issued to the original payment method.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="text-green-800">
                  <strong>Customer Satisfaction:</strong> If you&apos;re not completely satisfied with your purchase, 
                  please contact our customer service team for assistance.
                </p>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our 
                Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700">
                By using our Service, you consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by EggyPro and are protected 
                by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, 
                republish, download, store, or transmit any of the material on our Service without our prior written consent.
              </p>
            </section>

            {/* Prohibited Uses */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Prohibited Uses
              </h2>
              <p className="text-gray-700 mb-4">
                You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate EggyPro, an employee, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                In no event shall EggyPro, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="text-gray-700">
                Our total liability to you for any claims arising from the use of our Service shall not exceed the amount 
                you paid us in the 12 months preceding the claim.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Disclaimers
              </h2>
              <p className="text-gray-700 mb-4">
                The information on our Service is provided on an &quot;as is&quot; basis. EggyPro makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions 
                of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-800">
                  <strong>Health Disclaimer:</strong> Our products are dietary supplements and are not intended to diagnose, 
                  treat, cure, or prevent any disease. Always consult with a healthcare professional before starting any 
                  supplement regimen.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms shall be interpreted and governed by the laws of the United States, without regard to its 
                conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be 
                considered a waiver of those rights.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use 
                our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> legal@eggypro.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 123 Fitness Street, Health City, HC 12345
                </p>
                <p className="text-gray-700">
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </section>

            {/* Effective Date */}
            <section className="border-t pt-8">
              <p className="text-sm text-gray-500 text-center">
                These Terms of Service are effective as of {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} and will remain in effect except with respect to any changes in their provisions in the future.
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