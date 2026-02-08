import { useGetMyCertifications, useGetMyAchievements } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Calendar, Target } from 'lucide-react';

export default function ProgressTab() {
  const { data: certifications, isLoading: certsLoading } = useGetMyCertifications();
  const { data: achievements, isLoading: achievementsLoading } = useGetMyAchievements();

  const totalPoints = achievements?.reduce((sum, a) => sum + Number(a.points), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Progress</h2>
        <p className="text-muted-foreground">
          Track your achievements and certifications
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep learning to earn more!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {certifications?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Courses completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {achievements?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Milestones reached
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certifications
        </h3>
        {certsLoading ? (
          <Card className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ) : !certifications || certifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Complete courses to earn certifications
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert) => {
              const issuedDate = new Date(Number(cert.issuedAt) / 1000000);
              return (
                <Card key={cert.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Award className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">Certified</Badge>
                    </div>
                    <CardTitle className="text-lg">Course Certificate</CardTitle>
                    <CardDescription>Course ID: {cert.courseId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Issued {issuedDate.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements
        </h3>
        {achievementsLoading ? (
          <Card className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ) : !achievements || achievements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Start your journey to unlock achievements
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const earnedDate = new Date(Number(achievement.earnedAt) / 1000000);
              return (
                <Card key={achievement.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Trophy className="h-8 w-8 text-accent" />
                      <Badge variant="default">{achievement.points.toString()} pts</Badge>
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievement.criteria.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Criteria:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {achievement.criteria.map((criterion, idx) => (
                            <li key={idx}>• {criterion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <Calendar className="h-4 w-4" />
                      Earned {earnedDate.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
