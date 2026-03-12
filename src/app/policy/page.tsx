export default function Policy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg">
          At ClearMed, your privacy is our absolute priority. This policy outlines how we handle the data you entrust to us, particularly when utilizing our bill upload ecosystem.
        </p>

        <section className="space-y-3 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">1. Data Extraction & Anonymization</h2>
          <p>
            When you upload a hospital bill, our Optical Character Recognition (OCR) engine scans the document <strong>strictly</strong> for the following fields:
          </p>
          <ul className="list-disc list-inside ml-4 marker:text-blue-500">
            <li>Hospital Name</li>
            <li>Treatment / Procedure Name</li>
            <li>Financial Data (Total Cost, Implant Cost, etc.)</li>
          </ul>
        </section>

        <section className="space-y-3 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">2. What We Ignore</h2>
          <div className="bg-red-50 p-4 border border-red-100 rounded-lg text-red-800">
            <strong>No Personal Identifiable Information (PII) is ever saved.</strong> We actively discard any lines of text containing your name, address, contact numbers, specific admission dates, or unrelated medical history.
          </div>
        </section>

        <section className="space-y-3 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">3. Usage of Aggregated Data</h2>
          <p>
            The extracted numeric data is anonymized and aggregated into our main database to calculate trends, such as the 6-month historical average cost. Your specific file is deleted from our servers immediately after the extraction process completes.
          </p>
        </section>
        
        <p className="pt-8 text-sm text-slate-500 text-center border-t border-slate-100 mt-12">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
