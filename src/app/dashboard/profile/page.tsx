'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    role: 'Product Manager',
    company: 'Acme Corp',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and preferences."
      >
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </PageHeader>

      <div className="rounded-xl border border-border bg-card p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-border">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            {isEditing && (
              <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </button>
            )}
          </div>
          <div className="text-center sm:text-left mt-2 sm:mt-0">
            <h2 className="text-xl font-semibold text-foreground">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.role} at {profile.company}
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={isEditing ? formData.firstName : profile.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={isEditing ? formData.lastName : profile.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={isEditing ? formData.email : profile.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={isEditing ? formData.role : profile.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={isEditing ? formData.company : profile.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setFormData(profile);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
