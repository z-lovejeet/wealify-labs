"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Video, FileText, Trash2, GripVertical, Save, Pencil } from "lucide-react";
import { createModule, createLesson, deleteModule, deleteLesson, updateCourse, updateModule, updateLesson } from "@/app/actions/admin";
import { toast } from "sonner";

export function CourseManager({ course, modules }: { course: any, modules: any[] }) {
    const [price, setPrice] = useState(course.price);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setPrice(course.price);
    }, [course.price]);

    // Module State
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    // Module Editing State
    const [editingModule, setEditingModule] = useState<any>(null);
    const [editModuleTitle, setEditModuleTitle] = useState("");

    // Lesson State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonType, setNewLessonType] = useState<"video" | "pdf">("video");
    const [newLessonContent, setNewLessonContent] = useState("");
    const [isAddingLesson, setIsAddingLesson] = useState(false);

    // Lesson Editing State
    const [editingLesson, setEditingLesson] = useState<any>(null);
    const [editLessonTitle, setEditLessonTitle] = useState("");
    const [editLessonContent, setEditLessonContent] = useState("");
    const [editLessonType, setEditLessonType] = useState<"video" | "pdf">("video");

    const handleCreateModule = async () => {
        try {
            await createModule(course.id, newModuleTitle, modules.length);
            setNewModuleTitle("");
            setIsAddingModule(false);
            toast.success("Module created");
        } catch (error) {
            toast.error("Failed to create module");
        }
    };

    const handleUpdateModule = async () => {
        if (!editingModule) return;
        try {
            await updateModule(editingModule.id, editModuleTitle);
            setEditingModule(null);
            toast.success("Module updated");
        } catch (error) {
            toast.error("Failed to update module");
        }
    };

    const handleCreateLesson = async () => {
        if (!activeModuleId) return;
        try {
            // Calculate order index based on existing lessons in that module (simple approximation)
            const currentModule = modules.find(m => m.id === activeModuleId);
            const currentLessons = currentModule?.lessons || [];
            await createLesson(activeModuleId, newLessonTitle, newLessonType, newLessonContent, currentLessons.length);

            setNewLessonTitle("");
            setNewLessonContent("");
            setIsAddingLesson(false);
            toast.success("Lesson created");
        } catch (error) {
            toast.error("Failed to create lesson");
        }
    };

    const handleUpdateLesson = async () => {
        if (!editingLesson) return;
        try {
            await updateLesson(editingLesson.id, {
                title: editLessonTitle,
                lesson_type: editLessonType,
                content: editLessonContent
            });
            setEditingLesson(null);
            toast.success("Lesson updated");
        } catch (error) {
            toast.error("Failed to update lesson");
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (confirm("Delete module and all lessons?")) {
            await deleteModule(id);
            toast.success("Module deleted");
        }
    }

    const handleDeleteLesson = async (id: string) => {
        if (confirm("Delete lesson?")) {
            await deleteLesson(id);
            toast.success("Lesson deleted");
        }
    }

    const handleUpdatePrice = async () => {
        try {
            setIsSaving(true);
            await updateCourse(course.id, { price: Number(price) });
            toast.success("Course updated");
        } catch (error) {
            toast.error("Failed to update course");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card p-6 rounded-lg border gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    <p className="text-muted-foreground">{course.description}</p>
                </div>
                <div className="w-full md:w-auto text-left md:text-right flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center gap-2">
                        <Label>Price ($)</Label>
                        <Input
                            type="number"
                            className="w-24 text-right"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Button size="icon" onClick={handleUpdatePrice} disabled={isSaving}>
                            <Save className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">{modules.length} Modules</div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Curriculum</h3>
                <Sheet open={isAddingModule} onOpenChange={setIsAddingModule}>
                    <SheetTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2" /> Add Module</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Module</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Module Title</Label>
                                <Input value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} placeholder="e.g. Introduction" />
                            </div>
                            <Button onClick={handleCreateModule} disabled={!newModuleTitle}>Create Module</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Edit Module Dialog */}
            <Dialog open={!!editingModule} onOpenChange={(open) => !open && setEditingModule(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Module</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Module Title</Label>
                            <Input value={editModuleTitle} onChange={(e) => setEditModuleTitle(e.target.value)} />
                        </div>
                        <Button onClick={handleUpdateModule}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Lesson Dialog */}
            <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Lesson</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input value={editLessonTitle} onChange={(e) => setEditLessonTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={editLessonType} onValueChange={(v: "video" | "pdf") => setEditLessonType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video URL</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Content (URL)</Label>
                            <Input value={editLessonContent} onChange={(e) => setEditLessonContent(e.target.value)} />
                        </div>
                        <Button onClick={handleUpdateLesson}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="border rounded-lg px-4 bg-card">
                        <div className="flex flex-col md:flex-row items-start md:items-center py-4 gap-4">
                            <div className="flex items-center w-full md:w-auto">
                                <GripVertical className="h-5 w-5 text-muted-foreground mr-3 cursor-move flex-shrink-0" />
                                <AccordionTrigger className="hover:no-underline py-0 flex-1 text-lg font-medium text-left">
                                    {module.title}
                                </AccordionTrigger>
                            </div>
                            <div className="flex items-center gap-2 ml-auto md:ml-4 w-full md:w-auto justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingModule(module);
                                        setEditModuleTitle(module.title);
                                    }}
                                >
                                    <Pencil className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveModuleId(module.id);
                                        setIsAddingLesson(true);
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Lesson
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(module.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>

                        <AccordionContent className="pt-2 pb-4 space-y-2">
                            {module.lessons && module.lessons.length > 0 ? (
                                module.lessons.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50 border ml-8">
                                        <div className="flex items-center gap-3">
                                            {lesson.lesson_type === 'video' ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-orange-500" />}
                                            <span className="font-medium">{lesson.title}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-muted-foreground max-w-[200px] truncate">{lesson.content}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    setEditingLesson(lesson);
                                                    setEditLessonTitle(lesson.title);
                                                    setEditLessonContent(lesson.content);
                                                    setEditLessonType(lesson.lesson_type);
                                                }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteLesson(lesson.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">No lessons in this module</div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <Sheet open={isAddingLesson} onOpenChange={setIsAddingLesson}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Add Lesson to Module</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="e.g. Video 1" />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newLessonType} onValueChange={(v: "video" | "pdf") => setNewLessonType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video URL</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Content (URL)</Label>
                            <Input value={newLessonContent} onChange={(e) => setNewLessonContent(e.target.value)} placeholder="https://..." />
                        </div>
                        <Button onClick={handleCreateLesson} disabled={!newLessonTitle || !newLessonContent}>Create Lesson</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
