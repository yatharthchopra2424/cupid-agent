'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProfileList from '@/components/ProfileList';
import DateSimulator from '@/components/DateSimulator';
import RankingsView from '@/components/RankingsView';
import ProfileModal from '@/components/ProfileModal';
import AddPersonModal from '@/components/AddPersonModal';

export default function Home() {
  const [people, setPeople] = useState([]);
  const [dates, setDates] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'date' | 'rankings' | 'add'
  const [selectedPersonForModal, setSelectedPersonForModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [datePreselectP1, setDatePreselectP1] = useState(null);
  const [datePreselectP2, setDatePreselectP2] = useState(null);
  const [isSimulatingAll, setIsSimulatingAll] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [peopleRes, datesRes, rankRes] = await Promise.all([
        fetch('/api/people'),
        fetch('/api/date'),
        fetch('/api/rank')
      ]);

      const [peopleData, datesData, rankData] = await Promise.all([
        peopleRes.json(),
        datesRes.json(),
        rankRes.json()
      ]);

      if (peopleData.success) setPeople(peopleData.people || []);
      if (datesData.success) setDates(datesData.results || []);
      if (rankData.success) setRankings(rankData.rankings || {});
    } catch (err) {
      console.error('Failed to load dating platform data:', err);
      showToast('Error loading platform data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Simulate All Dates
  const handleRunAllDates = async () => {
    setIsSimulatingAll(true);
    showToast(`Simulating autonomous dates across all ${people.length} agent pairs...`, 'success');

    try {
      const dateRes = await fetch('/api/date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'all' })
      });
      const dateData = await dateRes.json();

      if (!dateData.success) {
        throw new Error(dateData.error || 'Failed to simulate all dates');
      }

      setDates(dateData.results || []);

      // Now generate rankings
      const rankRes = await fetch('/api/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const rankData = await rankRes.json();

      if (rankData.success) {
        setRankings(rankData.rankings || {});
        showToast(`Simulated ${dateData.count} dates! Rankings updated for all agents.`, 'success');
      }
    } catch (err) {
      console.error('Error running all dates:', err);
      showToast(err.message, 'error');
    } finally {
      setIsSimulatingAll(false);
    }
  };

  // Handle Reset to initial seed
  const handleReset = async () => {
    if (!confirm(`Reset all simulated dates and restore the initial ${people.length} verified agents?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
      const data = await res.json();
      if (data.success) {
        setPeople(data.people || []);
        setDates([]);
        setRankings({});
        showToast('Store reset to original verified agent profiles.');
      }
    } catch (err) {
      showToast('Failed to reset store', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Launch date from profile card
  const handleDatePerson = (person) => {
    setDatePreselectP1(person);
    // Find a suitor with high interest overlap or different person
    const otherSuitor = people.find(p => p.id !== person.id);
    if (otherSuitor) {
      setDatePreselectP2(otherSuitor);
    }
    setActiveTab('date');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump from rankings to specific date in simulator
  const handleSelectDateFromRankings = (p1Id, p2Id) => {
    const p1 = people.find(p => p.id === p1Id);
    const p2 = people.find(p => p.id === p2Id);
    if (p1 && p2) {
      setDatePreselectP1(p1);
      setDatePreselectP2(p2);
      setActiveTab('date');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // New person added callback
  const handlePersonAdded = (newPerson) => {
    setPeople(prev => [...prev, newPerson]);
    showToast(`Agent profile synthesized for ${newPerson.name}!`);
    setActiveTab('explore');
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner" />
        <div className="loading-text">
          Initializing CupidAgent Autonomous Dating Network<span className="loading-dots" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'add') {
            setIsAddModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onRunAllDates={handleRunAllDates}
        onReset={handleReset}
        isSimulating={isSimulatingAll}
        stats={{ peopleCount: people.length, datesCount: dates.length }}
      />

      <main className="page-container">
        {activeTab === 'explore' && (
          <>
            <HeroSection
              peopleCount={people.length}
              datesCount={dates.length}
              onStartDating={() => setActiveTab('date')}
              onExplore={() => {
                const el = document.getElementById('agents-gallery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onRunAll={handleRunAllDates}
            />

            <div id="agents-gallery">
              <ProfileList
                people={people}
                onSelectPerson={(p) => setSelectedPersonForModal(p)}
                onDatePerson={handleDatePerson}
                rankings={rankings}
              />
            </div>
          </>
        )}

        {activeTab === 'date' && (
          <DateSimulator
            people={people}
            preselectedPerson1={datePreselectP1}
            preselectedPerson2={datePreselectP2}
            onDateComplete={(result) => {
              setDates(prev => {
                const filtered = prev.filter(d => d.id !== result.id);
                return [...filtered, result];
              });
              // Auto recalculate rankings in background
              fetch('/api/rank', { method: 'POST' })
                .then(r => r.json())
                .then(d => {
                  if (d.success) setRankings(d.rankings);
                })
                .catch(e => console.error(e));
            }}
          />
        )}

        {activeTab === 'rankings' && (
          <RankingsView
            people={people}
            rankings={rankings}
            onSimulateAll={handleRunAllDates}
            onSelectDate={handleSelectDateFromRankings}
            isSimulating={isSimulatingAll}
          />
        )}
      </main>

      {/* Modals */}
      {selectedPersonForModal && (
        <ProfileModal
          person={selectedPersonForModal}
          onClose={() => setSelectedPersonForModal(null)}
          onDatePerson={handleDatePerson}
          rankings={rankings}
        />
      )}

      {isAddModalOpen && (
        <AddPersonModal
          onClose={() => setIsAddModalOpen(false)}
          onPersonAdded={handlePersonAdded}
        />
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✨'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
