import { ref, get } from 'firebase/database';
import { database } from '../../FirebaseData';

// Fetch all blog posts
export async function fetchData() {
  try {
    const dbRef = ref(database, 'blogPosts');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Fetch a single blog post by ID
export async function fetchArticleData(id) {
  try {
    const articleRef = ref(database, `blogPosts/${id}`);
    const snapshot = await get(articleRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching article data:', error);
    return null;
  }
}
