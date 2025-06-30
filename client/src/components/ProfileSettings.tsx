import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User, Mail, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Type-safe user access
  const userData = user as any;

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { firstName: string; lastName: string }) => {
      const response = await apiRequest("PATCH", "/api/auth/user", updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || ""
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: ""
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Profile Settings</CardTitle>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEdit}>
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="mr-1 h-4 w-4" />
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userData?.profileImageUrl} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(userData?.firstName, userData?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {userData?.firstName || userData?.lastName ? 
                  `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() : 
                  "User"
                }
              </h3>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {userData?.email || "No email provided"}
              </p>
            </div>
          </div>

          {/* Editable Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <div className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                    {userData?.firstName || "Not provided"}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <div className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                    {userData?.lastName || "Not provided"}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center text-gray-600">
                {userData?.email || "No email provided"}
                <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Account Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Account ID: {userData?.id}</p>
              <p>Member since: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}