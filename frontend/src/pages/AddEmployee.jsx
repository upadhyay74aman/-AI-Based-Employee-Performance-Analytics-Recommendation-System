import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AddEmployee = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim());
      const payload = {
        ...formData,
        skills: skillsArray,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/employees`, payload, config);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="animate-fade-in">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Add New Employee</h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" className="form-input" onChange={handleChange} required defaultValue="">
              <option value="" disabled>Select Department</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input type="text" name="skills" className="form-input" placeholder="React, Node.js, MongoDB" onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Performance Score (0-100)</label>
              <input type="number" name="performanceScore" min="0" max="100" className="form-input" onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input type="number" name="experience" min="0" className="form-input" onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
