"use client";

import { useState } from "react";
import { User, Building2, Save, Upload, Edit3 } from "lucide-react";

import { mockBranchData, mockBusinessProfile, mockUserData } from "./mockData";
import { Button } from "../../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Textarea } from "../../../../components/ui/textarea";
import { useAuth } from "@/src/app/auth/hooks/redux";
import { IApiUser } from "@/src/lib/services/auth.server";

export default function AccountSection() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<IApiUser | null>(user);
  const [businessData, setBusinessData] = useState(mockBusinessProfile);
  const [branchData, setBranchData] = useState(mockBranchData);

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  const businessTypes = [
    "LLC",
    "Corporation",
    "Partnership",
    "Sole Proprietorship",
    "Non-Profit",
  ];
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Services",
    "Other",
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Management
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and business information
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            User & Business Profile
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Brand Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
                <CardDescription>
                  Personal account details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      value={userData?.name}
                      onChange={(e) =>
                        setUserData((prev) =>
                          prev ? { ...prev, name: e.target.value } : prev
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userData?.lastName}
                      onChange={(e) =>
                        setUserData((prev) =>
                          prev ? { ...prev, lastName: e.target.value } : prev
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={userData?.username}
                    onChange={(e) =>
                      setUserData((prev) =>
                          prev ? { ...prev, username: e.target.value } : prev
                        )
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData?.email}
                    onChange={(e) =>
                      setUserData((prev) =>
                          prev ? { ...prev, email: e.target.value } : prev
                        )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Profile
                </CardTitle>
                <CardDescription>
                  Company information and legal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={businessData.business_name}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        business_name: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal_name">Legal Name</Label>
                  <Input
                    id="legal_name"
                    value={businessData.legal_name}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        legal_name: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Business Type</Label>
                    <Select
                      value={businessData.business_type}
                      onValueChange={(value) =>
                        setBusinessData({
                          ...businessData,
                          business_type: value,
                        })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={businessData.industry}
                      onValueChange={(value) =>
                        setBusinessData({ ...businessData, industry: value })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ein">EIN</Label>
                    <Input
                      id="ein"
                      value={businessData.ein}
                      onChange={(e) =>
                        setBusinessData({
                          ...businessData,
                          ein: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_fiscal_year">Fiscal Year Start</Label>
                    <Input
                      id="start_fiscal_year"
                      type="date"
                      value={businessData.start_fiscal_year}
                      onChange={(e) =>
                        setBusinessData({
                          ...businessData,
                          start_fiscal_year: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    Created:{" "}
                    {new Date(businessData.createdAt).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline">
                    Updated:{" "}
                    {new Date(businessData.updatedAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Brand Information
              </CardTitle>
              <CardDescription>
                Manage your brand identity and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Section */}
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <Label>Brand Logo</Label>
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={branchData.branding_img || "/placeholder.svg"}
                      alt="Brand Logo"
                    />
                    <AvatarFallback className="text-2xl">
                      {branchData.branding_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {isEditing && (
                  <Button variant="outline" className="mt-6 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Logo
                  </Button>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="branding_name">Brand Name</Label>
                    <Input
                      id="branding_name"
                      value={branchData.branding_name}
                      onChange={(e) =>
                        setBranchData({
                          ...branchData,
                          branding_name: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_address">Email Address</Label>
                    <Input
                      id="email_address"
                      type="email"
                      value={branchData.email_address}
                      onChange={(e) =>
                        setBranchData({
                          ...branchData,
                          email_address: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_address">Website</Label>
                    <Input
                      id="website_address"
                      type="url"
                      value={branchData.website_address}
                      onChange={(e) =>
                        setBranchData({
                          ...branchData,
                          website_address: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="branding_phone">Primary Phone</Label>
                    <Input
                      id="branding_phone"
                      type="tel"
                      value={branchData.branding_phone}
                      onChange={(e) =>
                        setBranchData({
                          ...branchData,
                          branding_phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second_phone">Secondary Phone</Label>
                    <Input
                      id="second_phone"
                      type="tel"
                      value={branchData.second_phone}
                      onChange={(e) =>
                        setBranchData({
                          ...branchData,
                          second_phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="branding_address">Primary Address</Label>
                  <Textarea
                    id="branding_address"
                    value={branchData.branding_address}
                    onChange={(e) =>
                      setBranchData({
                        ...branchData,
                        branding_address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branding_second_address">Secondary Address</Label>
                  <Input
                    id="branding_second_address"
                    value={branchData.branding_second_address}
                    onChange={(e) =>
                      setBranchData({
                        ...branchData,
                        branding_second_address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="Suite, Floor, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
