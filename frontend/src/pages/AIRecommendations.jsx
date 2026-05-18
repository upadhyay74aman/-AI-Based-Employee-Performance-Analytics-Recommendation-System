import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, ArrowLeft } from 'lucide-react';

const AIRecommendations = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [employee, setEmployee] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employees`, config);
        const emp = data.find(e => e._id === id);
        if (emp) {
          setEmployee(emp);
          generateRecommendation(emp, config);
        } else {
          setError('Employee not found');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch employee details');
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id, user.token]);

  const generateRecommendation = async (empData, config) => {
    setGenerating(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/ai/recommend`, empData, config);
      setRecommendation(data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI recommendation. Check API key.');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  if (loading && !generating) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading employee data...</div>;
  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }} className="animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>{employee?.name}</h2>
        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          <span><strong>Department:</strong> {employee?.department}</span>
          <span><strong>Score:</strong> {employee?.performanceScore}/100</span>
          <span><strong>Experience:</strong> {employee?.experience} yrs</span>
        </div>
      </div>

      <div className="card glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <Brain color="var(--primary)" size={24} />
          <h2 style={{ margin: 0, color: 'var(--primary)' }}>AI Analysis & Recommendations</h2>
        </div>

        {generating ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Brain size={48} className="animate-pulse" style={{ color: 'var(--primary)', marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
            <p>Analyzing performance data and generating insights...</p>
          </div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-main)' }}>
            {recommendation}
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default AIRecommendations;
