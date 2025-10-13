"use client"

import Modal from "@/components/ui/modal"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const handleAccept = () => {
    onAccept()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms and Conditions"
      maxWidth="xl"
      footer={
        <button
          onClick={handleAccept}
          className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95"
        >
          Agree
        </button>
      }
    >
      <div className="space-y-6 text-sm text-neutral-300">
        {/* Introduction */}
        <p className="text-neutral-400">
          Welcome to Genius By accessing or using our application, you agree to be bound by these Terms and Conditions. Please read them carefully before using the app.
        </p>

        {/* 1. General Information */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            1. General Information
          </h3>
          <p className="text-neutral-400">
            Genius is a health and wellness application designed to help users track their health metrics and achieve their wellness goals. The app provides tools for tracking various health-related data, but it is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for any health concerns.
          </p>
        </section>

        {/* 2. Use of the App */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            2. Use of the App
          </h3>
          <div className="space-y-2 text-neutral-400">
            <p>
              You agree to use the app for personal, non-commercial purposes only.
            </p>
            <p>
              You will not attempt to interfere with the operation of the app or access it in unauthorized ways.
            </p>
            <p>
              You must be at least 18 years old to use this app.
            </p>
          </div>
        </section>

        {/* 3. User Data */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            3. User Data
          </h3>
          <div className="space-y-2 text-neutral-400">
            <p>
              We collect data you provide and data generated through your app usage, including health metrics, sleep, diet, and exercise data.
            </p>
            <p>
              Data is stored securely and used to provide insights and personalized recommendations.
            </p>
            <p>
              We do not share your personal information with third parties without your consent, except as required by law.
            </p>
          </div>
        </section>

        {/* 4. Accuracy of Information */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            4. Accuracy of Information
          </h3>
          <p className="text-neutral-400">
            While we aim to provide accurate and useful information, Genius does not guarantee the accuracy, completeness, or reliability of any content or data. Insights and trends are for educational and wellness purposes only and should not be used as the sole basis for medical decisions.
          </p>
        </section>

        {/* 5. Third-Party Services */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            5. Third-Party Services
          </h3>
          <p className="text-neutral-400">
            The app may contain links to partner websites or services. These third-party sites have their own terms and policies. Accessing a third-party site is at your own risk. Review their policies before sharing any personal information.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            6. Limitation of Liability
          </h3>
          <p className="text-neutral-400">
            Genius is not liable for any damages, losses, or injuries resulting from the use of the app or reliance on its content. This includes any technical issues or data loss. You use the app at your own risk. Genius is not responsible for decisions made based on app data.
          </p>
        </section>

        {/* 7. Updates to Terms */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            7. Updates to Terms
          </h3>
          <p className="text-neutral-400">
            We may update these Terms and Conditions periodically. Continued use of the app after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* 8. Contact */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            8. Contact
          </h3>
          <p className="text-neutral-400">
            If you have questions about these Terms or the app, please contact us at{" "}
            <a
              href="mailto:GeniusHi@gmail.com"
              className="text-primary-600 hover:text-primary-500 underline"
            >
              GeniusHi@gmail.com
            </a>
          </p>
        </section>
      </div>
    </Modal>
  )
}
