// LocalStorage persistence

import { PixFontProject, createEmptyProject } from './types';

const STORAGE_KEY = 'pixfonts_project';
const PREVIEW_TEXT_KEY = 'pixfonts_preview_text';

export function saveProject(project: PixFontProject): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

export function loadProject(): PixFontProject {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as PixFontProject;
    }
  } catch (e) {
    console.error('Failed to load project:', e);
  }
  return createEmptyProject();
}

export function savePreviewText(text: string): void {
  try {
    localStorage.setItem(PREVIEW_TEXT_KEY, text);
  } catch (e) {
    console.error('Failed to save preview text:', e);
  }
}

export function loadPreviewText(): string {
  try {
    return localStorage.getItem(PREVIEW_TEXT_KEY) || 'Hello World';
  } catch (e) {
    console.error('Failed to load preview text:', e);
  }
  return 'Hello World';
}

export function exportProjectFile(project: PixFontProject): void {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.pixfont.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectFile(): Promise<PixFontProject> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error('No file selected'));
      try {
        const text = await file.text();
        resolve(JSON.parse(text) as PixFontProject);
      } catch (e) {
        reject(e);
      }
    };
    input.click();
  });
}
