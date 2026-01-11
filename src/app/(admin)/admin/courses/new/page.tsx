"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, GripVertical, Video, FileText } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Course</h1>
                <div className="flex gap-2">
                    <Link href="/admin/courses"><Button variant="outline">Cancel</Button></Link>
                    <Button>Save Course</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Course Title</Label>
                                <Input placeholder="e.g. Advanced React Patterns" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Course description..." className="min-h-[150px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dev">Development</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Level</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Curriculum</CardTitle>
                            <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Module</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border rounded-lg p-4 bg-muted/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        <h3 className="font-semibold">Module 1: Introduction</h3>
                                    </div>
                                    <Button size="sm" variant="ghost"><Plus className="w-4 h-4 mr-1" /> Add Lesson</Button>
                                </div>
                                <div className="space-y-2 pl-6">
                                    <div className="flex items-center gap-3 p-3 bg-card border rounded-md">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <Video className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">Welcome Video</span>
                                        <span className="ml-auto text-xs text-muted-foreground">Draft</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-card border rounded-md">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <FileText className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">Course Requirements</span>
                                        <span className="ml-auto text-xs text-muted-foreground">Draft</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input type="number" placeholder="49.99" />
                            </div>
                            <div className="space-y-2">
                                <Label>Comparing At ($)</Label>
                                <Input type="number" placeholder="99.99" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Course Image</CardTitle></CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-muted rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                                Upload Image
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
