import React, { useEffect, useState } from 'react';
import { X, UserCircle, Image as ImageIcon, LogOut, FileText, Users, Brain } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { createPortal } from 'react-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFollowerCounts } from '@/features/follow/hooks/useFollowerCounts';
import { FollowListModal } from '@/features/follow/components/FollowListModal';

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
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const { data: followerCounts } = useFollowerCounts(user?.id);
  const followers = followerCounts?.followers ?? null;
  const following = followerCounts?.following ?? null;
  const [listType, setListType] = useState<'followers' | 'following' | null>(null);

  const userId = user.id; // non-null after guard

  useEffect(() => {
    if (!user || !isOpen) return;
    
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

    if (!/^image\/(png|jpe?g|gif)$/i.test(file.type)) {
      console.error('Please select PNG, JPG or GIF image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      console.error('Image must be under 5MB');
      return;
    }

    const immediatePreview = URL.createObjectURL(file);
    setCurrentAvatarUrl(immediatePreview);
    setPreviewUrl(immediatePreview);

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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);
      if (updateError) throw updateError;

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

      setCurrentAvatarUrl(publicUrl);
      
      if (immediatePreview.startsWith('blob:')) {
        URL.revokeObjectURL(immediatePreview);
      }
      setPreviewUrl(null);

    } catch (err: any) {
      console.error('Avatar upload failed', err);
      setCurrentAvatarUrl((user.user_metadata?.avatar_url as string | undefined) ?? null);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || !user) return null;

  const avatarUrl = currentAvatarUrl;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animation-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />

        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="p-6 space-y-6">
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

          <div className="grid grid-cols-3 gap-3 text-center">
            <Link
              to="/my-prompts"
              className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center hover:bg-slate-600/60 transition-colors"
              onClick={onClose}
            >
              <Brain className="text-blue-400 mb-1 animate-pulse" size={20} />
              <span className="text-lg font-medium text-white">{promptCount ?? '…'}</span>
              <span className="text-xs text-gray-400">My Prompts</span>
            </Link>
            <button
              className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center hover:bg-slate-600/60 transition-colors"
              onClick={() => setListType('followers')}
            >
              <Users className="text-green-400 mb-1 animate-pulse" size={20} />
              <span className="text-lg font-medium text-white">{followers ?? '…'}</span>
              <span className="text-xs text-gray-400">Followers</span>
            </button>
            <button
              className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center hover:bg-slate-600/60 transition-colors"
              onClick={() => setListType('following')}
            >
              <UserCircle className="text-yellow-400 mb-1 animate-pulse" size={20} />
              <span className="text-lg font-medium text-white">{following ?? '…'}</span>
              <span className="text-xs text-gray-400">Following</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
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

      <FollowListModal
        userId={userId}
        type={listType as any}
        isOpen={listType !== null}
        onClose={() => setListType(null)}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};