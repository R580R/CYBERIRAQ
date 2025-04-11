import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Shield, User, Users, Bell, Smartphone, Globe, Key, Lock, HelpCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  jobTitle: z.string().optional(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  proposalViewed: z.boolean().default(true),
  proposalAccepted: z.boolean().default(true),
  proposalDeclined: z.boolean().default(true),
  newComments: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const enterpriseFormSchema = z.object({
  ssoEnabled: z.boolean().default(false),
  ssoProvider: z.string().optional(),
  ssoUrl: z.string().optional(),
  enforcePasswordPolicy: z.boolean().default(true),
  twoFactorAuth: z.boolean().default(false),
  ipRestriction: z.boolean().default(false),
  allowedIPs: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type EnterpriseFormValues = z.infer<typeof enterpriseFormSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      company: "Acme Corp",
      jobTitle: "Marketing Manager",
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notifications form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      proposalViewed: true,
      proposalAccepted: true,
      proposalDeclined: true,
      newComments: true,
      marketingEmails: false,
    },
  });

  // Enterprise form
  const enterpriseForm = useForm<EnterpriseFormValues>({
    resolver: zodResolver(enterpriseFormSchema),
    defaultValues: {
      ssoEnabled: false,
      ssoProvider: "",
      ssoUrl: "",
      enforcePasswordPolicy: true,
      twoFactorAuth: false,
      ipRestriction: false,
      allowedIPs: "",
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    console.log(data);
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    console.log(data);
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated successfully.",
    });
    console.log(data);
  }

  function onEnterpriseSubmit(data: EnterpriseFormValues) {
    toast({
      title: "Enterprise settings updated",
      description: "Your enterprise security settings have been updated successfully.",
    });
    console.log(data);
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="mt-1 text-sm text-neutral-600">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Marketing Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xl">
                        JD
                      </div>
                      <div>
                        <Button variant="outline" type="button">Change Photo</Button>
                        <p className="text-xs text-neutral-500 mt-2">JPG, GIF or PNG. Max size 1MB.</p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" type="button">Configure</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Sessions</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Current Session</p>
                          <p className="text-xs text-neutral-500">Last active: Just now</p>
                          <p className="text-xs text-neutral-500">Browser: Chrome on Windows</p>
                        </div>
                        <Badge className="bg-success-50 text-success-700 hover:bg-success-50">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Update Password</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Proposal Updates</h3>
                    <FormField
                      control={notificationForm.control}
                      name="proposalViewed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Proposal Viewed</FormLabel>
                            <FormDescription>
                              When a client views your proposal
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="proposalAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Proposal Accepted</FormLabel>
                            <FormDescription>
                              When a client accepts your proposal
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="proposalDeclined"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Proposal Declined</FormLabel>
                            <FormDescription>
                              When a client declines your proposal
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Others</h3>
                    <FormField
                      control={notificationForm.control}
                      name="newComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New Comments</FormLabel>
                            <FormDescription>
                              When someone comments on your proposal
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive product updates and promotional offers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">Save Preferences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Enterprise Tab */}
        <TabsContent value="enterprise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Enterprise Security Settings
              </CardTitle>
              <CardDescription>Configure advanced security features for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...enterpriseForm}>
                <form onSubmit={enterpriseForm.handleSubmit(onEnterpriseSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Single Sign-On (SSO)</h3>
                    <FormField
                      control={enterpriseForm.control}
                      name="ssoEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable SSO</FormLabel>
                            <FormDescription>
                              Allow users to login with your identity provider
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {enterpriseForm.watch("ssoEnabled") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <FormField
                          control={enterpriseForm.control}
                          name="ssoProvider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SSO Provider</FormLabel>
                              <FormControl>
                                <Input placeholder="Okta, Auth0, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={enterpriseForm.control}
                          name="ssoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SSO URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/sso" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Policies</h3>
                    <FormField
                      control={enterpriseForm.control}
                      name="enforcePasswordPolicy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enforce Password Policy</FormLabel>
                            <FormDescription>
                              Require strong passwords (min. 8 chars, mixed case, numbers, symbols)
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={enterpriseForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Require Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Enforce 2FA for all users in your organization
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">IP Restrictions</h3>
                    <FormField
                      control={enterpriseForm.control}
                      name="ipRestriction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">IP Restriction</FormLabel>
                            <FormDescription>
                              Limit access to specific IP addresses or ranges
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {enterpriseForm.watch("ipRestriction") && (
                      <FormField
                        control={enterpriseForm.control}
                        name="allowedIPs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allowed IP Addresses</FormLabel>
                            <FormControl>
                              <Input placeholder="192.168.1.1, 10.0.0.0/24" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter IP addresses or CIDR ranges, separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button type="submit">Save Enterprise Settings</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="bg-primary-50 border-t border-primary-100">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-primary-700">Enterprise Support</h4>
                  <p className="text-xs text-primary-600 mt-1">
                    Need help with enterprise configuration? Contact our dedicated enterprise support team at <a href="mailto:enterprise@proposalpro.com" className="font-medium underline">enterprise@proposalpro.com</a>
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Badge component for security tab
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default Settings;
