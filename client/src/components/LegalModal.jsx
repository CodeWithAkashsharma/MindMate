import React from 'react';
import { X, 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  Search, 
  Bug, 
  Activity, 
  LifeBuoy, 
  BookOpen} from 'lucide-react';

export default function LegalModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  // Header Title mapping based on type
  const getHeaderTitle = () => {
    switch (type) {
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'support': return 'MindMate Support & Help';
      default: return 'Information';
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop overlay - using your dark slate accent with soft blur */}
      <div 
        className="absolute inset-0 bg-[#1A1F1C]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Enhanced Card Container matching Dashboard Aesthetic */}
      <div className="relative bg-white w-full sm:w-[50%] lg:w-[40%] xl:w-[30%] max-w-2xl  h-[90vh] flex flex-col justify-between border border-gray-100 shadow-2xl z-10 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50 bg-white">
          <h2 className="text-gray-900 font-semibold text-lg tracking-tight">
            {getHeaderTitle()}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content View with Clean Typography */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-600 leading-relaxed scrollbar-thin">
          
          {/* PRIVACY POLICY CONTENT */}
          {type === 'privacy' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 mb-4">
                <p className="text-xs text-emerald-800 font-medium">Your mental wellness records are strictly confidential. We prioritize localized security algorithms and user-controlled data rights above everything else.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">1. Information We Collect</h3>
                <p className="mb-2">We collect information to provide better services to all our users. The types of personal information we obtain include:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Account Data:</strong> Email address, secure password hashes, and profile name.</li>
                  <li><strong>Wellness Data:</strong> Journal entries, mood ratings, habit tracking logs, and meditation session metrics.</li>
                  <li><strong>Device & Usage Information:</strong> IP addresses, browser types, interaction timestamps, and application performance metrics to ensure system stability.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">2. Processing of AI Diagnostics & Text Analytics</h3>
                <p>Text strings processed for wellness analytics tracking use secure vector parsing to return dynamic mood charts and optimization insights. <strong>MindMate does not use your personal journal entries to train public LLMs (Large Language Models).</strong> Your text data is processed temporarily in memory to generate immediate insights and is securely written to your private database partition. We do not distribute, exchange, or monetize text inputs compiled within your dynamic journaling nodes.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">3. Data Encryption & Security Protocols</h3>
                <p>MindMate secures all personal log entries, mood parameters, and journaling metrics using modern database encryption protocols (AES-256). Data is encrypted both in transit (via TLS/SSL) and at rest within our MongoDB Atlas cloud infrastructure. Your daily insights are strictly bound to your authenticated credentials via secure JSON Web Tokens (JWT) and fully isolated from any public visibility layers.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">4. Third-Party Data Sharing</h3>
                <p>We do not sell, rent, or trade your personal wellness data. We only share data with trusted third-party service providers (such as cloud hosting providers and secure email dispatchers) who assist us in operating our platform. These partners are bound by strict confidentiality agreements and cannot use your data for independent purposes.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">5. Storage Retraction & User Rights</h3>
                <p className="mb-2">You preserve complete structural ownership of your stored data logs. Under applicable data privacy laws, you have the right to:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Access :</strong> Request all your journal entries and mood data.</li>
                  <li><strong>Correction:</strong> Modify or update inaccurate data within your profile.</li>
                  <li><strong>Right to be Forgotten:</strong> You may execute account deletion updates at any point. This triggers clean, automated routines to permanently scrub all related database tables, journal vectors, and credentials from our active cloud environments instantly.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">6. Changes to this Policy</h3>
                <p>We may update this Privacy Policy periodically to reflect changes in our practices or relevant laws. We will notify you of any material changes via email or an in-app notification dashboard before the changes take effect.</p>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE CONTENT */}
          {type === 'terms' && (
            <div className="space-y-5">
              <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100/50 mb-4">
                <p className="text-xs text-amber-800 font-medium">Please review our non-medical disclaimer framing and acceptable use policies before navigating your dashboard tools.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">1. Acceptance of Terms</h3>
                <p>By registering, accessing, or using the MindMate application, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must immediately cease use of the platform and its associated services.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">2. Non-Medical Provision Framework</h3>
                <p><strong>MindMate is not a substitute for professional medical or psychiatric care.</strong> MindMate functions strictly as a secure self-guided metrics logging ledger, AI wellness companion, and journaling tool. The analytical charts, automated summaries, and tracking vectors generated do not constitute medical assessments, physiological treatment programs, or clinical guidance scripts. If you are experiencing a mental health crisis, please contact emergency services or a licensed therapist immediately.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">3. Identity Integrity & Account Security</h3>
                <p>Users assume full processing liability for maintaining standard security practices regarding personal credentials. You are responsible for safeguarding your password and for all activities that occur under your account. Multi-device spam operations, attempts to bypass authentication middleware, or illegal vector extraction protocols will result in terminal access suspension without prior warning.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">4. Acceptable Use & Conduct</h3>
                <p className="mb-2">While using MindMate, you agree not to:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Use the service for any illegal, unauthorized, or dangerous purposes.</li>
                  <li>Attempt to reverse-engineer, decompile, or hack the application's source code or API endpoints.</li>
                  <li>Upload viruses, malicious code, or excessively large data payloads designed to disrupt server stability.</li>
                  <li>Interfere with or disrupt the security protocols of the platform.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">5. Intellectual Property Rights</h3>
                <p><strong>Your Content:</strong> You retain complete ownership of all text, journals, and data you submit to the application. <strong>Our Property:</strong> The MindMate software, including its UI/UX designs, code, logos, and proprietary AI prompting structures, are owned by MindMate and protected by intellectual property laws. You may not duplicate or reuse our visual design elements or concepts without express written permission.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">6. Limits of Functional Liability</h3>
                <p>System components are delivered on an "as is" and "as available" basis. MindMate provides no operational warranty claims regarding permanent processing continuity, complete absence of bugs, or data persistence intervals during unavoidable cloud infrastructure outages. In no event shall MindMate, its developers, or its affiliates be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the service.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">7. Termination of Service</h3>
                <p>We reserve the right to modify, suspend, or terminate your access to the service at any time, with or without cause, and with or without notice. Upon termination, your right to use the service will immediately cease, and your data may be deleted in accordance with our Privacy Policy.</p>
              </div>
            </div>
          )}

          {/* SUPPORT CONTENT */}
        {type === 'support' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
           

              {/* Quick Contact Grid */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Get in Touch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm">
                    <Mail className="text-blue-500" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">Email Support</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Replies in 24 hrs</p>
                    </div>
                  </div>
                  
     <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm">
  <div className="text-xl">💙</div>

  <div>
    <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
      Support Center
    </h4>

    <p className="text-[11px] text-gray-500 mt-0.5">
      Help and guidance anytime
    </p>
  </div>
</div>

                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group shadow-sm">
                    <Bug className="text-orange-500" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-orange-700 transition-colors">Report Issue</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Log a technical bug</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical FAQs */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Popular FAQs</h3>
                <div className="space-y-3">
                  
                  <div className="bg-white border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition-colors shadow-sm">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-2">
                      <Activity size={16} className="text-emerald-600" />
                      Why is my AI Mood Chart not updating?
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6">
                      Your mood chart requires at least 3 journal entries within a week to establish a baseline vector. Ensure you are saving your entries properly and verify your internet connection so the data syncs with your database.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition-colors shadow-sm">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-2">
                      <BookOpen size={16} className="text-indigo-600" />
                      How is my wellness streak calculated?
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6">
                      Your streak grows when you log a journal entry, complete a meditation session, or check in your daily mood. You must complete at least one of these actions every 24 hours to maintain your active streak.
                    </p>
                  </div>

                </div>
              </div>

              {/* Emergency / Crisis Box */}
              <div className="flex items-start gap-3 p-5 bg-red-50/80 border border-red-100 rounded-xl shadow-sm mt-4">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-red-800 mb-1.5">In Crisis? Need Immediate Help?</h4>
                  <p className="text-xs text-red-700/90 leading-relaxed mb-3">
                    MindMate support does not provide clinical assistance or crisis management. If you or someone you know is going through a severe emotional emergency, please reach out for immediate professional support.
                  </p>
                 <a 
                    href="https://findahelpline.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-semibold bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    View Global Emergency Resources
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer actions - matching your dashboard's curved buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#4A6B55] hover:bg-[#3B5443] transition-all rounded-xl shadow-sm tracking-wide"
          >
            {type === 'support' ? 'Close Window' : 'Acknowledge'}
          </button>
        </div>

      </div>
    </div>
  );
}