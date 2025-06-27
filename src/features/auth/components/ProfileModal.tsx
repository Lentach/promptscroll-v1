import React, { useEffect, useState } from 'react';
import { X, UserCircle, Image as ImageIcon, LogOut, FileText } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { createPortal } from 'react-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const logout = useLogout();
  const [promptCount, setPromptCount] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // Dodajemy lokalny state dla avatar URL
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    
    // Ustaw początkowy avatar URL
    setCurrentAvatarUrl((user.user_metadata?.avatar_url as string | undefined) ?? null);
    
    (async () => {
      const { count } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);
      if (typeof count === 'number') setPromptCount(count);
    })();
  }, [user, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (<5MB) and type
    if (!/^image\/(png|jpe?g|gif)$/i.test(file.type)) {
      // Użyj console.error zamiast alert
      console.error('Please select PNG, JPG or GIF image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      console.error('Image must be under 5MB');
      return;
    }

    // Natychmiastowy podgląd - ustaw lokalny state
    const immediatePreview = URL.createObjectURL(file);
    setCurrentAvatarUrl(immediatePreview);
    setPreviewUrl(immediatePreview);

    // Upload w tle
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Update profile row
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);
      if (updateError) throw updateError;

      // Update user metadata for immediate UI update
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

      // Zaktualizuj lokalny state z finalnym URL
      setCurrentAvatarUrl(publicUrl);
      
      // Wyczyść temporary preview URL
      if (immediatePreview.startsWith('blob:')) {
        URL.revokeObjectURL(immediatePreview);
      }
      setPreviewUrl(null);

      // USUŃ te linijki - nie ma alertu ani przeładowania!
      // alert('Avatar updated!');
      // window.location.reload();

    } catch (err: any) {
      console.error('Avatar upload failed', err);
      // W przypadku błędu przywróć poprzedni avatar
      setCurrentAvatarUrl((user.user_metadata?.avatar_url as string | undefined) ?? null);
      setPreviewUrl(null);
      
      // Opcjonalnie możesz pokazać dyskretny toast zamiast alert
      // showToast(`Failed to upload avatar: ${err.message ?? err}`);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || !user) return null;

  // Użyj lokalnego state zamiast user.user_metadata
  const avatarUrl = currentAvatarUrl;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  // Modal content to portal
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animation-fade"
      onClick={onClose}
    >
      {/* STOP propagation so clicking inside card doesn't close */}
      <div
        className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar & basic info */}
          <div className="flex flex-col items-center gap-2">
            {avatarUrl ? (
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-500 shadow-md"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
            ) : (
              <span className="w-24 h-24 flex items-center justify-center rounded-full bg-purple-600 text-white text-4xl font-semibold shadow-md">
                {initial}
              </span>
            )}

            <label className={`flex items-center gap-1.5 text-xs text-blue-400 cursor-pointer hover:underline ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <ImageIcon size={14} /> {uploading ? 'Uploading...' : 'Change avatar'}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
                accept="image/png,image/jpeg,image/jpg,image/gif"
              />
            </label>

            <h3 className="text-xl font-semibold text-white truncate max-w-[220px] text-center">
              {displayName}
            </h3>
            <p className="text-sm text-gray-400 truncate max-w-[240px] text-center">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center">
              <FileText className="text-blue-400 mb-1" size={20} />
              <span className="text-lg font-medium text-white">{promptCount ?? '…'}</span>
              <span className="text-xs text-gray-400">Prompts</span>
            </div>
            <div className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center">
              <UserCircle className="text-green-400 mb-1" size={20} />
              <span className="text-lg font-medium text-white">Member</span>
              <span className="text-xs text-gray-400">since 2025</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/profile?modal=my-prompts"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 py-2 text-white transition-colors"
            >
              <FileText size={16} /> View My Prompts
            </Link>

            <button
              onClick={() => {
                logout.mutate();
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-red-600 hover:bg-red-700 py-2 text-white transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};