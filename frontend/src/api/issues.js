// Lightweight API helpers for frontend to talk to backend
export async function fetchIssues(baseUrl = '/api') {
  const res = await fetch(`${baseUrl}/issues`);
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

export async function fetchIssue(id, baseUrl = '/api') {
  const res = await fetch(`${baseUrl}/issues/${id}`);
  if (!res.ok) throw new Error('Failed to fetch issue');
  return res.json();
}

export async function createIssue(data, imageFile, baseUrl = '/api') {
  const form = new FormData();
  if (data.title) form.append('title', data.title);
  if (data.description) form.append('description', data.description);
  if (data.status) form.append('status', data.status);
  if (imageFile) form.append('image', imageFile);
  const res = await fetch(`${baseUrl}/issues`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
}
