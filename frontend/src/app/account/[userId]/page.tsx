"use client"

import React, { use, useEffect, useState } from 'react';
import {
  Camera,
  Trash2,
  Mail,
  Save,
  User as UserIcon,
  Server,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useImap, ImapConfig } from "@/context/imap-context"; // <--- IMPORT CONTEXT
import { BACKEND_URL } from '@/lib/utils';

// User Profile Data
interface UserProfile {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
}

// Request DTO
interface ImapConfigRequest {
  provider: string;
  email: string;
  password: string;
}

const AVAILABLE_PROVIDERS = [
  { id: 'google', label: 'Gmail', icon: 'G', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { id: 'outlook', label: 'Outlook', icon: 'O', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'yahoo', label: 'Yahoo', icon: 'Y', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { id: 'icloud', label: 'iCloud', icon: 'i', color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  { id: 'custom', label: 'Custom IMAP', icon: '#', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' }
];

export default function UserAccount({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { activeAccount, setActiveAccount } = useImap(); // <--- USE CONTEXT

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [connectedAccounts, setConnectedAccounts] = useState<ImapConfig[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [viewState, setViewState] = useState<'list' | 'grid' | 'form'>('list');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [newServer, setNewServer] = useState<ImapConfigRequest>({
    provider: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const fetchData = async () => {
      try {
        setLoading(true);

        const profileRes = await fetch(`${BACKEND_URL}/auth/user/${userId}`, {
          method: 'GET',
          credentials: 'include'
          // headers: { 'Authorization': `Bearer ${storedToken}` }
        });

        if (profileRes.ok) {
          const profileData: UserProfile = await profileRes.json();
          setUserProfile(profileData);
          setUsername(profileData.username || '');
          setEmail(profileData.email || '');
          setProfilePicPreview(profileData.profilePicture || '');
        }

        const imapRes = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
          method: 'GET',
          credentials: 'include'
          // headers: { 'Authorization': `Bearer ${storedToken}` }
        });

        if (imapRes.ok) {
          const imapData: ImapConfig[] = await imapRes.json();
          setConnectedAccounts(imapData);

          if (!activeAccount && imapData.length > 0) {
            // setActiveAccount(imapData[0]);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Could not load account details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId, activeAccount]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setProfilePicPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const handleSaveProfile = async () => {
    setIsEditingProfile(false);

    const userDto = { username, email };
    const formData = new FormData();
    formData.append("userDto", JSON.stringify(userDto));
    if (file) formData.append("profilePic", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/update/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        // headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();
      setUsername(updatedUser.username);
      setProfilePicPreview(updatedUser.profilePicture);

      setSuccessMsg("Profile updated successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError("Failed to update profile.");
      setIsEditingProfile(true);
    }
  };


  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
    setNewServer({ ...newServer, provider: providerId });
    setViewState('form');
  };

  const handleSwitchAccount = (config: ImapConfig) => {
    setActiveAccount(config);
    setSuccessMsg(`Switched to ${config.email}`);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleConnectServer = async () => {
    if (!newServer.email || !newServer.password) {
      setError("Please fill in email and password.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/imap/${userId}`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newServer)
      });

      if (!res.ok) throw new Error("Failed to add server");

      const refreshRes = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
        method: 'GET',
        credentials: 'include'
        // headers: { 'Authorization': `Bearer ${token}` }
      });
      const updatedList: ImapConfig[] = await refreshRes.json();
      setConnectedAccounts(updatedList);

      const justAdded = updatedList.find(acc => acc.email === newServer.email);
      if (justAdded) {
        setActiveAccount(justAdded);
      }

      setNewServer({ provider: '', email: '', password: '' });
      setViewState('list');
      setSuccessMsg("New account connected and selected!");
      setTimeout(() => setSuccessMsg(null), 3000);

    } catch (err) {
      console.error(err);
      setError("Failed to connect. Check credentials.");
      setTimeout(() => setError(null), 4000);
    }
  };

  if (loading) {
    return (
      <SidebarInset className="bg-zinc-950 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </SidebarInset>
    )
  }

  return (
    <SidebarInset className="bg-zinc-950 min-h-screen text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-10 w-full">

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
          <p className="mt-2 text-zinc-400">Manage your personal profile and connected email accounts.</p>
        </div>

        {successMsg && (
          <Alert className="mb-6 border-green-500/20 bg-green-500/10 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-950/10 border-red-900/50 text-red-400">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
            </div>
            <Button
              variant={isEditingProfile ? "default" : "outline"}
              onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
              className={isEditingProfile
                ? "bg-indigo-600 hover:bg-indigo-500 text-white border-0"
                : "border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }
            >
              {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative group shrink-0">
              <Avatar className="h-24 w-24 border-2 border-zinc-700 shadow-xl">
                <AvatarImage src={profilePicPreview} className="object-cover" />
                <AvatarFallback className="bg-zinc-800 text-xl font-bold text-zinc-400">
                  {username ? username.slice(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              {isEditingProfile && (
                <label className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg border-2 border-zinc-900">
                  <Camera className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex-1 w-full space-y-5">
              <div className="grid gap-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Display Name</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditingProfile}
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-indigo-500/50 text-zinc-100 h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditingProfile}
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-indigo-500/50 text-zinc-100 h-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/30 shadow-sm backdrop-blur-sm">
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Active Connections</h2>
            </div>
            {viewState === 'list' && (
              <Button
                size="sm"
                onClick={() => setViewState('grid')}
                className="bg-indigo-600 text-white hover:bg-indigo-500 border-0"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Connect New Account
              </Button>
            )}
          </div>

          <div className="p-6">
            {viewState === 'list' && (
              <div className="space-y-4">
                {connectedAccounts.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {connectedAccounts.map((config) => {
                      const isActive = activeAccount?.id === config.id;

                      return (
                        <div
                          key={config.id}
                          className={`
                                                group relative flex items-center justify-between rounded-lg border p-4 transition-all
                                                ${isActive
                              ? "border-green-500/50 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                              : "border-zinc-800 bg-zinc-950/80 hover:border-zinc-600"
                            }
                                            `}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold shrink-0">
                              {config.provider.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 truncate">
                              <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                                {config.email}
                              </p>
                              <p className="text-xs text-zinc-500 capitalize">{config.provider}</p>
                            </div>
                          </div>

                          <div className="flex items-center pl-2">
                            {isActive ? (
                              <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                                Active
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSwitchAccount(config)}
                                className="text-zinc-500 hover:text-white hover:bg-zinc-800"
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-1.5" /> Switch
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-zinc-800 rounded-lg">
                    <div className="rounded-full bg-zinc-900 p-4 mb-3">
                      <Mail className="h-6 w-6 text-zinc-600" />
                    </div>
                    <h3 className="text-zinc-300 font-medium">No Accounts Connected</h3>
                    <p className="text-sm text-zinc-500 mt-1 mb-4">Add your Gmail, Outlook or other IMAP accounts.</p>
                    <Button onClick={() => setViewState('grid')} variant="outline" className="border-zinc-700 text-zinc-300">
                      Connect First Account
                    </Button>
                  </div>
                )}
              </div>
            )}

            {viewState === 'grid' && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm text-zinc-400">Select email provider</h3>
                  <Button variant="ghost" size="sm" onClick={() => setViewState('list')} className="text-zinc-500 hover:text-white">
                    Cancel
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {AVAILABLE_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleSelectProvider(provider.id)}
                      className={`
                                        flex flex-col items-center justify-center gap-3 rounded-lg border bg-zinc-950/50 p-6 transition-all 
                                        hover:bg-zinc-900 hover:scale-[1.02] ${provider.color.replace('text-', 'border-')} border-zinc-800
                                    `}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${provider.color}`}>
                        {provider.icon}
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{provider.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {viewState === 'form' && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="mb-6 flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setViewState('grid')} className="h-8 w-8 text-zinc-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-sm font-semibold text-white">Connect {AVAILABLE_PROVIDERS.find(p => p.id === selectedProvider)?.label}</h3>
                </div>

                <div className="max-w-md space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">Email Address</Label>
                    <Input
                      placeholder="yourname@example.com"
                      value={newServer.email}
                      onChange={(e) => setNewServer({ ...newServer, email: e.target.value })}
                      className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">App Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      value={newServer.password}
                      onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                      className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500/50"
                    />
                    <p className="text-[10px] text-zinc-500">
                      Use an App Password if 2FA is enabled on your email account.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setViewState('list')} className="text-zinc-400">Cancel</Button>
                    <Button onClick={handleConnectServer} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                      Verify & Connect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </SidebarInset>
  );
}
