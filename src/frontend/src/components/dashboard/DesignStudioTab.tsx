import { useState } from 'react';
import { useGetMyDesigns, useCreateDesign, useDeleteDesign } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import CreateDesignModal from './CreateDesignModal';
import MaterialGuideModal from './MaterialGuideModal';
import type { VirtualDesign } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DesignStudioTab() {
  const { data: designs, isLoading } = useGetMyDesigns();
  const { mutate: deleteDesign } = useDeleteDesign();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMaterialGuide, setShowMaterialGuide] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Design Studio</h2>
            <p className="text-muted-foreground">
              Create and manage your virtual fashion designs with budget-friendly tools
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowMaterialGuide(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Material Guide
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Design
            </Button>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Budget-Friendly Design Tools</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Access AI-powered recommendations for affordable, local materials that fit your budget. 
                  Our tools help you create stunning designs without breaking the bank.
                </p>
                <Button variant="outline" size="sm" onClick={() => setShowMaterialGuide(true)}>
                  Explore Material Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {!designs || designs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Palette className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Designs Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start creating your first virtual fashion design!
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Design
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onDelete={() => setDesignToDelete(design.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateDesignModal onClose={() => setShowCreateModal(false)} />
      )}

      {showMaterialGuide && (
        <MaterialGuideModal onClose={() => setShowMaterialGuide(false)} />
      )}

      <AlertDialog open={!!designToDelete} onOpenChange={() => setDesignToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Design</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this design? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (designToDelete) {
                  deleteDesign(designToDelete);
                  setDesignToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function DesignCard({ design, onDelete }: { design: VirtualDesign; onDelete: () => void }) {
  const createdDate = new Date(Number(design.createdAt) / 1000000);

  return (
    <Card className="hover-lift overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 relative">
        <img 
          src="/assets/generated/3d-design-interface.dim_800x600.jpg" 
          alt={design.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Palette className="h-16 w-16 text-primary/50" />
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{design.title}</span>
        </CardTitle>
        <CardDescription>
          Created {createdDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Materials ({design.materials.length})</p>
          <div className="flex flex-wrap gap-1">
            {design.materials.slice(0, 3).map(([material], idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {material}
              </Badge>
            ))}
            {design.materials.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{design.materials.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
