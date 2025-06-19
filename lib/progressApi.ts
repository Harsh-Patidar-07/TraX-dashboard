import { supabase } from './supabaseClient';

// Save or update progress for a user and chapter
export async function saveProgress(userId: string, chapterIdx: number, checkedTopics: boolean[]) {
  const { data, error } = await supabase
    .from('progress')
    .upsert([{ user_id: userId, chapter_idx: chapterIdx, checked_topics: checkedTopics }], { onConflict: 'user_id,chapter_idx' });
  if (error) {
    console.error('Supabase saveProgress error:', error.message, error.details, error.hint);
    throw new Error(error.message || 'Unknown error in saveProgress');
  }
  return data;
}

// Fetch all progress for a user
export async function fetchProgress(userId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.error('Supabase fetchProgress error:', error.message, error.details, error.hint);
    throw new Error(error.message || 'Unknown error in fetchProgress');
  }
  return data;
}

// Fetch ongoing chapters for a user and subject
export async function fetchOngoingChapters(userId: string, subject: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('ongoing_chapters')
    .select('chapter_indices')
    .eq('user_id', userId)
    .eq('subject', subject)
    .single();
  if (error && error.code !== 'PGRST116') { // ignore 'no rows' error
    console.error('Supabase fetchOngoingChapters error:', error.message, error.details, error.hint);
    throw new Error(error.message || 'Unknown error in fetchOngoingChapters');
  }
  return data?.chapter_indices || [];
}

// Save ongoing chapters for a user and subject
export async function saveOngoingChapters(userId: string, subject: string, chapterIndices: number[]): Promise<void> {
  const { error } = await supabase
    .from('ongoing_chapters')
    .upsert([
      { user_id: userId, subject, chapter_indices: chapterIndices }
    ], { onConflict: 'user_id,subject' });
  if (error) {
    console.error('Supabase saveOngoingChapters error:', error.message, error.details, error.hint);
    throw new Error(error.message || 'Unknown error in saveOngoingChapters');
  }
} 