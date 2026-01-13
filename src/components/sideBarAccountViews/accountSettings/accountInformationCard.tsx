"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Edit, Save, X } from "lucide-react";
import { useAuth } from "@/src/app/auth/hooks/redux";
import { User } from "@/src/types/user";

export interface AccountViewProps {
    user: User | null;
}

export function AccountInformationCard({ user }: AccountViewProps) {

     const [isEditing, setIsEditing] = useState(false);
  const [accountData, setAccountData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.lastName?.split(" ")[0] || "",
    email: user?.email || "",

  });

  const [editData, setEditData] = useState(accountData);

  const handleSave = () => {
    setAccountData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(accountData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal account information
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Edit className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {accountData.firstName[0]}
                {accountData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>
                {accountData.firstName} {accountData.lastName}
              </CardTitle>
              <CardDescription>{accountData.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {accountData.firstName}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {accountData.lastName}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{accountData.email}</div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      
    </div>
  );
}
