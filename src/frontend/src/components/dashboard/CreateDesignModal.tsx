import { useState } from 'react';
import { useCreateDesign } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface CreateDesignModalProps {
  onClose: () => void;
}

export default function CreateDesignModal({ onClose }: CreateDesignModalProps) {
  const [title, setTitle] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materials, setMaterials] = useState<[string, bigint][]>([]);
  const [stepInput, setStepInput] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  
  const { mutate: createDesign, isPending } = useCreateDesign();

  const addMaterial = () => {
    if (materialName.trim() && materialQuantity) {
      setMaterials([...materials, [materialName.trim(), BigInt(materialQuantity)]]);
      setMaterialName('');
      setMaterialQuantity('');
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && materials.length > 0 && steps.length > 0) {
      createDesign(
        {
          title: title.trim(),
          materials,
          steps,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogDescription>
            Design your virtual fashion piece with materials and steps
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Design Title</Label>
            <Input
              id="title"
              placeholder="e.g., Summer Evening Dress"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Materials</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Material name"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Qty"
                value={materialQuantity}
                onChange={(e) => setMaterialQuantity(e.target.value)}
                className="w-24"
                min="1"
              />
              <Button type="button" onClick={addMaterial} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {materials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {materials.map(([name, qty], idx) => (
                  <Badge key={idx} variant="secondary" className="gap-2">
                    {name} ({qty.toString()})
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeMaterial(idx)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Design Steps</Label>
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe a step in the design process"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button type="button" onClick={addStep} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {steps.length > 0 && (
              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-muted rounded-lg"
                  >
                    <span className="font-semibold text-sm text-muted-foreground">
                      {idx + 1}.
                    </span>
                    <span className="flex-1 text-sm">{step}</span>
                    <X
                      className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => removeStep(idx)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={!title.trim() || materials.length === 0 || steps.length === 0 || isPending}
              className="flex-1"
            >
              {isPending ? 'Creating...' : 'Create Design'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
