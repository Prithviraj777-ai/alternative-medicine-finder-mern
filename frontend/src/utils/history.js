const HISTORY_KEY = 'alt_med_history';

export const getSearchHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToHistory = (medicineName) => {
  let history = getSearchHistory();
  // Filter out the name if it already exists (to move it to top)
  history = history.filter(name => name !== medicineName);
  // Add to beginning
  history.unshift(medicineName);
  // Keep only last 5
  const updatedHistory = history.slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};