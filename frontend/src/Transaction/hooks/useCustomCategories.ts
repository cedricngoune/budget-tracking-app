import { useState } from 'react';
import { CATEGORIES } from '../types/transaction.ts';

interface CustomCategory { slug: string; label: string; icon: string; }

export function useCustomCategories(onCategoryAdded: (slug: string) => void) {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [dialogOpen,  setDialogOpen]  = useState(false);
  const [newCatName,  setNewCatName]  = useState('');
  const [newCatError, setNewCatError] = useState('');

  const allCategories = [...CATEGORIES, ...customCategories];

  const handleAddCategory = () => {
    const name = newCatName.trim();
    if (!name) { setNewCatError('Le nom est requis'); return; }
    if (name.length > 30) { setNewCatError('30 caractères max'); return; }
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (allCategories.some(c => c.slug === slug)) { setNewCatError('Cette catégorie existe déjà'); return; }
    setCustomCategories(prev => [...prev, { slug, label: name, icon: '📌' }]);
    onCategoryAdded(slug);
    setNewCatName('');
    setNewCatError('');
    setDialogOpen(false);
  };

  return {
    allCategories,
    dialogOpen,  setDialogOpen,
    newCatName,  setNewCatName,
    newCatError, setNewCatError,
    handleAddCategory,
  };
}