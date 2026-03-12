"use client";

import { useState, useEffect, useMemo } from "react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience_years: number;
}

interface HospitalData {
  id: number;
  name: string;
  city: string;
  rating: number;
  specializations: string[];
  type: string;
  beds: number;
  nabh_status: boolean;
  distance: number;
  outcome_score: number;
  clearmed_score: number;
  match_score?: number;
  predicted_cost?: number;
  historical_costs?: { avg: number, min: number, max: number };
  doctors?: Doctor[];
}

interface InsuranceInfo {
  hospital_id: number;
  is_covered: boolean;
  message: string;
  coverage_percentage?: number;
}

interface ReviewInfo {
  id: number;
  user_name: string;
  rating: number;
  review_text: string;
  date: string;
}

export default function Dashboard() {
  const [searchMode, setSearchMode] = useState<"symptom" | "treatment">("symptom");
  const [searchInput, setSearchInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<{ conditions?: string[], recommended_treatments?: string[] } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(null);

  // New Filters and Reviews
  const [sortBy, setSortBy] = useState<"clearmed" | "cost" | "distance" | "rating">("clearmed");
  const [filterNabh, setFilterNabh] = useState(false);
  const [reviewsData, setReviewsData] = useState<ReviewInfo[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch reviews when an item is selected
  
  useEffect(() => {
    if (selectedHospital) {
      setLoadingReviews(true);
      fetch(`http://localhost:5000/api/v1/hospitals/${selectedHospital}/reviews`)
        .then(res => res.json())
        .then(data => {
          // ensure data is array
          if(Array.isArray(data)) setReviewsData(data);
          else setReviewsData([]);
          setLoadingReviews(false);
        })
        .catch(() => setLoadingReviews(false));
    } else {
      setReviewsData([]);
    }
  }, [selectedHospital]);

  const displayedHospitals = useMemo(() => {
    let result = [...hospitals];
    if (filterNabh) {
      result = result.filter((h: any) => h.nabh_status);
    }
    result.sort((a: any, b: any) => {
      if (sortBy === "clearmed") return b.clearmed_score - a.clearmed_score;
      if (sortBy === "distance") return a.distance - b.distance;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "cost") {
        const costA = a.historical_costs?.avg || a.predicted_cost || 0;
        const costB = b.historical_costs?.avg || b.predicted_cost || 0;
        return costA - costB;
      }
      return 0;
    });
    return result;
  }, [hospitals, sortBy, filterNabh]);

  const handleAnalyze = async () => {
    if (!searchInput) return;
    setLoading(true);
    setInsuranceInfo(null);
    setHospitals([]);
    setAnalysisResult(null);

    try {
      let treatmentsToRank: string[] = [];

      if (searchMode === "symptom") {
        const aiRes = await fetch("http://localhost:5000/api/v1/symptoms/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: searchInput }),
        });
        const aiData = await aiRes.json();
        setAnalysisResult(aiData);
        treatmentsToRank = aiData.recommended_treatments || [];
      } else {
        treatmentsToRank = [searchInput];
        setAnalysisResult({ recommended_treatments: [searchInput] });
      }

      if (treatmentsToRank.length > 0) {
        const treatmentsJoined = encodeURIComponent(treatmentsToRank.join(","));
        const hospRes = await fetch(`http://localhost:5000/api/v1/hospitals/rank?treatments=${treatmentsJoined}`);
        const hospData = await hospRes.json();

        // 3. Append cost predictions & doctor info for top hospitals
        const fullHospitals = await Promise.all(
          hospData.ranked_hospitals.map(async (hTarget: { hospital: HospitalData, score: number }) => {
            const h = hTarget.hospital;
            const primaryTreatment = treatmentsToRank[0];

            // Fetch historical aggregate costs instead of just proxy AI cost
            // Hardcoding treatmentId=1 for MVP demonstration as Prisma lacks NLP string matching natively
            const histRes = await fetch(`http://localhost:5000/api/v1/costs/historical/${h.id}/1`).then(r => r.json()).catch(() => null);

            const costRes = await fetch("http://localhost:5000/api/v1/costs/predict", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ treatment_name: primaryTreatment, hospital_rating: h.rating })
            }).then(r => r.json()).catch(() => null);

            const docRes = await fetch(`http://localhost:5000/api/v1/doctors/${h.id}`).then(r => r.json()).catch(() => []);

            return {
              ...h,
              match_score: hTarget.score,
              predicted_cost: costRes?.predicted_cost_usd,
              historical_costs: histRes?.avg_cost ? { avg: histRes.avg_cost, min: histRes.min_cost, max: histRes.max_cost } : undefined,
              doctors: docRes
            };
          })
        );
        setHospitals(fullHospitals);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const checkInsurance = async (hospitalId: number, providerName: string) => {
    if (!providerName) return alert("Write a provider name!");
    const res = await fetch("http://localhost:5000/api/v1/insurance/eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: providerName, treatment_id: 1, hospital_id: hospitalId })
    });
    const data = await res.json();
    setInsuranceInfo(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-600">ClearMed Setup</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Intelligent healthcare routing. Describe your symptoms, get AI-driven treatment mapping, and find the best hospitals with cost transparency.
          </p>
        </header>

        {/* Mode Toggles Input */}
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col gap-4">
          <div className="flex gap-4 font-semibold border-b border-slate-200 pb-2">
            <button
              className={`pb-2 px-2 transition-all ${searchMode === "symptom" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              onClick={() => { setSearchMode("symptom"); setSearchInput(""); setHospitals([]); }}
            >
              Search by Symptom
            </button>
            <button
              className={`pb-2 px-2 transition-all ${searchMode === "treatment" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              onClick={() => { setSearchMode("treatment"); setSearchInput(""); setHospitals([]); }}
            >
              Search by Treatment
            </button>
          </div>

          <label className="text-lg font-semibold text-slate-700 mt-2">
            {searchMode === "symptom" ? "How are you feeling?" : "What treatment do you need?"}
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={searchMode === "symptom" ? "e.g., I have a severe headache..." : "e.g., Knee Replacement Surgery"}
              className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg shadow-inner"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </section>

        {/* AI Results */}
        {analysisResult && (
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 space-y-6">
            {analysisResult.conditions && analysisResult.conditions.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-2">AI Diagnosis Prediction</h2>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.conditions.map((cond: string, i: number) => (
                    <span key={i} className="bg-white border text-blue-700 px-4 py-1.5 rounded-full font-medium shadow-sm">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysisResult.recommended_treatments && analysisResult.recommended_treatments.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-2">Recommended Treatments</h2>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.recommended_treatments.map((t: string, i: number) => (
                    <span key={i} className="bg-indigo-600 text-white px-4 py-1.5 rounded-full font-medium shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Ranked Hospitals */}
        {hospitals.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 border-slate-200">
              <h2 className="text-3xl font-bold">Recommended Hospitals</h2>
              <div className="flex gap-4 mt-4 md:mt-0">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" checked={filterNabh} onChange={(e) => setFilterNabh(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                  NABH Only
                </label>
                <select
                  className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="clearmed">Sort: ClearMed Score</option>
                  <option value="rating">Sort: Best Rated</option>
                  <option value="cost">Sort: Lowest Cost</option>
                  <option value="distance">Sort: Nearest</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {displayedHospitals.map((hospital: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group" onClick={() => setSelectedHospital(selectedHospital === hospital.id ? null : hospital.id)}>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{hospital.name}</h3>
                        <p className="text-slate-500 text-sm flex gap-2 mt-1">
                          <span>{hospital.city}</span> &bull;
                          <span>{hospital.distance}km away</span> &bull;
                          <span className={hospital.type === 'Private' ? 'text-purple-600' : 'text-blue-600'}>{hospital.type}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg text-sm flex items-center shadow-sm">
                          {hospital.clearmed_score.toFixed(1)} / 10 ClearMed Score
                        </div>
                        {hospital.nabh_status && <span className="text-[10px] uppercase font-bold text-emerald-600 border border-emerald-600 px-1 rounded">NABH Accredited</span>}
                      </div>
                    </div>

                    {/* Advanced Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Outcome Score</p>
                        <p className="text-lg font-black text-indigo-700">{hospital.outcome_score}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Base Rating</p>
                        <p className="text-lg font-black text-amber-600">★ {hospital.rating} <span className="text-xs font-normal text-slate-500">({hospital.review_count || 0} reviews)</span></p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700">Specializations</p>
                      <div className="flex flex-wrap gap-1">
                        {hospital.specializations.map((spec: string, i: number) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{spec}</span>
                        ))}
                      </div>
                    </div>

                    {/* Historical Cost Intelligence Override */}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Cost Intelligence</p>
                      {hospital.historical_costs ? (
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-center">
                            <p className="text-xs text-slate-400">Min</p>
                            <p className="font-bold text-slate-700">₹{hospital.historical_costs.min.toLocaleString()}</p>
                          </div>
                          <div className="text-center bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                            <p className="text-xs text-emerald-600 font-bold">Historical Avg</p>
                            <p className="text-xl font-black text-emerald-700">₹{hospital.historical_costs.avg.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-400">Max</p>
                            <p className="font-bold text-slate-700">₹{hospital.historical_costs.max.toLocaleString()}</p>
                          </div>
                        </div>
                      ) : hospital.predicted_cost && (
                        <div>
                          <p className="text-xs text-slate-500">AI Estimated Primary Treatment Cost</p>
                          <p className="text-3xl font-bold text-emerald-600">₹{hospital.predicted_cost}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details onClick mock */}
                  {selectedHospital === hospital.id && (
                    <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-4">
                      <div>
                        <p className="font-semibold mb-2">Top Doctors</p>
                        {hospital.doctors && hospital.doctors.length > 0 ? (
                          <ul className="text-sm space-y-1">
                            {hospital.doctors.map((d: Doctor) => (
                              <li key={d.id} className="text-slate-700">• {d.name} ({d.experience_years} yrs - {d.specialization})</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No doctors listed.</p>
                        )}
                      </div>

                      <div className="pt-2">
                        <p className="font-semibold mb-2 text-indigo-700">Check Insurance Eligibility</p>
                        <div className="flex gap-2">
                          <input id={`ins-${hospital.id}`} type="text" placeholder="Provider Name (e.g. Aetna)" className="border border-slate-300 rounded px-3 py-1 text-sm flex-1 outline-none" onClick={(e) => e.stopPropagation()}/>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            checkInsurance(hospital.id, (document.getElementById(`ins-${hospital.id}`) as HTMLInputElement).value)
                          }} className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded hover:bg-indigo-700">Check</button>
                        </div>
                        {insuranceInfo && insuranceInfo.hospital_id === hospital.id && (
                          <div className={`mt-3 p-3 rounded-lg text-sm border ${insuranceInfo.is_covered ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <strong>{insuranceInfo.message}</strong>
                            {insuranceInfo.is_covered && <p>Coverage: {insuranceInfo.coverage_percentage}%</p>}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <p className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                          <span className="text-xl">💬</span> People Reviews
                        </p>
                        {loadingReviews ? (
                          <p className="text-sm text-slate-400">Loading reviews...</p>
                        ) : reviewsData.length > 0 ? (
                          <div className="space-y-3">
                            {reviewsData.map((review, rIdx) => (
                              <div key={rIdx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-sm text-slate-800">{review.user_name}</span>
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">★ {review.rating}</span>
                                </div>
                                <p className="text-sm text-slate-600">{review.review_text}</p>
                                <p className="text-xs text-slate-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No recent reviews found.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main >
  );
}
