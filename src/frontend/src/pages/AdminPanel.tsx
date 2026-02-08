import { useState } from 'react';
import type { UserProfile } from '../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, BookOpen, Users, Rocket, Database, Code } from 'lucide-react';
import AdminCoursesTab from '../components/admin/AdminCoursesTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminDeploymentTab from '../components/admin/AdminDeploymentTab';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import DeveloperGuideTab from '../components/admin/DeveloperGuideTab';

interface AdminPanelProps {
  userProfile: UserProfile;
}

export default function AdminPanel({ userProfile }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="fashion-gradient border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Admin Panel
              </h1>
              <Badge variant="default" className="text-sm bg-primary">
                Administrator
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Manage courses, users, deployment settings, and platform configuration
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-transparent">
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="deployment" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Deployment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="developer" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Developer</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <AdminCoursesTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <AdminDeploymentTab />
          </TabsContent>

          <TabsContent value="developer" className="space-y-6">
            <DeveloperGuideTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
