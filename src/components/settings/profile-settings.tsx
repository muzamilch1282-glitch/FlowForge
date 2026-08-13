import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared';
import { Camera, User2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export function ProfileSettings() {
  const { user, profile } = useAuth();
  const router = useRouter();
  
  const [name, setName] = React.useState(profile?.full_name || 'Alex Johnson');
  const [isSaving, setIsSaving] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(profile?.avatar_url || null);
  const [avatarBase64, setAvatarBase64] = React.useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize from profile when it loads
  React.useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
    if (profile?.avatar_url) setAvatarPreview(profile.avatar_url);
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }
    
    // Read file as base64 to save directly in the profile table (prototype approach)
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      setAvatarBase64(base64);
      toast.success('Avatar selected. Save changes to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to save');
      return;
    }
    
    setIsSaving(true);
    try {
      await authService.updateProfile(user.id, {
        full_name: name,
        ...(avatarBase64 && { avatar_url: avatarBase64 })
      });
      toast.success('Profile updated successfully!');
      
      // Refresh to update server components and layout with new avatar/name
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground border-b border-border/60 pb-3">Avatar</h3>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary uppercase">
                  {user?.email?.substring(0, 2) || 'FL'}
                </span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Upload a new photo</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/gif" 
              className="hidden" 
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8" 
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground border-b border-border/60 pb-3">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:ring-1 focus:ring-primary/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input 
              type="email" 
              defaultValue={user?.email || 'alex@example.com'} 
              className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-muted-foreground cursor-not-allowed opacity-80 outline-none"
              disabled
            />
            <p className="text-[10px] text-muted-foreground mt-1">To change your email, please contact support.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</label>
            <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border/60 bg-secondary/30 text-sm text-foreground">
              <User2 className="h-4 w-4 text-muted-foreground" />
              {/* @ts-ignore - Supabase user roles typically reside inside app_metadata */}
              {user?.app_metadata?.role || user?.role || 'Admin'}
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button 
            className="px-6 rounded-full font-medium" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
