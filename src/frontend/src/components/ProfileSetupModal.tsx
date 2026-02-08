import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, X } from 'lucide-react';
import { UserTier } from '../backend';

const INTEREST_OPTIONS = [
  'Fashion Design',
  'Trend Forecasting',
  'Sustainable Fashion',
  '3D Design',
  'Textile Design',
  'Fashion Technology',
  'Pattern Making',
  'Fashion Marketing',
  'Styling',
  'Fashion Photography'
];

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userTier, setUserTier] = useState<'free' | 'premium'>('free');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedInterests.length > 0) {
      saveProfile({
        name: name.trim(),
        interests: selectedInterests,
        learningPath: [],
        userTier: userTier === 'free' ? UserTier.free : UserTier.premium
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to FashionTech!
          </DialogTitle>
          <DialogDescription>
            Let's personalize your learning experience. Tell us about yourself to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-base"
            />
          </div>

          <div className="space-y-3">
            <Label>Choose Your Plan</Label>
            <RadioGroup value={userTier} onValueChange={(value) => setUserTier(value as 'free' | 'premium')}>
              <div className="grid gap-4">
                <label
                  htmlFor="free"
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    userTier === 'free' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="free" id="free" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">Free Tier</span>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Perfect for getting started with fashion education
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Access to basic courses on sustainable fashion</li>
                      <li>✓ Foundational design modules</li>
                      <li>✓ Community discussion board</li>
                      <li>✓ Budget-friendly design tools</li>
                      <li>✓ AI material recommendations</li>
                    </ul>
                  </div>
                </label>

                <label
                  htmlFor="premium"
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    userTier === 'premium' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="premium" id="premium" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">Premium Tier</span>
                      <Badge>All Features</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Unlock the full potential of your fashion journey
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Everything in Free tier</li>
                      <li>✓ Advanced courses and masterclasses</li>
                      <li>✓ Priority mentorship matching</li>
                      <li>✓ Exclusive virtual fashion shows</li>
                      <li>✓ Advanced 3D design tools</li>
                      <li>✓ Personalized AI learning paths</li>
                    </ul>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Your Interests (select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer hover:scale-105 transition-transform px-3 py-1.5"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                  {selectedInterests.includes(interest) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || selectedInterests.length === 0 || isPending}
          >
            {isPending ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Start Your Journey'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
