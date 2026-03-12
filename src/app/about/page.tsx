export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">About ClearMed</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 text-slate-700 leading-relaxed text-lg">
        <p>
          Welcome to <strong className="text-slate-900">ClearMed</strong>, your trusted partner in navigating the complex world of healthcare costs.
        </p>
        <p>
          We believe that every patient deserves complete transparency before making critical health decisions. In a landscape where hospital bills are often opaque and unpredictable, we bridge the gap by crowdsourcing real data directly from the people who have experienced the system.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Our Mission</h2>
          <p className="text-blue-800">
            To empower patients with the knowledge of precise, historical healthcare costs and quality metrics, allowing them to choose wisely without financial surprises.
          </p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Extract:</strong> Users securely upload their anonymized hospital bills.</li>
          <li><strong>Analyze:</strong> Our AI extracts relevant cost data while discarding any personal identifiable information (PII).</li>
          <li><strong>Inform:</strong> Patients search for treatments and instantly see the real cost boundaries established over the last six months.</li>
        </ul>
        <p className="pt-4 font-semibold text-slate-900">
          Transparency isn't just a buzzword; it's a patient right. Join us in making healthcare clearer for everyone.
        </p>
      </div>
    </main>
  );
}
