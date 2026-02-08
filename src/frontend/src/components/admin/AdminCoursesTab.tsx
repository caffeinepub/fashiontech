import { useState } from 'react';
import { useGetCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import type { Course, CreateCourseForm } from '../../backend';
import { toast } from 'sonner';

type CourseTierKind = 'free' | 'paid' | 'premium';

export default function AdminCoursesTab() {
  const { data: courses, isLoading } = useGetCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CreateCourseForm>({
    title: '',
    description: '',
    modules: [],
    tier: { __kind__: 'free' },
  });
  const [moduleInput, setModuleInput] = useState('');

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse.mutateAsync({ courseId: editingCourse.id, form: formData });
      } else {
        await createCourse.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourse.mutateAsync(courseId);
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      modules: [], 
      tier: { __kind__: 'free' }
    });
    setModuleInput('');
    setShowCreateDialog(false);
    setEditingCourse(null);
  };

  const addModule = () => {
    if (moduleInput.trim()) {
      setFormData({ ...formData, modules: [...formData.modules, moduleInput.trim()] });
      setModuleInput('');
    }
  };

  const removeModule = (index: number) => {
    setFormData({ ...formData, modules: formData.modules.filter((_, i) => i !== index) });
  };

  const startEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      modules: course.modules,
      tier: course.free ? { __kind__: 'free' } : { __kind__: 'paid' },
    });
    setShowCreateDialog(true);
  };

  const getTierLabel = (tier: CreateCourseForm['tier']): string => {
    if (typeof tier === 'object' && tier && '__kind__' in tier) {
      const kind = tier.__kind__;
      return kind.charAt(0).toUpperCase() + kind.slice(1);
    }
    return 'Free';
  };

  const getTierValue = (tier: CreateCourseForm['tier']): CourseTierKind => {
    if (typeof tier === 'object' && tier && '__kind__' in tier) {
      return tier.__kind__ as CourseTierKind;
    }
    return 'free';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">Create and manage platform courses</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant={course.free ? 'secondary' : 'default'}>
                  {course.free ? 'Free' : 'Premium'}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(course)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(course.id)}
                    disabled={deleteCourse.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{course.modules.length} modules</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first course to get started</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreateDialog} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Update course details' : 'Add a new course to the platform'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Fashion Design"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what students will learn..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Course Tier</Label>
              <Select
                value={getTierValue(formData.tier)}
                onValueChange={(value: CourseTierKind) => {
                  setFormData({ 
                    ...formData, 
                    tier: { __kind__: value }
                  });
                }}
              >
                <SelectTrigger id="tier">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modules</Label>
              <div className="flex gap-2">
                <Input
                  value={moduleInput}
                  onChange={(e) => setModuleInput(e.target.value)}
                  placeholder="Add module name"
                  onKeyPress={(e) => e.key === 'Enter' && addModule()}
                />
                <Button type="button" onClick={addModule}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.modules.map((module, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeModule(index)}>
                    {module} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createCourse.isPending || updateCourse.isPending}
            >
              {(createCourse.isPending || updateCourse.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingCourse ? 'Update' : 'Create'} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
