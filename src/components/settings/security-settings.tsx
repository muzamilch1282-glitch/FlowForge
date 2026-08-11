"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settings.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SecuritySettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordLengthValid = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword;
  const isFormValid = passwordLengthValid && passwordsMatch && newPassword.length > 0;

  const changePasswordMutation = useMutation({
    mutationFn: (pwd: string) => settingsService.changePassword(pwd),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error("Failed to change password");
    }
  });

  const signOutAllMutation = useMutation({
    mutationFn: () => settingsService.signOutEverywhere(),
    onSuccess: () => toast.success("Signed out of all sessions successfully"),
    onError: () => toast.error("Failed to sign out of sessions")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      changePasswordMutation.mutate(newPassword);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Your current session information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Logged in as</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Authenticated</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password (Optional)</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {!passwordLengthValid && newPassword.length > 0 && (
                <p className="text-xs text-destructive">Password must be at least 8 characters</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!passwordsMatch && confirmPassword.length > 0 && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isFormValid || changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? "Saving..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Active Sessions</CardTitle>
          <CardDescription>Sign out of all other active sessions across your devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will invalidate all current sessions except this one. You will need to log in again on other devices.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => {
              if(confirm("Are you sure you want to sign out of all sessions?")) {
                signOutAllMutation.mutate();
              }
            }}
            disabled={signOutAllMutation.isPending}
          >
            {signOutAllMutation.isPending ? "Signing out..." : "Sign Out All Sessions"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
