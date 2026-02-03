import React, { useEffect, useState } from 'react';
import { fetchIssues } from '../api/issues';

function IssuesBoard() {
  const [issues, setIssues] = useState([]);
  useEffect(() => {
    fetchIssues('/api')
      .then(setIssues)
      .catch((e) => console.error('Failed to load issues', e));
  }, []);

  return (
    <div className="issues" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
      {issues.map((issue) => (
        <div key={issue._id ?? issue.id} className="issue" style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
          {issue.image && (
            <img src={issue.image} alt={issue.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
          )}
          <h3 style={{ margin: '8px 0 4px' }}>{issue.title}</h3>
          <p style={{ margin: 0 }}>{issue.description}</p>
        </div>
      ))}
    </div>
  );
}

export default IssuesBoard;
