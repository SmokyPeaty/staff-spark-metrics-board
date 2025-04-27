
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon size={24} className="text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="kpis">KPIs & KRAs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="StaffSpark Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" defaultValue="admin@staffspark.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Technology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Input id="company-size" defaultValue="50-100 employees" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage your company departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>Sales</div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>Marketing</div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>Engineering</div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>HR</div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>Finance</div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>Support</div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                <Button>
                  Add Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kpis" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>KRA and KPI Settings</CardTitle>
              <CardDescription>
                Configure how KRAs and KPIs are calculated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-calculate KPI progress</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically calculate progress based on current vs target values
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow KRA weightage adjustment</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow managers to modify KRA weightages
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>KPI review reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send regular reminders for KPI updates and reviews
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow employee self-assessment</Label>
                      <p className="text-sm text-muted-foreground">
                        Let employees submit their own KPI progress assessments
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Thresholds</CardTitle>
              <CardDescription>
                Configure the thresholds for KPI status determination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="on-track-threshold">On Track Threshold (%)</Label>
                    <Input id="on-track-threshold" type="number" defaultValue="80" />
                    <p className="text-xs text-muted-foreground">
                      KPIs at or above this percentage are considered "On Track"
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="at-risk-threshold">At Risk Threshold (%)</Label>
                    <Input id="at-risk-threshold" type="number" defaultValue="50" />
                    <p className="text-xs text-muted-foreground">
                      KPIs at or above this percentage but below the "On Track" threshold are "At Risk"
                    </p>
                  </div>
                </div>
                <Button>Save Thresholds</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which notifications are sent by email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>KPI status changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when KPI status changes (e.g., from "On Track" to "At Risk")
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly performance summaries</Label>
                      <p className="text-sm text-muted-foreground">
                        Send weekly email summaries of KPI performance
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>KPI approaching deadline</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when a KPI is approaching its due date
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Employee performance alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when an employee's overall performance changes significantly
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
