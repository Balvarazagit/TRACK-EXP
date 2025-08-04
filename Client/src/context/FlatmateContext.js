import { createContext, useContext, useState, useEffect } from "react";

// ✅ Context definition
const FlatmateContext = createContext();

export const FlatmateProvider = ({ children }) => {
  const [group, setGroup] = useState(null);
  const [groupHistory, setGroupHistory] = useState([]);

  useEffect(() => {
    const savedGroup = localStorage.getItem("flatmate-group");
    const savedHistory = localStorage.getItem("flatmate-history");
    if (savedGroup) setGroup(JSON.parse(savedGroup));
    if (savedHistory) setGroupHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (group) {
      localStorage.setItem("flatmate-group", JSON.stringify(group));
      setGroupHistory((prev) => {
        const exists = prev.some((g) => g._id === group._id);
        if (!exists) {
          const updated = [group, ...prev];
          localStorage.setItem("flatmate-history", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [group]);

  // ✅ Remove from history
  const removeGroupFromHistory = (groupId) => {
    const updated = groupHistory.filter((g) => g._id !== groupId);
    setGroupHistory(updated);
    localStorage.setItem("flatmate-history", JSON.stringify(updated));

    const currentGroup = localStorage.getItem("flatmate-group");
    if (currentGroup && JSON.parse(currentGroup)._id === groupId) {
      setGroup(null);
      localStorage.removeItem("flatmate-group");
    }
  };

  return (
    <FlatmateContext.Provider value={{ group, groupHistory, setGroup, removeGroupFromHistory }}>
      {children}
    </FlatmateContext.Provider>
  );
};

// ✅ Export hook
export const useFlatmate = () => useContext(FlatmateContext);
