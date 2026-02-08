import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, Lightbulb, Target } from 'lucide-react';

export default function MentorshipTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mentorship Program</h2>
        <p className="text-muted-foreground">
          Connect with experienced learners for project-based collaboration
        </p>
      </div>

      <div className="grid gap-6">
        <img 
          src="/assets/generated/mentorship-interface.dim_600x400.jpg" 
          alt="Mentorship collaboration"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Find a Mentor</CardTitle>
            </div>
            <CardDescription>
              Connect with experienced designers who can guide you through your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Get personalized guidance on your projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Learn industry best practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Receive constructive feedback</span>
              </li>
            </ul>
            <Button className="w-full">Browse Mentors</Button>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Become a Mentor</CardTitle>
            </div>
            <CardDescription>
              Share your knowledge and help beginners grow in their fashion design journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Give back to the community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Strengthen your own skills by teaching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Build meaningful connections</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Apply as Mentor</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            How Mentorship Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold">Connect</h4>
              <p className="text-sm text-muted-foreground">
                Browse mentor profiles and send connection requests based on your interests
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold">Collaborate</h4>
              <p className="text-sm text-muted-foreground">
                Work together on projects, share resources, and learn through hands-on experience
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold">Grow</h4>
              <p className="text-sm text-muted-foreground">
                Develop your skills, build your portfolio, and advance your fashion career
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
