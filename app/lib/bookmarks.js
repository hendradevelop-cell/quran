const STORAGE_KEY = 'quran-web-bookmarks';
export const BOOKMARKS_UPDATED_EVENT = 'quran-bookmarks-updated';

export function readBookmarks() {
  const storedBookmarks = window.localStorage.getItem(STORAGE_KEY);
  if (!storedBookmarks) return [];

  const bookmarks = JSON.parse(storedBookmarks);
  if (!Array.isArray(bookmarks)) {
    throw new Error('Format data bookmark tidak valid.');
  }

  return bookmarks;
}

export function writeBookmarks(bookmarks) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event(BOOKMARKS_UPDATED_EVENT));
}

export function isSameAyah(bookmark, surahNumber, ayahNumber) {
  return bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber;
}
