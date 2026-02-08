import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Sparkles } from 'lucide-react';

interface MaterialGuideModalProps {
  onClose: () => void;
}

const AFFORDABLE_MATERIALS = [
  {
    name: 'Cotton Fabric',
    priceRange: '$5-15/yard',
    availability: 'Local fabric stores, online retailers',
    tips: 'Look for end-of-roll discounts and seasonal sales',
    sustainable: true
  },
  {
    name: 'Recycled Denim',
    priceRange: '$3-10/yard',
    availability: 'Thrift stores, upcycling centers',
    tips: 'Old jeans can be transformed into unique pieces',
    sustainable: true
  },
  {
    name: 'Linen Blend',
    priceRange: '$8-20/yard',
    availability: 'Fabric wholesalers, online marketplaces',
    tips: 'Buy in bulk for better prices',
    sustainable: true
  },
  {
    name: 'Polyester Basics',
    priceRange: '$4-12/yard',
    availability: 'Chain fabric stores, discount retailers',
    tips: 'Great for practice projects and prototypes',
    sustainable: false
  },
  {
    name: 'Bamboo Fabric',
    priceRange: '$10-18/yard',
    availability: 'Eco-friendly retailers, specialty stores',
    tips: 'Sustainable alternative with soft texture',
    sustainable: true
  },
  {
    name: 'Vintage Textiles',
    priceRange: '$2-8/piece',
    availability: 'Thrift stores, estate sales, flea markets',
    tips: 'Unique patterns and textures at low cost',
    sustainable: true
  }
];

export default function MaterialGuideModal({ onClose }: MaterialGuideModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Material Guide
          </DialogTitle>
          <DialogDescription>
            Discover affordable, local materials recommended for your fashion projects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid gap-4">
            <img 
              src="/assets/generated/material-guide.dim_700x500.jpg" 
              alt="Affordable materials"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Location-Based Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your location to suggest nearby suppliers and local markets 
                    where you can find affordable materials. Save on shipping and support local businesses!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recommended Materials</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {AFFORDABLE_MATERIALS.map((material, idx) => (
                <Card key={idx} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      {material.sustainable && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                          Sustainable
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {material.priceRange}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Where to Find:</p>
                      <p className="text-sm text-muted-foreground">{material.availability}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Budget Tip:</p>
                      <p className="text-sm text-muted-foreground">{material.tips}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Money-Saving Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Join local fabric swap groups to exchange materials with other designers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Buy fabric remnants and end-of-roll pieces at significant discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Upcycle old clothing and textiles for unique, sustainable designs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Shop during seasonal sales and clearance events for up to 70% off</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Consider online marketplaces for bulk purchases and wholesale prices</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
