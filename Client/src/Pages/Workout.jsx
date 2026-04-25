import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Workout.css';

function Workout() {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  // Data structure kept intact
  const workoutPlans = {
    monday: {
      focus: 'Upper Body',
      exercises: [
        {
          id: 1,
          name: 'Push-ups',
          sets: 3,
          reps: '10-12',
          animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: ['Wide grip push-ups', 'Diamond push-ups', 'Incline push-ups', 'Decline push-ups'],
          description: 'Start in a plank position. Lower your body until chest nearly touches floor, then push back up.'
        },
        {
          id: 2,
          name: 'Dumbbell Rows',
          sets: 3,
          reps: '10-12 each arm',
          animation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          variations: ['Barbell rows', 'Inverted rows', 'Seated cable rows'],
          description: 'Bend at waist, pull weight to side keeping elbow close to body.'
        },
        {
          id: 3,
          name: 'Shoulder Press',
          sets: 3,
          reps: '10-12',
          animation: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
          variations: ['Seated press', 'Arnold press', 'Pike push-ups'],
          description: 'Press weights overhead until arms are fully extended.'
        }
      ]
    },
    tuesday: {
      focus: 'Lower Body',
      exercises: [
        { id: 1, name: 'Squats', sets: 4, reps: '12-15', animation: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a', variations: [], description: 'Lower hips as if sitting in a chair.' },
        { id: 2, name: 'Lunges', sets: 3, reps: '10 each leg', animation: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798', variations: [], description: 'Step forward and lower hips.' },
        { id: 3, name: 'Calf Raises', sets: 3, reps: '15-20', animation: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d', variations: [], description: 'Raise heels off ground.' }
      ]
    },
    wednesday: {
      focus: 'Core & Cardio',
      exercises: [
        { id: 1, name: 'Plank', sets: 3, reps: '30-60s', animation: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6', variations: [], description: 'Hold push-up position.' },
        { id: 2, name: 'Russian Twists', sets: 3, reps: '20', animation: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', variations: [], description: 'Twist torso side to side.' }
      ]
    },
    thursday: {
      focus: 'Upper Body',
      exercises: [
        { id: 1, name: 'Tricep Dips', sets: 3, reps: '10-15', animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e', variations: [], description: 'Lower body by bending elbows.' },
        { id: 2, name: 'Pull-ups', sets: 3, reps: 'Max', animation: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5', variations: [], description: 'Pull chin over bar.' }
      ]
    },
    friday: {
      focus: 'Lower Body',
      exercises: [
        { id: 1, name: 'Deadlifts', sets: 3, reps: '8-10', animation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', variations: [], description: 'Lift weight from ground.' }
      ]
    },
    saturday: {
      focus: 'Full Body',
      exercises: [
        { id: 1, name: 'Burpees', sets: 3, reps: '10', animation: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e', variations: [], description: 'Squat thrust with jump.' }
      ]
    },
    sunday: {
      focus: 'Rest',
      exercises: [
        { id: 1, name: 'Walking', sets: 1, reps: '20m', animation: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c', variations: [], description: 'Leisurely walk.' }
      ]
    }
  };

  useEffect(() => {
    const savedExercises = localStorage.getItem('completedExercises');
    if (savedExercises) {
      setCompletedExercises(JSON.parse(savedExercises));
    }
  }, []);

  const saveCompletedExercise = (exerciseId) => {
    const today = new Date().toISOString().split('T')[0];
    const newCompletedExercise = {
      day: selectedDay,
      exerciseId,
      date: today
    };

    const updatedCompletedExercises = [...completedExercises, newCompletedExercise];
    setCompletedExercises(updatedCompletedExercises);
    localStorage.setItem('completedExercises', JSON.stringify(updatedCompletedExercises));
  };

  const isExerciseCompleted = (exerciseId) => {
    const today = new Date().toISOString().split('T')[0];
    return completedExercises.some(ex =>
      ex.day === selectedDay &&
      ex.exerciseId === exerciseId &&
      ex.date === today
    );
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowAnimation(true);
  };

  const closeExerciseDetails = () => {
    setSelectedExercise(null);
    setShowAnimation(false);
  };

  return (
    <div className="workout-root-container">
      <nav className="workout-navbar">
        <div className="workout-nav-content">
          <Link to="/home" className="workout-back-link">← Back</Link>
          <h1 className='workout-brand-title'>Workout Session</h1>
        </div>
      </nav>

      <div className="workout-content-wrapper container">

        {/* Day Selector */}
        <div className="workout-day-selector">
          <h3>Schedule</h3>
          <div className="workout-days-grid">
            {Object.keys(workoutPlans).map((day) => (
              <button
                key={day}
                className={`workout-day-btn ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="workout-main-panel">
          <div className="workout-header">
            <h2 className="workout-focus-title">Focus: {workoutPlans[selectedDay].focus}</h2>
            <div className="workout-progress-indicator">
              {workoutPlans[selectedDay].exercises.filter(ex => isExerciseCompleted(ex.id)).length} / {workoutPlans[selectedDay].exercises.length} Completed
            </div>
          </div>

          <div className="workout-exercises-list">
            {workoutPlans[selectedDay].exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`workout-exercise-card ${isExerciseCompleted(exercise.id) ? 'completed' : ''}`}
                onClick={() => handleExerciseClick(exercise)}
              >
                <div className="workout-card-status">
                  {isExerciseCompleted(exercise.id) ? '✓' : ''}
                </div>
                <div className="workout-card-info">
                  <h3>{exercise.name}</h3>
                  <p>{exercise.sets} Sets • {exercise.reps} Reps</p>
                </div>
                <span className="workout-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedExercise && (
        <div className="workout-modal-overlay" onClick={closeExerciseDetails}>
          <div className="workout-modal-card" onClick={e => e.stopPropagation()}>
            <button className="workout-modal-close" onClick={closeExerciseDetails}>&times;</button>

            <h2 className="workout-modal-title">{selectedExercise.name}</h2>

            {showAnimation && (
              <div className="workout-modal-image">
                <img src={selectedExercise.animation} alt={selectedExercise.name} />
              </div>
            )}

            <div className="workout-modal-details">
              <p className="workout-description">{selectedExercise.description}</p>
              <div className="workout-stats-grid">
                <div className="workout-stat-box">
                  <span className="label">Sets</span>
                  <span className="value">{selectedExercise.sets}</span>
                </div>
                <div className="workout-stat-box">
                  <span className="label">Reps</span>
                  <span className="value">{selectedExercise.reps}</span>
                </div>
              </div>

              {!isExerciseCompleted(selectedExercise.id) ? (
                <button
                  className="workout-complete-btn"
                  onClick={() => {
                    saveCompletedExercise(selectedExercise.id);
                    closeExerciseDetails();
                  }}
                >
                  Mark as Completed
                </button>
              ) : (
                <button className="workout-completed-state-btn" disabled>Already Completed</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workout;