import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import intelligenceService from '../../api/intelligenceService';
import { getCVs } from '../../redux/slices/cvSlice';

function CareerIntelligence() {
  const dispatch = useDispatch();
  const { cvs } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ cv: '', title: '', company: '', content: '' });
  const [analysis, setAnalysis] = useState(null);
  const [interview, setInterview] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { dispatch(getCVs()); }, [dispatch]);
  const token = user?.token?.access;
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const runAnalysis = async (event) => {
    event.preventDefault();
    setBusy(true); setError(''); setAnalysis(null); setInterview(null); setQuestion(null);
    try {
      const job = await intelligenceService.createJob({ title: form.title, company: form.company, content: form.content }, token);
      setAnalysis(await intelligenceService.analyzeMatch({ cv: Number(form.cv), job: job.id }, token));
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create the career analysis.');
    } finally { setBusy(false); }
  };

  const startInterview = async () => {
    setBusy(true); setError('');
    try {
      const session = await intelligenceService.createInterview({ cv: analysis.cv, job: analysis.job, target_role: form.title, focus: 'evidence-based' }, token);
      setInterview(session);
      setQuestion(await intelligenceService.nextQuestion(session.id, token));
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to start the interview coach.');
    } finally { setBusy(false); }
  };

  const evaluateAnswer = async (event) => {
    event.preventDefault();
    if (!answer.trim()) return;
    setBusy(true); setError('');
    try { setQuestion(await intelligenceService.submitAnswer(interview.id, question.id, answer, token)); }
    catch (requestError) { setError(requestError.response?.data?.error || 'Unable to evaluate this answer.'); }
    finally { setBusy(false); }
  };

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8"><p className="text-sm font-semibold text-indigo-600">Evidence-grounded career intelligence</p><h1 className="text-3xl font-bold text-gray-900">Role Fit & Interview Lab</h1><p className="mt-2 text-gray-600">Compare a resume against a target role, inspect the evidence, then practice an adaptive interview question.</p></div>
    <form onSubmit={runAnalysis} className="bg-white shadow rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><select name="cv" value={form.cv} onChange={update} required className="border rounded-md p-2"><option value="">Select a processed resume</option>{cvs.filter((cv) => cv.is_processed).map((cv) => <option value={cv.id} key={cv.id}>{cv.title}</option>)}</select><input name="title" value={form.title} onChange={update} required placeholder="Target role, e.g. Backend Engineer" className="border rounded-md p-2" /><input name="company" value={form.company} onChange={update} placeholder="Company (optional)" className="border rounded-md p-2" /></div>
      <textarea name="content" value={form.content} onChange={update} required rows="9" placeholder="Paste the complete job description, requirements, and responsibilities." className="w-full border rounded-md p-3" />
      <button disabled={busy || !cvs.some((cv) => cv.is_processed)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50">{busy ? 'Analyzing…' : 'Analyze role fit'}</button>
    </form>
    {error && <p className="mt-4 bg-red-50 text-red-700 p-3 rounded-md">{error}</p>}
    {analysis && <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="bg-indigo-600 text-white rounded-lg p-6"><p className="text-sm">Explainable lexical alignment</p><p className="text-5xl font-bold mt-2">{analysis.match_score}%</p><p className="mt-4 text-indigo-100">{analysis.summary}</p></div><div className="bg-white shadow rounded-lg p-6"><h2 className="font-bold text-gray-900">Matched signals</h2><div className="mt-3 flex flex-wrap gap-2">{analysis.strengths.length ? analysis.strengths.map((item) => <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm" key={item}>{item}</span>) : 'No strong overlaps found.'}</div><h2 className="font-bold text-gray-900 mt-6">Gaps to address</h2><div className="mt-3 flex flex-wrap gap-2">{analysis.gaps.length ? analysis.gaps.map((item) => <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm" key={item}>{item}</span>) : 'No material gaps detected.'}</div></div><div className="bg-white shadow rounded-lg p-6"><h2 className="font-bold text-gray-900">Resume evidence</h2>{analysis.evidence.map((item) => <div className="border-l-4 border-indigo-400 pl-3 mt-3" key={item.id}><p className="font-medium text-sm">[{item.id}]</p><p className="text-sm text-gray-600">{item.excerpt}</p></div>)}<button onClick={startInterview} disabled={busy} className="mt-6 bg-gray-900 text-white px-4 py-2 rounded-md disabled:opacity-50">Start interview practice</button></div></section>}
    {question && <section className="mt-8 bg-white shadow rounded-lg p-6"><p className="text-sm font-semibold text-indigo-600">Interview coach</p><h2 className="text-xl font-bold mt-2">{question.question}</h2><p className="mt-2 text-gray-600">Why this question: {question.rationale}</p><p className="mt-2 text-sm text-gray-500">Expected signals: {question.expected_signals.join(', ')}</p>{question.feedback ? <div className="mt-4 bg-indigo-50 p-4 rounded-md"><strong>{question.score}/100</strong><p>{question.feedback}</p></div> : <form className="mt-4" onSubmit={evaluateAnswer}><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows="6" placeholder="Answer using a concrete example and measurable outcome." className="w-full border rounded-md p-3" /><button disabled={busy} className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md">Evaluate answer</button></form>}</section>}
  </div>;
}

export default CareerIntelligence;
