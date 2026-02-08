import { useState } from 'react';
import type { UserProfile } from '../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CoursesTab from '../components/dashboard/CoursesTab';
import FashionShowsTab from '../components/dashboard/FashionShowsTab';
import DesignStudioTab from '../components/dashboard/DesignStudioTab';
import ProgressTab from '../components/dashboard/ProgressTab';
import CommunityTab from '../components/dashboard/CommunityTab';
import MentorshipTab from '../components/dashboard/MentorshipTab';
import { BookOpen, Sparkles, Palette, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { UserTier } from '../backend';

interface DashboardProps {
  userProfile: UserProfile;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('courses');
  const isFree = userProfile.userTier === UserTier.free;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="fashion-gradient border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome back, <span className="gradient-text">{userProfile.name}</span>
              </h1>
              <Badge variant={isFree ? 'secondary' : 'default'} className="text-sm">
                {isFree ? 'Free' : 'Premium'}
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              {isFree 
                ? 'Explore affordable learning and connect with the community'
                : 'Continue your premium fashion education journey'
              }
            </p>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-transparent">
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mentorship" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Mentorship</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shows" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Shows</span>
            </TabsTrigger>
            <TabsTrigger 
              value="studio" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Studio</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <CoursesTab userTier={userProfile.userTier} />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityTab />
          </TabsContent>

          <TabsContent value="mentorship" className="space-y-6">
            <MentorshipTab />
          </TabsContent>

          <TabsContent value="shows" className="space-y-6">
            <FashionShowsTab />
          </TabsContent>

          <TabsContent value="studio" className="space-y-6">
            <DesignStudioTab />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
