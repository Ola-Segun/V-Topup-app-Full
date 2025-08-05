"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Phone,
  Shield,
  Key,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Settings,
  Smartphone,
  Moon,
  Sun,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { saveRecentAction } from "@/lib/recent-actions"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"


export function UserSettings() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || "John",
    lastName: user?.user_metadata?.last_name || "Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+234 xxx xxx xxxx",
    location: "Lagos, Nigeria",
    bio: "VTopup user since 2024",
    dateOfBirth: "1990-01-01",
    gender: "male",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    promotionalEmails: false,
    securityAlerts: true,
    weeklyReports: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
    showTransactionHistory: false,
    allowDataCollection: true,
    twoFactorAuth: false,
  })

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    currency: "NGN",
    timezone: "Africa/Lagos",
    soundEffects: true,
    autoLogout: 30,
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save recent action
    await saveRecentAction({
      type: "profile_update",
      description: "Updated profile information",
      amount: 0,
      status: "completed",
    })

    setIsEditing(false)
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return
    }

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save recent action
    await saveRecentAction({
      type: "security_update",
      description: "Changed account password",
      amount: 0,
      status: "completed",
    })

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsSaving(false)
  }

  const handleNotificationChange = async (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "settings_update",
      description: `${value ? "Enabled" : "Disabled"} ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`,
      amount: 0,
      status: "completed",
    })
  }

  const handlePrivacyChange = async (key: string, value: boolean | string) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "privacy_update",
      description: `Updated ${key.replace(/([A-Z])/g, " $1").toLowerCase()} setting`,
      amount: 0,
      status: "completed",
    })
  }

  const handlePreferenceChange = async (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "preference_update",
      description: `Updated ${key.replace(/([A-Z])/g, " $1").toLowerCase()} preference`,
      amount: 0,
      status: "completed",
    })
  }

  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    console.log("Account deletion requested")
  }

  const handleExportData = async () => {
    // Implement data export logic
    await saveRecentAction({
      type: "data_export",
      description: "Exported account data",
      amount: 0,
      status: "completed",
    })
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
          <PremiumMobileNav />
          <div className="mobile-container py-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="flex flex-wrap w-full h-full  grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Picture */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Picture</CardTitle>
                      <CardDescription>Update your profile photo</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src="/placeholder.svg?height=128&width=128" />
                        <AvatarFallback className="text-2xl">
                          {profileData.firstName[0]}
                          {profileData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled={!isEditing}>
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <Button variant="outline" size="sm" disabled={!isEditing}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profile Information */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={profileData.location}
                              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                              value={profileData.gender}
                              onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                              disabled={!isEditing}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleChangePassword} className="w-full" disabled={isSaving}>
                        {isSaving ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            <Key className="w-4 h-4 mr-2" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Two-Factor Authentication */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>Add an extra layer of security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable 2FA</Label>
                          <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
                        </div>
                        <Switch
                          checked={privacySettings.twoFactorAuth}
                          onCheckedChange={(checked) => handlePrivacyChange("twoFactorAuth", checked)}
                        />
                      </div>

                      {privacySettings.twoFactorAuth && (
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            Two-factor authentication is enabled. You'll need your authenticator app to sign in.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full bg-transparent" disabled={!privacySettings.twoFactorAuth}>
                          <Smartphone className="w-4 h-4 mr-2" />
                          Setup Authenticator App
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" disabled={!privacySettings.twoFactorAuth}>
                          <Phone className="w-4 h-4 mr-2" />
                          Setup SMS Backup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Manage your active login sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: 1,
                          device: "Chrome on Windows",
                          location: "Lagos, Nigeria",
                          ip: "192.168.1.100",
                          lastActive: "Active now",
                          current: true,
                        },
                        {
                          id: 2,
                          device: "Safari on iPhone",
                          location: "Lagos, Nigeria",
                          ip: "192.168.1.101",
                          lastActive: "2 hours ago",
                          current: false,
                        },
                      ].map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm">{session.device}</p>
                                {session.current && (
                                  <Badge variant="secondary" className="text-xs">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {session.location} • {session.ip}
                              </p>
                              <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                            </div>
                          </div>
                          {!session.current && (
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          {
                            key: "emailNotifications",
                            label: "Email notifications",
                            description: "Receive notifications via email",
                          },
                          {
                            key: "transactionAlerts",
                            label: "Transaction alerts",
                            description: "Get notified about your transactions",
                          },
                          {
                            key: "securityAlerts",
                            label: "Security alerts",
                            description: "Important security notifications",
                          },
                          { key: "weeklyReports", label: "Weekly reports", description: "Weekly summary of your activity" },
                          {
                            key: "promotionalEmails",
                            label: "Promotional emails",
                            description: "Offers and promotional content",
                          },
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>{setting.label}</Label>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Switch
                              checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                              onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Mobile Notifications</h3>
                      <div className="space-y-3">
                        {[
                          {
                            key: "pushNotifications",
                            label: "Push notifications",
                            description: "Receive push notifications on your device",
                          },
                          {
                            key: "smsNotifications",
                            label: "SMS notifications",
                            description: "Receive notifications via SMS",
                          },
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>{setting.label}</Label>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Switch
                              checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                              onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Profile visibility</Label>
                          <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                        </div>
                        <Select
                          value={privacySettings.profileVisibility}
                          onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="friends">Friends only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show transaction history</Label>
                          <p className="text-sm text-muted-foreground">Allow others to see your transaction history</p>
                        </div>
                        <Switch
                          checked={privacySettings.showTransactionHistory}
                          onCheckedChange={(checked) => handlePrivacyChange("showTransactionHistory", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Data collection</Label>
                          <p className="text-sm text-muted-foreground">Allow us to collect data to improve our services</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowDataCollection}
                          onCheckedChange={(checked) => handlePrivacyChange("allowDataCollection", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center space-x-2">
                                <Sun className="w-4 h-4" />
                                <span>Light</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center space-x-2">
                                <Moon className="w-4 h-4" />
                                <span>Dark</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center space-x-2">
                                <Settings className="w-4 h-4" />
                                <span>System</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select
                          value={preferences.language}
                          onValueChange={(value) => handlePreferenceChange("language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="yo">Yoruba</SelectItem>
                            <SelectItem value="ig">Igbo</SelectItem>
                            <SelectItem value="ha">Hausa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select
                          value={preferences.currency}
                          onValueChange={(value) => handlePreferenceChange("currency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select
                          value={preferences.timezone}
                          onValueChange={(value) => handlePreferenceChange("timezone", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sound effects</Label>
                          <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
                        </div>
                        <Switch
                          checked={preferences.soundEffects}
                          onCheckedChange={(checked) => handlePreferenceChange("soundEffects", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Auto logout (minutes)</Label>
                        <Select
                          value={preferences.autoLogout.toString()}
                          onValueChange={(value) => handlePreferenceChange("autoLogout", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="0">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Account Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Your account details and status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Account ID</span>
                          <span className="text-sm text-muted-foreground">VT-{user?.id?.slice(0, 8) || "12345678"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Member since</span>
                          <span className="text-sm text-muted-foreground">January 2024</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Account status</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Verification status</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>Export or delete your account data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Account Data
                      </Button>

                      <Button variant="outline" className="w-full bg-transparent">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>

                      <Separator />

                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>Deleting your account is permanent and cannot be undone.</AlertDescription>
                      </Alert>

                      <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Account Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Account Activity</CardTitle>
                    <CardDescription>Your recent account actions and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          action: "Profile updated",
                          timestamp: "2 hours ago",
                          ip: "192.168.1.100",
                          status: "success",
                        },
                        {
                          action: "Password changed",
                          timestamp: "1 day ago",
                          ip: "192.168.1.100",
                          status: "success",
                        },
                        {
                          action: "Login from new device",
                          timestamp: "3 days ago",
                          ip: "10.0.0.50",
                          status: "warning",
                        },
                        {
                          action: "Two-factor authentication enabled",
                          timestamp: "1 week ago",
                          ip: "192.168.1.100",
                          status: "success",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-lg">
                              {activity.status === "success" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.timestamp} • {activity.ip}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
  )
}
